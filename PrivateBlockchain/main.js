const Block = require("./Block.js");
const Blockchain = require("./Blockchain.js");


let blockchain = new Blockchain();
let getChain = async() =>{
	await blockchain.getChain();
}

getChain();

(function theLoop(i) {
    setTimeout(async function() {
        let blockTest = new Block("Test Block - " + (blockchain.chain.length));
        let added_block = await blockchain.addBlock(blockTest);
        console.log(added_block)
        i++;
        (i < 10)?theLoop(i):console.log(await blockchain.validateChain());
    }, 1000);
})(0);