const SHA256 = require("crypto-js/sha256");

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
    calculateHash() {
        return SHA256(this.index+this.previousHash+this.timestamp+JSON.stringify(this.data)+this.nonce).toString();
    }

    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty+1).join(""))  {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("block hash", this.hash); 
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }
    createGenesisBlock() {
        return new Block(0, '30/01/2021', "Genensis Block", "0");
    }

    getLetestBlock() {
        return this.chain[this.chain.length-1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLetestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }
    isChainValid() {
        for(let i=1; i<this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];
            if(currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
            if(currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

let myCoin = new Blockchain();
myCoin.addBlock(new Block(1, Date.now(), {amount:50}));
myCoin.addBlock(new Block(2, Date.now(), {amount:100}));
console.log("isChainValid", myCoin.isChainValid())
// myCoin.chain[1].data = {amount:200};
myCoin.chain[1].hash = myCoin.chain[1].calculateHash();
if(myCoin.isChainValid()) {
    console.log(JSON.stringify(myCoin, null, 4));
}

console.log("isChainValid", myCoin.isChainValid())