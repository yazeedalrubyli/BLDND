const Hapi=require('hapi');
const Block = require("./Block.js");
const Blockchain = require("./Blockchain.js");

let blockchain = new Blockchain();

let getChain = async() =>{
    await blockchain.getChain();
}

getChain();


// Create a server with a host and port
const server=Hapi.server({
    host:'localhost',
    port:8000
});

// Get Block by Block Height
server.route({
    method:'GET',
    path:'/block/{block_height}',
    handler:async function(request,h) {
        try{
            let block = await blockchain.getBlock(request.params.block_height);
            return block;
        } catch(e){
            return (`Block[${request.params.block_height}] not found in the Blockchain`);
        }
        
    }
});

// Add Block to Blockchain
server.route({
    method:'POST',
    path:'/block',
    handler:async function(request,h) {
        let block = new Block(request.payload.body);
        let added_block = await blockchain.addBlock(block);
        return added_block;
    }
});

// Validate Blockchain
server.route({
    method:'GET',
    path:'/validate',
    handler:async function(request,h) {
        return blockchain.validateChain();
    }
});

// Start the server
async function start() {

    try {
        await server.start();
        console.log(`Server running at: ${server.info.uri}`);
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
};

start();