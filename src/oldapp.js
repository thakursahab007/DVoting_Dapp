import { useState, useEffect } from 'react';
import './App.css';
import { getcontract } from './utils/contract';
import { ConstructorFragment } from 'ethers';

function oldApp() {
    const [walletAddress, setWalletAddress] = useState(null);
    const [electionDescription, setElectionDescription] = useState("");
    const [candidateName, setCandidateName] = useState("");
    const [electionId, setElectionId] = useState(0);
    const [candidateId, setCandidateId] = useState(0);
    const [voterAddress, setVoterAddress] = useState("");
    const [winner, setWinner] = useState(null);


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

        } catch (error) {
            console.log(`error while connecting wallet :- ${error}`)
        }
    }

    async function addElection() {
        try {
            console.log("Inside the add election function");
            const contract = await getcontract();
            const tx = await contract.addElection(electionDescription);
            await tx.wait();
            alert("Election Added Successfully.");
            setElectionDescription("");
        } catch (error) {
            let message = "Transaction Failed";
            alert(message);
            console.log(error);
        }
    }
    async function addCandidate() {
        try {
            console.log("Inside add candidate function")
            const contract = await getcontract();
            const tx = await contract.addCandidate(candidateName);
            await tx.wait();
            alert("Candidate Added Successfully.");
            setCandidateName("");
        } catch (error) {
            let message = "Transaction Failed";
            alert(message);
            console.log(error);
        }
    }
    const addCandidateToElection = async () => {
        try {
            const contract = await getcontract();
            const tx = await contract.addCandidateToElection(electionId, candidateId);
            await tx.wait();
            alert(`Candidate ${candidateId} added to election ${electionId}`);
        } catch (error) {
            let message = "Transaction Failed";
            alert(message);
            console.log(error);
        }
    }
    const registerVoter = async () => {
        try {
            const contract = await getcontract();
            const tx = await contract.registerVoter(voterAddress);
            await tx.wait();
            alert("Voter registered Successfully");
        } catch (error) {
            let message = "Transaction Failed";
            alert(message);
            console.log(error);
        }
    }
    const startElection = async () => {
        try {
            const contract = await getcontract();
            const tx = await contract.startElection(electionId);
            await tx.wait();
            alert("Election started Successfully");
        } catch (error) {
            let message = "Transaction Failed";
            alert(message);
            console.log(error);
        }
    }
    const endElection = async () => {
        try {
            const contract = await getcontract();
            const tx = await contract.endElection(electionId);
            await tx.wait();
            alert("Election Ended Successfully");
        } catch (error) {
            let message = "Transaction Failed";
            alert(message);
            console.log(error);
        }
    }
    const voteCandidate = async () => {
        try {
            const contract = await getcontract();
            const tx = await contract.vote(electionId, candidateId);
            await tx.wait();
            alert("voted successfully");
        } catch (error) {
            let message = "Transaction Failed";
            alert(message);
            console.log(error);
        }
    }
    async function getWinner() {
        try {
            const contract = await getcontract();
            const winner = await contract.getWinner(electionId);
            setWinner(winner);
            alert(`Winner: ${winner}`);
            console.log(winner);
        } catch (error) {
            let message = "Transaction Failed";
            alert(message);
            console.log(error);
        }
    }
    return (
        <div style={{ padding: "40px" }}>
            <button onClick={connectWallet}>
                {walletAddress ? `Connected: ${walletAddress}` : "Connect Wallet"}
            </button>
            <hr />
            <h2>Add Election</h2>
            <input
                type='text'
                placeholder='Enter Election Moto'
                value={electionDescription}
                onChange={(e) => setElectionDescription(e.target.value)}
            />
            <button onClick={addElection}>Add Election</button>
            <hr />
            <h2>Add Candidate</h2>
            <input
                type='text'
                placeholder='Enter Candidate Name'
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
            />
            <button onClick={addCandidate}>Add Candidate</button>
            <hr />
            <h2>Add Candidate to Election</h2>
            <input
                type='text'
                placeholder='Enter Election ID'
                value={electionId}
                onChange={(e) => setElectionId(e.target.value)}
            />
            <input
                type='text'
                placeholder='Enter Candidate ID'
                value={candidateId}
                onChange={(e) => setCandidateId(e.target.value)}
            />
            <button onClick={addCandidateToElection}>Add Candidate</button>
            <hr />
            <h2>Register Voter</h2>
            <input
                type='text'
                placeholder='Enter Voter Address'
                value={voterAddress}
                onChange={(e) => setVoterAddress(e.target.value)}
            />
            <button onClick={registerVoter}>Register Voter</button>
            <hr />
            <h2>Start Election</h2>
            <input
                type='text'
                placeholder='Enter Election ID'
                value={electionId}
                onChange={(e) => setElectionId(e.target.value)}
            />
            <button onClick={startElection}>Start Election</button>
            <hr />
            <h2>End Election</h2>
            <input
                type='text'
                placeholder='Enter Election ID'
                value={electionId}
                onChange={(e) => setElectionId(e.target.value)}
            />
            <button onClick={endElection}>End Election</button>
            <hr />
            <h2>Vote to Election</h2>
            <input
                type='text'
                placeholder='Enter Election ID'
                value={electionId}
                onChange={(e) => setElectionId(e.target.value)}
            />
            <input
                type='text'
                placeholder='Enter Candidate ID'
                value={candidateId}
                onChange={(e) => setCandidateId(e.target.value)}
            />
            <button onClick={voteCandidate}>Vote Candidate</button>
            <hr />
            <h2>Get Election Winner</h2>
            <input
                type='int'
                placeholder='Enter Election ID'
                value={electionId}
                onChange={(e) => setElectionId(e.target.value)}
            />
            <button onClick={getWinner}>Get Winner</button>
            {winner && <p>Winner: {winner}</p>}

        </div>
    );
}

export default oldApp;
