const Block = require("./Block.js");
const Blockchain = require("./Blockchain.js");
const DB = require("./DB.js");


let blockchain = new Blockchain();
let getChain = async() =>{
	await blockchain.getChain();
}

getChain();

(function theLoop(i) {
    setTimeout(async function() {
        let blockTest = new Block("Test Block - " + (blockchain.chain.length));
        await blockchain.addBlock(blockTest);
        i++;
        (i < 10)?theLoop(i):blockchain.validateChain();;
    }, 1000);
})(0);