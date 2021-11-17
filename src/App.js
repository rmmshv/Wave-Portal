import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import wavePortal from './utils/wavePortal.json';

const App = () => { 
  const [currentAccount, setCurrentAccount] = useState("");  
  const [allWaves, setAllWaves] = useState([]);
  const [currentCount, setCurrentCount] = useState(null);
  const [message, setMessage] = useState("");

  const contractAddress = "0xdA215Be6d729a3D339C10a9263551388C595DF0E";

  const getWaves = async() => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, wavePortal.abi, signer);

        const waves = await wavePortalContract.getAllWaves();

        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
          });
        });
      console.log("wavesCleaned: ", wavesCleaned);
      setAllWaves(wavesCleaned);
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * Listen in for emitter events!
 */
useEffect(() => {
  let wavePortalContract;

  const onNewWave = (from, timestamp, message) => {
    console.log('NewWave', from, timestamp, message);
    setAllWaves(prevState => [
      ...prevState,
      {
        address: from,
        timestamp: new Date(timestamp * 1000),
        message: message,
      },
    ]);
  };

  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    wavePortalContract = new ethers.Contract(contractAddress, wavePortal.abi, signer);
    wavePortalContract.on('NewWave', onNewWave);
  }

  return () => {
    if (wavePortalContract) {
      wavePortalContract.off('NewWave', onNewWave);
    }
  };
}, []);

  const checkIfWalletIsConnected = async () => {
  try {
    const { ethereum } = window;

      if (!ethereum) {
        console.log("Please make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        getWaves();
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Please get MetaMask first <3");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress, 
          wavePortal.abi, 
          signer
        );

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        const waveTxn = await wavePortalContract.wave(message);
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        setCurrentCount(count.toNumber());

        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
});

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        👋 Hey There!
        </div>

        <div className="bio">I'm Rimma and I study CS and work towards becoming a blockchain dev.<br/><br/>
        This is one of my first web3 projects.<br/><br/>
        Connect your MetaMask wallet (Rinkeby) and wave at me for a chance to win some testnet ETH✨</div>

        
        <input
          className="input-field" 
          placeholder=" gm say it back :)"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        
        <button className="button" onClick={wave}>
        👋 Wave
        </button>
    
        <button className="button" onClick={connectWallet}> 
        Connect Wallet
        </button>

      {allWaves.map((wave, index) => {
          return (
            <div
              className="transactions"
              key={index}
              style={{
                marginTop: "16px",
                padding: "8px",
              }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>
          );
        })}
      <div className="connect">Find me here:</div>   
      <div className="social-icons">

      
      <a href="https://www.linkedin.com/in/rmmshv/" target="_blank"><img src={require('./img/linkedin.png')}/></a>  
      <a href="https://twitter.com/peepepoopoo666" target="_blank"><img src={require('./img/twitter.jpeg')}/></a>    
      </div>
      </div>
    </div>
  );
};

export default App;
