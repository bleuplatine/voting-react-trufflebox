import React, { useState, useEffect, useRef } from "react";
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./getWeb3";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';

// import "./App.css";

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
    "Débuter la session de vote en cours",
    "Stopper la session de vote terminée",
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
    if (data.owner) console.log(`owner`, data.owner)
    if (data.accounts) console.log(`accounts`, data.accounts);
    if (actualAccount) console.log(`actualAccount`, actualAccount)
    console.log(`workflowStatusId`, workflowStatusId)
  }, [data, actualAccount, workflowStatusId]);

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


      // await instance.events.SetEvent()
      //   .on('data', event => {
      //     let value = event.returnValues.value;
      //     console.log('data', value);
      //     setEventValue(value);
      //   })
      //   .on('changed', changed => console.log('changed', changed))
      //   // .on('error', err => throw err)
      //   .on('connected', str => console.log('connected', str))

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
          break;
        case "3":
          await contract.methods.endVotingSession().send({ from: owner });
          break;
        case "4":
          await contract.methods.tallyVotes().send({ from: owner });
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
      const { accounts, owner, contract } = data;
      const proposal = refProposal.current.value;

      // Interaction avec le smart contract pour ajouter un compte 
      await contract.methods.addProposal(proposal).send({ from: actualAccount || owner });

    } catch (error) {
      // console.log(`error`, error.message)
      if (/Proposals are not allowed yet/.test(error.message)) {
        setMessageAlert("L'enregistrement des propositions n'est pas encore possible !")
        setShowAlert(true)
      } else if (/The proposal cannot be empty/.test(error.message)) {
        setMessageAlert('La proposition ne peut être vide !')
        setShowAlert(true)
      } else {
        setMessageAlert('Erreur inconnue proposal')
        setShowAlert(true)
        console.log(error)
      }
    }
    setContentForm("")
  }

  return !data.web3 ? (
    <div className="container">Loading Web3, accounts, and contract...</div>
  ) : (
    <>
      <div className="container mt-5">
        <Card className="text-center">
          <Card.Header className="fs-1"><strong>{status[workflowStatusId].toUpperCase()}</strong></Card.Header>
          {(actualAccount ? actualAccount.toUpperCase() === data.owner.toUpperCase() : true) &&
            <Card.Body>
              <Form>
                <Button onClick={handleWorkflow} variant="info" type="submit">
                  {workflowStatusId < statusButton.length ? statusButton[workflowStatusId] : "Terminé"}
                </Button>
              </Form>
            </Card.Body>}
        </Card>

        {showAlert1 &&
          <Alert variant="warning" onClose={() => setShowAlert1(false)} dismissible>
            <Alert.Heading>{messageAlert1}</Alert.Heading>
          </Alert>}
      </div>

      {(workflowStatusId === "0") &&
        (actualAccount ? actualAccount.toUpperCase() === data.owner.toUpperCase() : true) &&
        <div className="container mt-5">
          <Card className="text-center">
            <Card.Header><strong>Enregistrer un nouveau voteur</strong></Card.Header>
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
          </Card>

          {showAlert &&
            <Alert variant="warning" onClose={() => setShowAlert(false)} dismissible>
              <Alert.Heading>{messageAlert}</Alert.Heading>
            </Alert>}
          {showEvent &&
            <Alert variant="success" onClose={() => setShowEvent(false)} dismissible>
              <Alert.Heading>{messageEvent}</Alert.Heading>
            </Alert>}
        </div>}

      {(workflowStatusId === "1") &&
        <div className="container mt-5">
          <Card className="text-center">
            <Card.Header><strong>Enregistrer une nouvelle proposition</strong></Card.Header>
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
          </Card>

          {showAlert &&
            <Alert variant="warning" onClose={() => setShowAlert(false)} dismissible>
              <Alert.Heading>{messageAlert}</Alert.Heading>
            </Alert>}
          {showEvent &&
            <Alert variant="success" onClose={() => setShowEvent(false)} dismissible>
              <Alert.Heading>{messageEvent}</Alert.Heading>
            </Alert>}
        </div>}
    </>
  );
};

export default App;
