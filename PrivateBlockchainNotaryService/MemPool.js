
const TimeoutRequestsWindowTime = 5 * 60 * 1000;

class MemPool{
	constructor(){
		this.mempool = new Map();
		this.timeoutRequests = new Map();
		this.mempoolValid = new Map();
	}

	addRequestValidation(payload){
		let self = this;

		let walletAddress = payload.address;

		if (this.mempool.has(walletAddress)){
			let trans = this.mempool.get(walletAddress);

			trans.validationWindow = this.timeLeft(trans.requestTimeStamp);

			return trans;
		}

		let requestTimeStamp = payload.requestTimeStamp;
		
		this.timeoutRequests.set(walletAddress, setTimeout(function(){
			self.removeValidationRequest(walletAddress);
		}, TimeoutRequestsWindowTime));

		let body = {
			walletAddress 	 : walletAddress,
			requestTimeStamp : requestTimeStamp,
			message          : `${walletAddress}:${requestTimeStamp}:starRegistry`,
			validationWindow : this.timeLeft(requestTimeStamp)
		};

		this.mempool.set(walletAddress, body)

		return body;
	}

	removeValidationRequest(walletAddress){
		if (this.timeoutRequests.delete(walletAddress) && this.mempool.delete(walletAddress)){
			this.mempoolValid.delete(walletAddress);
			return;
		}
		throw "Transaction can't be deleted from MemPool";
	}

	timeLeft(requestTimeStamp){
		let timeElapse = (new Date().getTime().toString().slice(0,-3)) - requestTimeStamp;
		let timeLeft = (TimeoutRequestsWindowTime/1000) - timeElapse;
		return timeLeft;
	}
}

module.exports = MemPool;