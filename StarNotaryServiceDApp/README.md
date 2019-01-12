# Private Blockchain Notary Service
Create a private blockchain notary service using '[hapi](http://hapijs.com)' framework to demonstrate what I learned about blockchain and transaction data models as well as the differences between public and private blockchains.


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

**Validate Request**

```
POST: http://localhost:8000/requestValidation

{ "address":"19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL" }
```

**Validate Message**

```
POST: http://localhost:8000/validateMessage

{
 "address":"19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
 "signature":"H8K4+1MvyJo9tcr2YN2KejwvX1oqneyCH+fsUL1z1WBdWmswB9bijeFfOfMqK68kQ5RO6ZxhomoXQG3fkLaBl+Q="
}
```

**Add New Star**

```
Example: Adding Star to the Blockchain
POST: http://localhost:8000/addStar

{
    "address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
    "star": {
                "dec": "68° 52' 56.9",
                "ra": "16h 29m 1.0s",
                "story": "Found star using https://www.google.com/sky/"
            }
}
```

**Get Block by Hash**

```
Example: Get block by hash X
GET: http://localhost:8000/stars/hash:X
```

**Get Block by Wallet Address**

```
Example: Get all blocks belong to wallet address X
GET: http://localhost:8000/stars/address:X
```

**Get Block by Height**

```
Example: Get block[1] info
GET: http://localhost:8000/block/1
```

**Validate the Blockchain**

```
Example: Validating the Blockchain
GET: http://localhost:8000/validate
```

