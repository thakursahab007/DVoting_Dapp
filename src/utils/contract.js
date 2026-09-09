import { Contract, BrowserProvider } from "ethers";
import voitingContractABI from "../abis/DVotingContract.json";
import { DVOTING_ADDRESS } from "../config.js";

export const getcontract = async () => {
    if (!window.ethereum) {
        alert("Metamask is not installed.");
    }

    await window.ethereum.request({
        method: "eth_requestAccounts"
    });

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new Contract(
        DVOTING_ADDRESS,
        voitingContractABI.abi,
        signer
    );
    return contract;

};