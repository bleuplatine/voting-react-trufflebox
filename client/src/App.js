import React, { useState, useEffect, useRef } from "react";
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./getWeb3";

import ModalAlert from './components/ModalAlert'
import ModalEvent from './components/ModalEvent'
import Workflow from './components/Workflow'
import Voters from './components/Voters'
import Proposals from './components/Proposals'
import Voting from './components/Voting'
import Results from './components/Results'

import img0 from "./img/0.svg";
import img1 from "./img/1.svg";
import img2 from "./img/2.svg";
import img3 from "./img/3.svg";
import img4 from "./img/4.svg";
import img5 from "./img/5.svg";
import logo1 from "./img/logo1.svg";
import logo2 from "./img/logo2.svg";

const App = () => {
  const [data, setData] = useState({
    web3: null,
    accounts: null,
    owner: null,
    contract: null,
  });

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
  const [srcImg, setSrcImg] = useState(img0)

  const statusWF = [
    'Enregistrement des voteurs en cours',
    'Enregistrement des propositions en cours',
    'Enregistrement des propositions terminée',
    'Session de vote en cours',
    'Session de vote terminée',
    'Résultats des votes'
  ]
  const txtWF = [
    "L'administrateur enregistre actuellement l'adresse de chaque compte Ethereum des participants éligibles au dépot de propositions suivi des votes.",
    "Chaque proposition doit être conforme aux conditions du SNP et fait l'objet d'une vérification de recevabilité avant démarrage de la session de vote.",
    "Enregistrement des propositions terminée",
    "Session de vote en cours",
    "Session de vote terminée",
    "Résultats des votes"
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

  const closeModalAlert = () => setShowAlert(false)
  const closeModalEvent = () => setShowEvent(false)
  const onChangeTargetValue = (e) => setContentForm(e.target.value)
  const onChangeTargetId = (e) => setCurrentVote(e.target.id)


  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    window.ethereum.on("accountsChanged", accounts => {
      if (accounts.length > 0) setActualAccount(accounts[0]);
    });
  });

  useEffect(() => {
    switch (workflowStatusId) {
      case "1":
        setSrcImg(img1)
        break;
      case "2":
        setSrcImg(img2)
        break;
      case "3":
        setSrcImg(img3)
        break;
      case "4":
        setSrcImg(img4)
        break;
      case "5":
        setSrcImg(img5)
        break;
      default:
        break;
    }
    console.log(`workflowStatusId`, workflowStatusId)
  }, [workflowStatusId]);

  useEffect(() => {
    (workflowStatusId === "3") && (async () => {
      const { contract } = data;
      const voter = await contract.methods.getVoter(actualAccount).call();
      setVoteOK(voter.hasVoted)
    })()
  }, [actualAccount])

  useEffect(() => {
    if (voter) {
      setVotersList(old => [...old, voter])
      setVoter(null)
    }
    console.log(`votersList`, votersList)
  }, [voter]);

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

      // Set web3, accounts, and contract to the data, and then proceed with an
      // example of interacting with the contract's methods.
      setData({ web3, accounts, owner, contract: instance });

      // Get All events emitted
      await instance.events.allEvents((err, evt) => {
        setEventValue(evt.event)
      })

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
        setMessageAlert("L'enregistrement des propositions ne peut pas commencer maintenant !")
        setShowAlert(true)
      } else if (/Registering proposals havent started yet/.test(error.message)) {
        setMessageAlert("L'enregistrement des propositions n'a pas commencé !")
        setShowAlert(true)
      } else if (/Registering proposals phase is not finished/.test(error.message)) {
        setMessageAlert("L'enregistrement des propositions n'est pas terminé !")
        setShowAlert(true)
      } else if (/Voting session havent started yet/.test(error.message)) {
        setMessageAlert("La session de votes n'a pas commencé !")
        setShowAlert(true)
      } else if (/Current status is not voting session ended/.test(error.message)) {
        setMessageAlert("La session de votes n'est pas terminé !")
        setShowAlert(true)
      } else {
        setMessageAlert('Erreur inconnue !')
        setShowAlert(true)
      }
    }
  }

  const plusVoter = async (e) => {
    e.preventDefault()
    try {
      const { contract, owner } = data;
      const address = refAddress.current.value;

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
      } else if (/The address cannot be empty/.test(error.message)) {
        setMessageAlert("L'adresse ne peut être vide !")
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

      await contract.methods.addProposal(val).send({ from: actualAccount || owner });
      fetchAllProposals()

    } catch (error) {
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

  const { owner, web3 } = data
  return !web3 ? (
    <div className="container">Loading Web3, accounts, and contract...</div>
  ) : (

    <>

      <nav className='bg-black '>
        <div className='container'>
          <div className='row py-3'>
            <div class="col text-start text-white fw-bold">
              <img src={logo1} className="d-inline-block align-top" alt="" height="35" />
            </div>
            {/* <div class="col text-end text-white">ouvert depuis 02:36</div> */}
          </div>
        </div>
      </nav>

      {/* WORKFLOW */}
      <Workflow srcImg={srcImg} workflowStatusId={workflowStatusId} statusWF={statusWF} txtWF={txtWF} actualAccount={actualAccount} statusButton={statusButton} owner={owner} handleWorkflow={handleWorkflow} />


      {/* VOTERS */}
      {(workflowStatusId === "0") &&
        <Voters contentForm={contentForm} refAddress={refAddress} votersList={votersList} plusVoter={plusVoter} onChangeTargetValue={onChangeTargetValue} />
      }

      {/* PROPOSALS */}
      {(workflowStatusId === "1") &&
        <Proposals contentForm={contentForm} refProposal={refProposal} proposalsList={proposalsList} plusProposal={plusProposal} onChangeTargetValue={onChangeTargetValue} />
      }

      {/* VOTING */}
      {(workflowStatusId === "3") &&
        !voteOK &&
        <Voting handleVote={handleVote} proposalsList={proposalsList} onChangeTargetId={onChangeTargetId} />
      }

      {/* RESULTS */}
      {(workflowStatusId === "5") &&
        <Results winnersList={winnersList} proposalsList={proposalsList} />
      }

      {showAlert &&
        <ModalAlert showAlert={showAlert} messageAlert={messageAlert} closeModalAlert={closeModalAlert} />
      }
      {showEvent &&
        <ModalEvent showEvent={showEvent} messageEvent={messageEvent} closeModalEvent={closeModalEvent} />
      }

      <footer className="py-5 bg-primary bg-gradient text-center">
        <img src={logo2} alt="" height="100" />
      </footer>
      <footer className="py-3 bg-black">
        <div className="container"><p className="m-0 text-end text-white">
          Copyright &copy; ULTRASECURE 2021</p></div>
      </footer>
    </>
  );
};

export default App;
