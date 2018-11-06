/* ===== Persist data with LevelDB =======================
|  Learn more: level: https://github.com/Level/level     |
|  =====================================================*/
const level = require('level');
const chainDB = './chain';
const db = level(chainDB, {valueEncoding: 'json'});

class DB{
	// constructor{

	// }

	// Add data to levelDB with key/value pair
	addData(key, value) {
		return new Promise((resolve, reject) => {
	        db.put(key, JSON.stringify(value), function(err) {
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
	            resolve(JSON.parse(value));
	        });
	    });
	}

	// get all data
    getDataCount() {
    let i = [];
    return new Promise((resolve, reject) => {
	    db.createReadStream().on('data', function(data) {
	            i++;
	        }).on('error', function(err) {
	            reject(err);
	        }).on('close', function() {
	            resolve(i);
	        });
	    });
	}
}
	


module.exports = DB;