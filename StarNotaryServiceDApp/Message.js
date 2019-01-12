const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');

class Message{
	async isValid(message, address, signature){
		let isValid = await bitcoinMessage.verify(message, address, signature);
		return isValid;
	}
}

module.exports = Message;