
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Display1 from "./components/Display1";

import Modal from "./components/Modal";
import "./App.css";
import abi from "./constants/constants";
import Upload from "./components/Upload";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => { 
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        let contractAddress = '0xb430723e86Ca434c2D3aA1365F13e072EcF9F968';

        const contract = new ethers.Contract(
          contractAddress,
          abi,
          signer
        );
        //console.log(contract);
        setContract(contract);
        setProvider(provider);
      } else {
        console.error("Metamask is not installed");
      }
    };
    provider && loadProvider();
  }, []);
  return (
    <>
      {!modalOpen && (
        <button className="share" onClick={() => setModalOpen(true)}>
          Share
        </button>
      )}
      {modalOpen && (
        <Modal setModalOpen={setModalOpen} contract={contract}></Modal>
      )}

      <div className="App">
        <h1 style={{ color: "white" }}>Decentralized Storage</h1>
        <div class="bg"></div>
        <div class="bg bg2"></div>
        <div class="bg bg3"></div>

        <p style={{ color: "white" }}>
          Account : {account ? account : "Not connected"}
        </p>
        {/* <FileUpload
          account={account}
          provider={provider}
          contract={contract}
        ></FileUpload> */}

        <Upload contract={contract} account={account}/>
        {/* <Display contract={contract} account={account}></Display> */}
      </div>
    </>
  );
}

export default App;
