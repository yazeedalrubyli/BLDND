# Private Blockchain [![Udacity - Blockchain Developer Nanodegree](https://bit.ly/2svzNOI)](https://www.udacity.com/blockchain)

Create a private blockchain web service using '[hapi](http://hapijs.com)' framework to demonstrate what I learned about blockchain and transaction data models as well as the differences between public and private blockchains.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need Nodejs >= 10.x, npm >= 6.x, Hapi.js >= 17.x

```
Please Visit https://nodejs.org/en/download for details.
```

### Installing

Navigate to this folder after cloning it. Than issue 'npm install'

```
> npm install
```

### Running 

To run the API
```
> npm start
```

### Available Endpoints

Get Block Info

```
Example: Get block[1] info
GET: http://localhost:8000/block/1
```

Add New Block

```
Example: Adding Block to the Blockchain
POST: http://localhost:8000/block

Data:
{
      "body": "ADD-BLOCK"
}
```

Validate the Blockchain

```
Example: Validating the Blockchain
GET: http://localhost:8000/validate
```

