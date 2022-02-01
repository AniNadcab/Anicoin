const SHA256 = require("crypto-js/sha256");

class Transection {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;

    }
}


class Block {
    constructor(timestamp, trasections, previousHash = '') {
        this.timestamp = timestamp;
        this.trasections = trasections;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
    calculateHash() {
        return SHA256(this.index+this.previousHash+this.timestamp+JSON.stringify(this.data)+this.nonce).toString();
    }

    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty+1).join("0"))  {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("block hash", this.hash); 
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransection = [];
        this.miningReword = 100; 
    }
    createGenesisBlock() {
        return new Block(0, '30/01/2021', "Genensis Block", "0");
    }

    getLetestBlock() {
        return this.chain[this.chain.length-1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLetestBlock().hash;
        newBlock.mineBlock(this.difficulty);
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
    minePendingTransection(miningRewordAddress) {
        let block = new Block(Date.now(), this.pendingTransection);
        block.mineBlock(this.difficulty);

        console.log("Block successfully mined!!")
        this.chain.push(block);
        this.pendingTransection = [null, miningRewordAddress, this.miningReword];
    }
    createTransection(transection) {
        this.pendingTransection.push(transection);
    }

    getBalanceOfAddress(address) {
        let balance = 0;
        for (const block of this.chain) {
            for (const trans of block.trasections) {
                
            console.log("b",trans);
                if(trans.fromAddress === address) {
                    balance -= trans.amount;
                }
                if(trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
    }
}

let myCoin = new Blockchain();
myCoin.createTransection(new Transection('address1', 'address2', 100));
myCoin.createTransection(new Transection('address2', 'address1', 100));
console.log('\starting the miner...');
myCoin.minePendingTransection("my-address");
console.log("\nbalance of my-address", myCoin.getBalanceOfAddress("my-address"));
console.log('\starting the miner again...');
myCoin.minePendingTransection("my-address");
console.log("\nbalance of my-address", myCoin.getBalanceOfAddress("my-address"));