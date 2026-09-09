import { useState } from 'react';
import './App.css';
import { getcontract } from './utils/contract';

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [electionDescription, setElectionDescription] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [electionId, setElectionId] = useState(0);
  const [candidateId, setCandidateId] = useState(0);
  const [voterAddress, setVoterAddress] = useState("");
  const [winner, setWinner] = useState(null);
  const [newOwnerAddress, setNewOwnerAddress] = useState("");
  const [candidateLookupId, setCandidateLookupId] = useState(0);
  const [candidateLookupName, setCandidateLookupName] = useState("");
  const [electionStatus, setElectionStatus] = useState("");
  const [allCandidates, setAllCandidates] = useState([]);
  const [electionCandidates, setElectionCandidates] = useState([]);
  const [votesElectionId, setVotesElectionId] = useState(0);
  const [votesCandidateId, setVotesCandidateId] = useState(0);
  const [candidateVotes, setCandidateVotes] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  const statusMap = {
    0: "NOT_STARTED",
    1: "ACTIVE",
    2: "ENDED"
  };

  const parseRpcError = (error, fallback = "Transaction Failed") => {
    return (
      error?.reason ||
      error?.shortMessage ||
      error?.message ||
      fallback
    );
  };


  async function connectWallet() {
    try {
      if (!window.ethereum) {
        alert("MetaMask not installed");
        return;
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      });
      setWalletAddress(accounts[0]);
      setStatusMessage(`Wallet connected: ${accounts[0]}`);

    } catch (error) {
      const message = parseRpcError(error, "Failed to connect wallet");
      alert(message);
      setStatusMessage(message);
      console.log(`error while connecting wallet :- ${error}`);
    }
  }

  async function addElection() {
    try {
      console.log("Inside the add election function");
      const contract = await getcontract();
      const tx = await contract.addElection(electionDescription);
      await tx.wait();
      alert("Election Added Successfully.");
      setStatusMessage("Election added successfully");
      setElectionDescription("");
    } catch (error) {
      let message = parseRpcError(error);
      alert(message);
      setStatusMessage(message);
      console.log(error);
    }
  }

  async function addCandidate() {
    try {
      console.log("Inside add candidate function");
      const contract = await getcontract();
      const tx = await contract.addCandidate(candidateName);
      await tx.wait();
      alert("Candidate Added Successfully.");
      setStatusMessage("Candidate added successfully");
      setCandidateName("");
    } catch (error) {
      let message = parseRpcError(error);
      alert(message);
      setStatusMessage(message);
      console.log(error);
    }
  }

  const addCandidateToElection = async () => {
    try {
      const contract = await getcontract();
      const tx = await contract.addCandidateToElection(electionId, candidateId);
      await tx.wait();
      alert(`Candidate ${candidateId} added to election ${electionId}`);
      setStatusMessage(`Candidate ${candidateId} added to election ${electionId}`);
    } catch (error) {
      let message = parseRpcError(error);
      alert(message);
      setStatusMessage(message);
      console.log(error);
    }
  };

  const registerVoter = async () => {
    try {
      const contract = await getcontract();
      const tx = await contract.registerVoter(voterAddress);
      await tx.wait();
      alert("Voter registered Successfully");
      setStatusMessage(`Voter registered: ${voterAddress}`);
    } catch (error) {
      let message = parseRpcError(error);
      alert(message);
      setStatusMessage(message);
      console.log(error);
    }
  };

  const startElection = async () => {
    try {
      const contract = await getcontract();
      const tx = await contract.startElection(electionId);
      await tx.wait();
      alert("Election started Successfully");
      setStatusMessage(`Election ${electionId} started`);
    } catch (error) {
      let message = parseRpcError(error);
      alert(message);
      setStatusMessage(message);
      console.log(error);
    }
  };

  const endElection = async () => {
    try {
      const contract = await getcontract();
      const tx = await contract.endElection(electionId);
      await tx.wait();
      alert("Election Ended Successfully");
      setStatusMessage(`Election ${electionId} ended`);
    } catch (error) {
      let message = parseRpcError(error);
      alert(message);
      setStatusMessage(message);
      console.log(error);
    }
  };

  const voteCandidate = async () => {
    try {
      const contract = await getcontract();
      const tx = await contract.vote(electionId, candidateId);
      await tx.wait();
      alert("voted successfully");
      setStatusMessage(`Voted candidate ${candidateId} in election ${electionId}`);
    } catch (error) {
      let message = parseRpcError(error);
      alert(message);
      setStatusMessage(message);
      console.log(error);
    }
  };

  async function getWinner() {
    try {
      const contract = await getcontract();
      const winner = await contract.getWinner(electionId);
      setWinner(winner);
      alert(`Winner: ${winner}`);
      setStatusMessage(`Winner fetched for election ${electionId}`);
      console.log(winner);
    } catch (error) {
      let message = parseRpcError(error, "Failed to fetch winner");
      alert(message);
      setStatusMessage(message);
      console.log(error);
    }
  }

  async function transferOwnership() {
    try {
      const contract = await getcontract();
      const tx = await contract.transferOwnership(newOwnerAddress);
      await tx.wait();
      alert("Ownership transferred successfully");
      setStatusMessage(`Ownership transferred to ${newOwnerAddress}`);
      setNewOwnerAddress("");
    } catch (error) {
      const message = parseRpcError(error);
      alert(message);
      setStatusMessage(message);
      console.log(error);
    }
  }

  async function getElectionStatus() {
    try {
      const contract = await getcontract();
      const status = await contract.getElectionStatus(electionId);
      const statusText = statusMap[Number(status)] || "UNKNOWN";
      setElectionStatus(statusText);
      setStatusMessage(`Election ${electionId} status: ${statusText}`);
    } catch (error) {
      const message = parseRpcError(error, "Failed to fetch election status");
      alert(message);
      setStatusMessage(message);
      console.log(error);
    }
  }

  async function getCandidateById() {
    try {
      const contract = await getcontract();
      const candidate = await contract.getCandidate(candidateLookupId);
      setCandidateLookupName(candidate);
      setStatusMessage(`Candidate ${candidateLookupId}: ${candidate}`);
    } catch (error) {
      const message = parseRpcError(error, "Failed to fetch candidate");
      alert(message);
      setStatusMessage(message);
      console.log(error);
    }
  }

  async function getAllCandidates() {
    try {
      const contract = await getcontract();
      const list = await contract.getAllCandidates();
      const parsedList = list.map((item) => ({
        id: Number(item.id),
        name: item.name
      }));
      setAllCandidates(parsedList);
      setStatusMessage(`Loaded ${parsedList.length} candidates`);
    } catch (error) {
      const message = parseRpcError(error, "Failed to fetch candidates");
      alert(message);
      setStatusMessage(message);
      console.log(error);
    }
  }

  async function getElectionCandidates() {
    try {
      const contract = await getcontract();
      const list = await contract.getElectionCandidates(electionId);
      const parsedList = list.map((item) => Number(item));
      setElectionCandidates(parsedList);
      setStatusMessage(`Loaded candidates for election ${electionId}`);
    } catch (error) {
      const message = parseRpcError(error, "Failed to fetch election candidates");
      alert(message);
      setStatusMessage(message);
      console.log(error);
    }
  }

  async function getCandidateVotes() {
    try {
      const contract = await getcontract();
      const votes = await contract.getCandidateVotes(votesElectionId, votesCandidateId);
      const parsedVotes = Number(votes);
      setCandidateVotes(parsedVotes);
      setStatusMessage(`Votes for candidate ${votesCandidateId}: ${parsedVotes}`);
    } catch (error) {
      const message = parseRpcError(error, "Failed to fetch candidate votes");
      alert(message);
      setStatusMessage(message);
      console.log(error);
    }
  }

  return (
    <div className='page'>
      <div className='glow glow-one' />
      <div className='glow glow-two' />

      <header className='header card'>
        <div>
          <h1>DVoting Control Panel</h1>
          <p>Manage elections, candidates, voters, and live read operations.</p>
        </div>
        <button className='btn btn-primary' onClick={connectWallet}>
          {walletAddress ? `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Connect Wallet"}
        </button>
      </header>

      <section className='status card'>
        <strong>Latest status:</strong> {statusMessage || "No action yet"}
      </section>

      <section className='grid'>
        <div className='card'>
          <h2>Add Election</h2>
          <input
            type='text'
            placeholder='Enter election purpose'
            value={electionDescription}
            onChange={(e) => setElectionDescription(e.target.value)}
          />
          <button className='btn' onClick={addElection}>Add Election</button>
        </div>

        <div className='card'>
          <h2>Add Candidate</h2>
          <input
            type='text'
            placeholder='Enter candidate name'
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
          />
          <button className='btn' onClick={addCandidate}>Add Candidate</button>
        </div>

        <div className='card'>
          <h2>Add Candidate To Election</h2>
          <input
            type='number'
            placeholder='Election ID'
            value={electionId}
            onChange={(e) => setElectionId(e.target.value)}
          />
          <input
            type='number'
            placeholder='Candidate ID'
            value={candidateId}
            onChange={(e) => setCandidateId(e.target.value)}
          />
          <button className='btn' onClick={addCandidateToElection}>Assign Candidate</button>
        </div>

        <div className='card'>
          <h2>Register Voter</h2>
          <input
            type='text'
            placeholder='Voter wallet address'
            value={voterAddress}
            onChange={(e) => setVoterAddress(e.target.value)}
          />
          <button className='btn' onClick={registerVoter}>Register</button>
        </div>

        <div className='card'>
          <h2>Election Control</h2>
          <input
            type='number'
            placeholder='Election ID'
            value={electionId}
            onChange={(e) => setElectionId(e.target.value)}
          />
          <div className='row'>
            <button className='btn' onClick={startElection}>Start</button>
            <button className='btn btn-danger' onClick={endElection}>End</button>
          </div>
        </div>

        <div className='card'>
          <h2>Vote</h2>
          <input
            type='number'
            placeholder='Election ID'
            value={electionId}
            onChange={(e) => setElectionId(e.target.value)}
          />
          <input
            type='number'
            placeholder='Candidate ID'
            value={candidateId}
            onChange={(e) => setCandidateId(e.target.value)}
          />
          <button className='btn' onClick={voteCandidate}>Vote Candidate</button>
        </div>

        <div className='card'>
          <h2>Get Winner</h2>
          <input
            type='number'
            placeholder='Election ID'
            value={electionId}
            onChange={(e) => setElectionId(e.target.value)}
          />
          <button className='btn' onClick={getWinner}>Get Winner</button>
          {winner && <p className='result'>Winner: {winner}</p>}
        </div>

        <div className='card'>
          <h2>Transfer Ownership</h2>
          <input
            type='text'
            placeholder='New owner address'
            value={newOwnerAddress}
            onChange={(e) => setNewOwnerAddress(e.target.value)}
          />
          <button className='btn btn-danger' onClick={transferOwnership}>Transfer</button>
        </div>

        <div className='card'>
          <h2>Election Status</h2>
          <input
            type='number'
            placeholder='Election ID'
            value={electionId}
            onChange={(e) => setElectionId(e.target.value)}
          />
          <button className='btn' onClick={getElectionStatus}>Get Status</button>
          {electionStatus && <p className='result'>Status: {electionStatus}</p>}
        </div>

        <div className='card'>
          <h2>Get Candidate By ID</h2>
          <input
            type='number'
            placeholder='Candidate ID'
            value={candidateLookupId}
            onChange={(e) => setCandidateLookupId(e.target.value)}
          />
          <button className='btn' onClick={getCandidateById}>Get Candidate</button>
          {candidateLookupName && <p className='result'>Name: {candidateLookupName}</p>}
        </div>

        <div className='card'>
          <h2>Get All Candidates</h2>
          <button className='btn' onClick={getAllCandidates}>Load Candidates</button>
          <div className='list'>
            {allCandidates.map((item) => (
              <p key={item.id}>#{item.id} - {item.name}</p>
            ))}
          </div>
        </div>

        <div className='card'>
          <h2>Get Election Candidates</h2>
          <input
            type='number'
            placeholder='Election ID'
            value={electionId}
            onChange={(e) => setElectionId(e.target.value)}
          />
          <button className='btn' onClick={getElectionCandidates}>Load IDs</button>
          {electionCandidates.length > 0 && (
            <p className='result'>IDs: {electionCandidates.join(", ")}</p>
          )}
        </div>

        <div className='card'>
          <h2>Get Candidate Votes</h2>
          <input
            type='number'
            placeholder='Election ID'
            value={votesElectionId}
            onChange={(e) => setVotesElectionId(e.target.value)}
          />
          <input
            type='number'
            placeholder='Candidate ID'
            value={votesCandidateId}
            onChange={(e) => setVotesCandidateId(e.target.value)}
          />
          <button className='btn' onClick={getCandidateVotes}>Get Votes</button>
          {candidateVotes !== null && <p className='result'>Votes: {candidateVotes}</p>}
        </div>
      </section>
    </div>
  );
}

export default App;
