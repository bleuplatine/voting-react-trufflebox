import React, { useState, useEffect, useRef } from "react";
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./getWeb3";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';

// import A01 from "./A01.png";

const App = () => {
  const [data, setData] = useState({
    // workflowStatusId: null,
    web3: null,
    accounts: null,
    owner: null,
    contract: null,
  });
  const [showAlert1, setShowAlert1] = useState(false)
  const [messageAlert1, setMessageAlert1] = useState('')
  const [showAlert, setShowAlert] = useState(false)
  const [messageAlert, setMessageAlert] = useState('')
  const [showEvent, setShowEvent] = useState(false)
  const [messageEvent, setMessageEvent] = useState('')
  const [contentForm, setContentForm] = useState('')
  const [eventValue, setEventValue] = useState('')
  const [workflowStatusId, setWorkflowStatusId] = useState("0")
  const [actualAccount, setActualAccount] = useState('')
  const [voter, setVoter] = useState(null)
  const [votersList, setVotersList] = useState([])
  const [proposalsList, setProposalsList] = useState([])
  const [currentVote, setCurrentVote] = useState(null)
  const [voteOK, setVoteOK] = useState(false)
  const [winnersList, setWinnersList] = useState(null)

  const status = [
    'Enregistrement des voteurs en cours',
    'Enregistrement des propositions en cours',
    'Enregistrement des propositions terminée',
    'Session de vote en cours',
    'Session de vote terminée',
    'Résultats des votes'
  ]
  const statusButton = [
    "Débuter l'enregistrement des propositions",
    "Stopper l'enregistrement des propositions",
    "Débuter la session de vote",
    "Stopper la session de vote",
    "Afficher le résultat des votes"
  ]

  const refAddress = useRef();
  const refProposal = useRef();


  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    window.ethereum.on("accountsChanged", accounts => {
      if (accounts.length > 0) setActualAccount(accounts[0]);
    });
  });

  useEffect(() => {
    (workflowStatusId === "3") && (async () => {
      const { contract } = data;
      const voter = await contract.methods.getVoter(actualAccount).call();
      setVoteOK(voter.hasVoted)
    })()
    console.log(`voteOK`, voteOK)
  }, [actualAccount])

  useEffect(() => {
    // if (data.owner) console.log(`owner`, data.owner)
    // if (data.accounts) console.log(`accounts`, data.accounts);
    // if (actualAccount) console.log(`actualAccount`, actualAccount)
    console.log(`workflowStatusId`, workflowStatusId)
    if (currentVote) console.log(`currentVote`, currentVote)
    if (voter) {
      setVotersList(old => [...old, voter])
      setVoter(null)
    }
    if (winnersList) console.log(`winnersList`, winnersList)
  }, [data, actualAccount, workflowStatusId, voter, currentVote, winnersList]);

  useEffect(() => {
    console.log(`proposalsList`, proposalsList)
    console.log(`proposalsListSorted`, [...proposalsList].sort((a, b) => !b[1] - !a[1] || b[1] - a[1]))
  }, [proposalsList]);

  useEffect(() => {
    if (eventValue === "VoterRegistered") {
      setMessageEvent("Le voteur a été enregistré")
      setShowEvent(true)
      setEventValue('')
    }
    if (eventValue === "ProposalRegistered") {
      setMessageEvent("La proposition a été enregistrée")
      setShowEvent(true)
      setEventValue('')
    }
    if (eventValue === "Voted") {
      setMessageEvent("Le vote a été enregistré")
      setShowEvent(true)
      setEventValue('')
    }
  }, [eventValue]);

  const init = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      const owner = await accounts[0];

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = VotingContract.networks[networkId];
      const instance = new web3.eth.Contract(
        VotingContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      const statusId = await instance.methods.getWorkflowStatus().call()
      setWorkflowStatusId(statusId)
      console.log(`statusId`, statusId)

      // Set web3, accounts, and contract to the data, and then proceed with an
      // example of interacting with the contract's methods.
      setData({ web3, accounts, owner, contract: instance });

      // Get All events emitted
      await instance.events.allEvents((err, evt) => {
        setEventValue(evt.event)
        console.log(`evt`, evt.event)
      })

      console.log(`accounts`, data.accounts)

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  const handleWorkflow = async (e) => {
    e.preventDefault()
    setEventValue('')
    try {
      const { owner, contract } = data;
      switch (workflowStatusId) {
        case "0":
          await contract.methods.startProposalsRegistering().send({ from: owner });
          break;
        case "1":
          await contract.methods.endProposalsRegistering().send({ from: owner });
          break;
        case "2":
          await contract.methods.startVotingSession().send({ from: owner });
          fetchAllProposals()
          break;
        case "3":
          await contract.methods.endVotingSession().send({ from: owner });
          break;
        case "4":
          handleResult()
          break;

        default:
          break;
      }
      const statusId = await contract.methods.getWorkflowStatus().call()
      setWorkflowStatusId(statusId)

    } catch (error) {
      console.log(`error`, error)
      if (/Registering proposals cant be started now/.test(error.message)) {
        setMessageAlert1("L'enregistrement des propositions ne peut pas commencer maintenant !")
        setShowAlert1(true)
      } else if (/Registering proposals havent started yet/.test(error.message)) {
        setMessageAlert1("L'enregistrement des propositions n'a pas commencé !")
        setShowAlert1(true)
      } else if (/Registering proposals phase is not finished/.test(error.message)) {
        setMessageAlert1("L'enregistrement des propositions n'est pas terminé !")
        setShowAlert1(true)
      } else if (/Voting session havent started yet/.test(error.message)) {
        setMessageAlert1("La session de votes n'a pas commencé !")
        setShowAlert1(true)
      } else if (/Current status is not voting session ended/.test(error.message)) {
        setMessageAlert1("La session de votes n'est pas terminé !")
        setShowAlert1(true)
      } else {
        setMessageAlert1('Erreur inconnue !')
        setShowAlert1(true)
      }
    }
  }

  const plusVoter = async (e) => {
    e.preventDefault()
    try {
      const { contract, owner } = data;
      const address = refAddress.current.value;

      // Interaction avec le smart contract pour ajouter un compte 
      await contract.methods.addVoter(address).send({ from: owner });
      const voter = await contract.methods.getVoter(address).call();
      setVoter([voter, address])

    } catch (error) {
      // console.log(`error`, error.message)
      if (/Already registered/.test(error.message)) {
        setMessageAlert('Adresse déjà enregistrée !')
        setShowAlert(true)
      } else if (/Voters registration is not open yet/.test(error.message)) {
        setMessageAlert('Enregistrement des voteurs inactive !')
        setShowAlert(true)
      } else {
        setMessageAlert('Erreur inconnue voter')
        setShowAlert(true)
      }
    }
    setContentForm("")
  }

  const plusProposal = async (e) => {
    setEventValue('')
    e.preventDefault()
    try {
      const { owner, contract } = data;
      const val = refProposal.current.value;

      // Interaction avec le smart contract pour ajouter un compte 
      await contract.methods.addProposal(val).send({ from: actualAccount || owner });
      fetchAllProposals()
      // setProposal(val)

    } catch (error) {
      // console.log(`error`, error.message)
      if (/Proposals are not allowed yet/.test(error.message)) {
        setMessageAlert("L'enregistrement des propositions n'est pas encore possible !")
        setShowAlert(true)
      } else if (/The proposal cannot be empty/.test(error.message)) {
        setMessageAlert('La proposition ne peut être vide !')
        setShowAlert(true)
      } else if (/You're not a voter/.test(error.message)) {
        setMessageAlert("Vous n'êtes pas enregistré comme voteur !")
        setShowAlert(true)
      } else {
        setMessageAlert('Erreur inconnue proposal')
        setShowAlert(true)
        console.log(error)
      }
    }
    setContentForm("")
  }

  const fetchAllProposals = async () => {
    const { contract } = data;
    const list = await contract.methods.getAllProposals().call();
    setProposalsList(list)
  }

  const handleVote = async (e) => {
    setEventValue('')
    e.preventDefault()
    try {
      const { owner, contract } = data;
      fetchAllProposals()
      await contract.methods.setVote(currentVote).send({ from: actualAccount || owner });
      setVoteOK(true)

    } catch (error) {
      if (/Voting session havent started yet/.test(error.message)) {
        setMessageAlert("La session de vote n'a pas encore débuté !")
        setShowAlert(true)
      } else if (/You have already voted/.test(error.message)) {
        setMessageAlert('Vous avez déjà voté !')
        setShowAlert(true)
      } else if (/Proposal not found/.test(error.message)) {
        setMessageAlert("La proposition n'existe pas !")
        setShowAlert(true)
      } else if (/You're not a voter/.test(error.message)) {
        setMessageAlert("Vous n'êtes pas enregistré comme voteur !")
        setShowAlert(true)
      } else {
        setMessageAlert('Erreur inconnue vote')
        setShowAlert(true)
        console.log(error)
      }
    }
  }

  const handleResult = async (e) => {
    setEventValue('')
    try {
      const { owner, contract } = data;
      fetchAllProposals()
      await contract.methods.tallyVotesDraw().send({ from: owner });
      const list = await contract.methods.getWinners().call();
      setWinnersList(list)
      const statusId = await contract.methods.getWorkflowStatus().call()
      setWorkflowStatusId(statusId)

    } catch (error) {
      if (/Current status is not voting session ended/.test(error.message)) {
        setMessageAlert("La session de vote n'est pas encore terminée !")
        setShowAlert(true)
      } else if (/You're not a voter/.test(error.message)) {
        setMessageAlert("Vous n'êtes pas enregistré comme voteur !")
        setShowAlert(true)
      } else {
        setMessageAlert('Erreur inconnue result')
        setShowAlert(true)
        console.log(error)
      }
    }
  }

  return !data.web3 ? (
    <div className="container">Loading Web3, accounts, and contract...</div>
  ) : (
    <>
      {/* WORKFLOW */}
      <div className="container mt-5">
        <Card className="text-center">
        <Card.Img variant="top" src={`./img/${workflowStatusId}.png`} />
          <Card.Header className="fs-1 bg-light text-dark"><strong>{status[workflowStatusId].toUpperCase()}</strong></Card.Header>
          {(actualAccount ? actualAccount.toUpperCase() === data.owner.toUpperCase() : true) &&
            workflowStatusId < statusButton.length &&
            <Card.Body>
              <Form>
                <Button onClick={handleWorkflow} variant="info" type="submit">
                  {workflowStatusId < statusButton.length ? statusButton[workflowStatusId] : "Terminé"}
                </Button>
              </Form>
            </Card.Body>}
        </Card>

        {showAlert1 &&
          <Modal
            show={showAlert1}
            onHide={() => setShowAlert(false)}
            dialogClassName="modal-90w"
            aria-labelledby="alert-modal">
            <Modal.Header closeButton className="bg-warning text-black">
              <Modal.Title id="alert-modal">
                <i class="bi bi-exclamation-octagon-fill"></i> ALERTE
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-warning text-dark bg-opacity-75 fs-4">{messageAlert1}</Modal.Body>
          </Modal>}
      </div>

      {/* VOTERS */}
      {(workflowStatusId === "0") &&
        (actualAccount ? actualAccount.toUpperCase() === data.owner.toUpperCase() : true) &&
        <div className="container mt-5">
          <Card className="text-center">
            <Card.Header className="fs-3 bg-light text-black">Enregistrer un nouveau voteur</Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3" controlId="formAddress">
                  <Form.Label>Saisir une adresse Ethereum</Form.Label>
                  <Form.Control type="text" ref={refAddress}
                    value={contentForm} onChange={(e) => setContentForm(e.target.value)} />
                </Form.Group>

                <Button onClick={plusVoter} variant="primary" type="submit">
                  Enregistrer
                </Button>
              </Form>
            </Card.Body>

            {showAlert &&
              <Modal
                show={showAlert}
                onHide={() => setShowAlert(false)}
                dialogClassName="modal-90w"
                aria-labelledby="alert-modal">
                <Modal.Header closeButton className="bg-warning text-dark">
                  <Modal.Title id="alert-modal">
                    <i class="bi bi-exclamation-octagon-fill"></i> ALERTE
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-warning text-dark bg-opacity-75 fs-4">{messageAlert}</Modal.Body>
              </Modal>}

            {showEvent &&
              <Modal
                show={showEvent}
                onHide={() => setShowEvent(false)}
                dialogClassName="modal-90w"
                aria-labelledby="alert-modal">
                <Modal.Header closeButton className="bg-success text-white">
                  <Modal.Title id="alert-modal">
                    <i class="bi bi-check-square-fill"></i> VALIDATION
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-success text-white bg-opacity-75 fs-4">{messageEvent}</Modal.Body>
              </Modal>}


            {votersList[0] &&
              <>
                <Card.Footer className="fs-3 bg-light text-black">Liste des comptes autorisés</Card.Footer>
                <ListGroup variant="flush">
                  {votersList &&
                    votersList.map((a, i) => <ListGroup.Item key={i}>{a}</ListGroup.Item>)
                  }
                </ListGroup>
              </>}
          </Card>

        </div>}

      {/* PROPOSALS */}
      {(workflowStatusId === "1") &&
        <div className="container mt-5">
          <Card className="text-center">
            <Card.Header className="fs-3  bg-light text-black">Enregistrer une nouvelle proposition</Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3" controlId="formAddress">
                  <Form.Label>Décrire votre proposition</Form.Label>
                  <Form.Control type="text" ref={refProposal}
                    value={contentForm} onChange={(e) => setContentForm(e.target.value)} />
                </Form.Group>

                <Button onClick={plusProposal} variant="primary" type="submit">
                  Enregistrer
                </Button>
              </Form>
            </Card.Body>

            {showAlert &&
              <Modal
                show={showAlert}
                onHide={() => setShowAlert(false)}
                dialogClassName="modal-90w"
                aria-labelledby="alert-modal">
                <Modal.Header closeButton className="bg-warning text-dark">
                  <Modal.Title id="alert-modal">
                    <i class="bi bi-exclamation-octagon-fill"></i> ALERTE
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-warning text-dark bg-opacity-75 fs-4">{messageAlert}</Modal.Body>
              </Modal>}

            {showEvent &&
              <Modal
                show={showEvent}
                onHide={() => setShowEvent(false)}
                dialogClassName="modal-90w"
                aria-labelledby="alert-modal">
                <Modal.Header closeButton className="bg-success text-white">
                  <Modal.Title id="alert-modal">
                    <i class="bi bi-check-square-fill"></i> VALIDATION
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-success text-white bg-opacity-75 fs-4">{messageEvent}</Modal.Body>
              </Modal>}


            {proposalsList[0] &&
              <>
                <Card.Header className="fs-3  bg-light text-black">Liste des propositions</Card.Header>
                <ListGroup variant="flush">
                  {proposalsList &&
                    proposalsList.map((a, i) => <ListGroup.Item key={i}>{a[0]}</ListGroup.Item>)
                  }
                </ListGroup>
              </>}
          </Card>
        </div>}

      {/* VOTING */}
      {(workflowStatusId === "3") &&
        !voteOK &&
        <div className="container mt-5">
          <Card className="text-center">
            <Card.Header className="fs-3 bg-light text-black">Voter pour une proposition</Card.Header>
            <Card.Body>
              <Form onSubmit={handleVote}>
                <Form.Group className="text-start mb-3">
                  {proposalsList &&
                    proposalsList.map((a, i) =>
                      <Form.Check
                        key={i}
                        onChange={(e) => setCurrentVote(e.target.id)}
                        type="radio"
                        label={a[0]}
                        name="formRadios"
                        id={i}
                      />)
                  }
                </Form.Group>
                <Form.Group >
                  <Button type="submit">Voter</Button>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>

          {showAlert &&
            <Modal
              show={showAlert}
              onHide={() => setShowAlert(false)}
              dialogClassName="modal-90w"
              aria-labelledby="alert-modal">
              <Modal.Header closeButton className="bg-warning text-dark">
                <Modal.Title id="alert-modal">
                  <i class="bi bi-exclamation-octagon-fill"></i> ALERTE
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="bg-warning text-dark bg-opacity-75 fs-4">{messageAlert}</Modal.Body>
            </Modal>}
        </div>}
      {(workflowStatusId === "3") &&
        showEvent &&
        <Modal
          show={showEvent}
          onHide={() => setShowEvent(false)}
          dialogClassName="modal-90w"
          aria-labelledby="alert-modal">
          <Modal.Header closeButton className="bg-success text-white">
            <Modal.Title id="alert-modal">
              <i class="bi bi-check-square-fill"></i> VALIDATION
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-success text-white bg-opacity-75 fs-4">{messageEvent}</Modal.Body>
        </Modal>}

      {/* RESULT */}
      {/* .sort((a, b) => b[1] - a[1]) */}
      {(workflowStatusId === "5") &&
        <div className="container mt-5">
          <Card className="text-center">
            <Card.Header className="fs-3 bg-light text-black">Proposition(s) adoptée(s)</Card.Header>
            <ListGroup variant="flush" className="fs-4">
              {winnersList &&
                winnersList.map((a, i) => <ListGroup.Item className="bg-info" key={i}>{a[0]}</ListGroup.Item>)
              }
            </ListGroup>
          </Card>
          <Card className="text-center mt-5">
            <Card.Header className="fs-3 bg-light text-black" >Résultat des votes</Card.Header>
            <Table striped bordered>
              <thead>
                <tr>
                  <th>Nombre de votes</th>
                  <th>Propositions</th>
                </tr>
              </thead>
              <tbody>
                {proposalsList &&
                  [...proposalsList]
                    .sort((a, b) => !b[1] - !a[1] || b[1] - a[1])
                    .map((a, i) => <tr key={i}><td>{a[1]}</td><td>{a[0]}</td></tr>)
                }
              </tbody>
            </Table>
          </Card>

          {showAlert &&
            <Modal
              show={showAlert}
              onHide={() => setShowAlert(false)}
              dialogClassName="modal-90w"
              aria-labelledby="alert-modal">
              <Modal.Header closeButton className="bg-warning text-dark">
                <Modal.Title id="alert-modal">
                  <i class="bi bi-exclamation-octagon-fill"></i> ALERTE
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="bg-warning text-dark bg-opacity-75 fs-4">{messageAlert}</Modal.Body>
            </Modal>}
        </div>}
    </>
  );
};

export default App;
