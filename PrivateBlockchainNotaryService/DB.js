/* ===== Persist data with LevelDB =======================
|  Learn more: level: https://github.com/Level/level     |
|  =====================================================*/
const level = require('level');
const chainDB = './starsChain';
const db = level(chainDB, {valueEncoding: 'json'});

class DB{

	// Add data to levelDB with key/value pair
	addData(key, value) {
		return new Promise((resolve, reject) => {
	        db.put(key, value, function(err) {
	            if (err) reject(err);
	            resolve(value);
	        });
	    });
	}

	// Get data from levelDB with key
	getSingleData(key) {
	    return new Promise((resolve, reject) => {
	        db.get(key, function(err, value) {
	            if (err) reject(err);
	            resolve(value);
	        });
	    });
	}

	// get all data
    getDataCount() {
    	let i = 0;
	    return new Promise((resolve, reject) => {
		    db.createReadStream()
		    .on('data', function(data) {
		            i++;
		        })
		    .on('error', function(err) {
		            reject(err);
		        })
		    .on('close', function() {
		            resolve(i);
		        });
		    });
	}

	// get block by hash
	getDataByHash(hash) {
		let block = null;
	    return new Promise((resolve, reject) => {
		    db.createReadStream()
		    .on('data', function(data) {
		            if(data.value.hash === hash){
	                   block = data.value;
	               }
		        })
		    .on('error', function(err) {
		            reject(err);
		        })
		    .on('close', function() {
		            resolve(block);
		        });
		    });
	}

	// get block by address
	getDataByAddress(address) {
		let blocks = [];
	    return new Promise((resolve, reject) => {
		    db.createReadStream()
		    .on('data', function(data) {
		            if(data.value.body.address === address){
	                   blocks.push(data.value);
	               }
		        })
		    .on('error', function(err) {
		            reject(err);
		        })
		    .on('close', function() {
		            resolve(blocks);
		        });
		    });
	}
}
	


module.exports = DB;