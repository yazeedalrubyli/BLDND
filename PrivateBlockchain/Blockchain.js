/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/
const SHA256 = require('crypto-js/sha256');

const Block = require("./Block.js");
const DB = require("./DB.js");

class Blockchain {
    constructor() {
        this.db = new DB();
        this.chain = [];
    }

    // Add new block
    async addBlock(newBlock) {
        // Block height
        newBlock.height = this.chain.length;
        // UTC timestamp
        newBlock.time = new Date().getTime().toString().slice(0, -3);
        // previous block hash
        if (this.chain.length > 0) {
            newBlock.previousBlockHash = this.chain[this.chain.length - 1].hash;
        }
        // Block hash with SHA256 using newBlock and converting to a string
        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();

        let block = await this.db.addData(newBlock.height,newBlock);
        this.chain.push(block);
        return block;
    }

    // get block by Height
    async getBlock(blockHeight){
        let block = await this.db.getSingleData(blockHeight);
        return block;	
    }

    // get the chain
    async getChain(){
    	let height = await this.db.getDataCount();
    	for (var i = 0; i < height; i++) {
    		let block = await this.getBlock(i);
    		this.chain.push(block);
    	}
    	
    	if (this.chain.length == 0) {
        	this.addBlock(new Block("First block in the chain - Genesis block"));
        }
    }

    // validate block
    async validateBlock(blockHeight) {
        // get block object
        let block = await this.getBlock(blockHeight);
        // get block hash
        let blockHash = block.hash;
        // remove block hash to test block integrity
        block.hash = '';
        // generate block hash
        let validBlockHash = SHA256(JSON.stringify(block)).toString();
        // Compare
        if (blockHash === validBlockHash) {
            return true;
        } else {
            console.log('Block #' + blockHeight + ' invalid hash:\n' + blockHash + '<>' + validBlockHash);
            return false;
        }
    }

    // Validate blockchain
    async validateChain() {
        let errorLog = [];
        for (var i = 0; i < this.chain.length - 1; i++) {
            // validate block
            if (!this.validateBlock(i)) errorLog.push(i);
            // compare blocks hash link
            let blockHash = this.chain[i].hash;
            let previousHash = this.chain[i + 1].previousBlockHash;
            if (blockHash !== previousHash) {
                errorLog.push(i);
            }
        }
        if (errorLog.length > 0) {
            return ('Block errors = ', errorLog.length, '\nBlocks: ', errorLog);
        } else {
            return 'No errors detected';
        }
    }
}




module.exports = Blockchain;