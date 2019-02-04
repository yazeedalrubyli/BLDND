import Web3 from "web3";
import starNotaryArtifact from "../../build/contracts/StarNotary.json";

const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = starNotaryArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        starNotaryArtifact.abi,
        deployedNetwork.address,
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
    } catch (error) {
      console.error(error, "Could not connect to contract or chain.");
    }
  },

  setStatus: function(message, elementId) {
    const status = document.getElementById(elementId);
    status.innerHTML = message;
  },

  createStar: async function() {
    const { createStar } = this.meta.methods;
    const name = document.getElementById("starName").value;
    const id = document.getElementById("starId").value;
    await createStar(name, id).send({from: this.account});
    App.setStatus("New Star Owner is " + this.account + "", "createStarStatus");
  },

  lookUp: async function (){
    const { lookUptokenIdToStarInfo, ownerOf } = this.meta.methods;
    const id = document.getElementById("lookid").value;
    let name = await lookUptokenIdToStarInfo(id).call();
    App.setStatus(  "Star: " + name 
                  + "<br>Owner: " + await ownerOf(id).call(),
                  "lookUpStatus"); 
  },

  exchangeStar: async function (){
    const { exchangeStars, ownerOf } = this.meta.methods;
    const id1 = document.getElementById("starIdEx1").value;
    const id2 = document.getElementById("starIdEx2").value;
    await exchangeStars(id1, id2).send({from: this.account});
    App.setStatus(  "Star: " + id1 
                  + "<br>Owner: " + await ownerOf(id1).call()
                  + "<br>--------------------------------------"
                  + "<br>Star: " + id2 
                  + "<br>Owner: " + await ownerOf(id2).call(), 
                  "exchangeStarStatus"); 
  },

  transferStar: async function (){
    const { transferStar, lookUptokenIdToStarInfo, ownerOf } = this.meta.methods;
    const id = document.getElementById("starIdTrans").value;
    const addr = document.getElementById("toAddr").value;
    await transferStar(addr,id).send({from: this.account});
    let name = await lookUptokenIdToStarInfo(id).call();
    App.setStatus(  "Star: " + name 
                  + "<br>From: " + this.account
                  + "<br>To: " + await ownerOf(id).call(),
                  "transferStarStatus");
  }
};

window.App = App;

window.addEventListener("load", async function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    await window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live",);
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"),);
  }

  App.start();
});