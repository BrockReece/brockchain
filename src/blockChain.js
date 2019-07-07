const jsonDiff = require('json-diff')
const Block = require('./block')

class BlockChain {
    constructor() {
        this.chain = [this.createGenesisBlock()]
    }
   
    createGenesisBlock() {
        return new Block(Date.now(), {}, 0);
    }

    addBlock(block) {
        if (!block.author) {
            throw new Error('Block must contain an author')
        } 
        if (!block.isValid()) {
            throw new Error('Cannot add invalid block to chain')
        }

        this.chain.push(block)
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1]
    }

    getLatestHash() {
        return this.getLatestBlock().hash
    }

    isChainValid() {
        const realGenesis = JSON.stringify(this.createGenesisBlock())
    
        if (realGenesis !== JSON.stringify(this.chain[0])) {
            return false
        }
    
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i]
        
            if (!currentBlock.isValid()) {
                return false
            }
        
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false
            }
        }
    
        return true
    }

    showHistory() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i]
            const previousBlock = this.chain[i - 1]
            console.log(currentBlock.author, jsonDiff.diffString(previousBlock.data, currentBlock.data))
        }
    }
}

module.exports = BlockChain