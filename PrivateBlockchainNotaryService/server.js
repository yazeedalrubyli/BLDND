const Hapi=require('hapi');
const Joi=require('joi');
const Boom = require('boom');
const hex2ascii = require('hex2ascii');
const Block = require("./Block.js");
const Blockchain = require("./Blockchain.js");
const Message = require("./Message.js");
const MemPool = require("./MemPool.js")

let blockchain = new Blockchain();
let memPool = new MemPool();
let msg = new Message();

var getChain = async() => {
    await blockchain.getChain();
}

getChain();
// Create a server with a host and port
const server=Hapi.server({
    host:'localhost',
    port:8000
});

// Add Validation Request to MemPool
server.route({
    method:'POST',
    path:'/requestValidation',
    handler: function(request,h) {
        try{
            request.payload.requestTimeStamp = new Date().getTime().toString().slice(0,-3);
            return memPool.addRequestValidation(request.payload);
        } catch(e){
            console.log(e);
        }
    },
    options: {
        validate: {
            payload: {
                address: Joi.string().required()
            }
        }
    }
});

// Validate Message Signature
server.route({
    method:'POST',
    path:'/validateMessage',
    handler:async function(request,h) {
        try{
            let address = request.payload.address;

            if (memPool.mempool.has(address)){
                let trans = memPool.mempool.get(address);
            
                let message = `${address}:${trans.requestTimeStamp}:starRegistry`;
                
                let signature = request.payload.signature;

                let obj = new Object();
                obj.body = {
                        walletAddress    : address,
                        requestTimeStamp : trans.requestTimeStamp,
                        message          : message,
                        validationWindow : memPool.timeLeft(trans.requestTimeStamp),
                    };

                if (await msg.isValid(message, address, signature)){
                    
                    obj.registerStar = true;
                    obj.body.messageSignature = "valid";
                    
                    memPool.mempoolValid.set(address,obj);

                } else{
                    obj.registerStar = false;
                    obj.body.messageSignature = "invalid";
                }

                return obj;

            } else {
                return false;
            }
            
        } catch(e){
            console.log(e);
        }
    },
    options: {
        validate: {
            payload: {
                address  : Joi.string().required(),
                signature: Joi.string().required()
            }
        }
    }
});

// Add Star to the Blockchain
server.route({
    method:'POST',
    path:'/addStar',
    handler: async function(request,h) {
        try{
            let address = request.payload.address;
            if (memPool.mempoolValid.has(address)){
                let starStory = request.payload.star.story;
                if (starStory.split(' ').length > 250){
                    return Boom.badRequest('Star story max words = 250');
                }
                request.payload.star.story = Buffer.from(starStory).toString('hex');
                let block = new Block(request.payload);
                let added_block = await blockchain.addBlock(block);
                added_block.body.star.storyDecoded = hex2ascii(request.payload.star.story);
                memPool.removeValidationRequest(address);
                return added_block;
            } else{
                return Boom.notFound(`Send a validation request before adding a new Star`);
            }
        } catch(e){
            console.log(e);
        }
    },
    options: {
        validate: {
            payload: {
                address: Joi.string().required(),
                star: {
                    dec: Joi.string(),
                    ra: Joi.string(),
                    mag: Joi.string(),
                    cen: Joi.string(),
                    story: Joi.string()
                }
            }
        }
    }
});

// Get Block by Hash
server.route({
    method:'GET',
    path:'/stars/hash:{HASH}',
    handler:async function(request,h) {
        try{
            let block = await blockchain.getBlockByHash(request.params.HASH);
            if(!block){
                return Boom.notFound(`Block Hash[${(request.params.HASH).substring(0, 10)}...] not found in the Blockchain`);
            }

            if(block.body.star.story){
                block.body.star.storyDecoded = hex2ascii(block.body.star.story);
            }
            return block;
        } catch(e){
            console.log(e)
        }
    }
});

// Get Block by Wallet Address
server.route({
    method:'GET',
    path:'/stars/address:{ADDRESS}',
    handler:async function(request,h) {
        try{
            let blocks = await blockchain.getBlocksByAddress(request.params.ADDRESS);
            if(blocks.length == 0){
                return Boom.notFound(`Wallet Address[${(request.params.ADDRESS).substring(0, 10)}...] not found in the Blockchain`);
            }

            for(var i in blocks){
                if(blocks[i].body.star.story){
                    blocks[i].body.star.storyDecoded = hex2ascii(blocks[i].body.star.story);
                }
            }
            
            return blocks;
        } catch(e){
            console.log(e)
        }
    }
});

// Get Block by Block Height
server.route({
    method:'GET',
    path:'/block/{HEIGHT}',
    handler:async function(request,h) {
        try{
            let block = await blockchain.getBlock(request.params.HEIGHT);
            if (request.params.HEIGHT == 0) return block;
            block.body.star.storyDecoded = hex2ascii(block.body.star.story);
            return block;
        } catch(e){
            console.log(e)
            throw Boom.notFound(`Block[${request.params.HEIGHT}] not found in the Blockchain`);
        }
        
    }
});

// Validate Blockchain
server.route({
    method:'GET',
    path:'/validate',
    handler:async function(request,h) {
        return {"Status":`${await blockchain.validateChain()}`};
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