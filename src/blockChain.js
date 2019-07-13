const jsonDiff = require('json-diff')
const Block = require('./block')
const { applyOperationalTransformations } = require('./ot')

class BlockChain {
    constructor() {
        this.genesisTime = Date.now()
        this.chain = [this.createGenesisBlock()]
    }
   
    createGenesisBlock() {
        return new Block(this.genesisTime, {}, 0);
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
        this.getWorldState(true)
    }

    getWorldState(logHistory = false) {
        const state = this.createGenesisBlock().operations
        for (let i = 1; i < this.chain.length; i++) {
            const { operations, author } = this.chain[i]
            const oldState = { ...state }
            applyOperationalTransformations(state, operations)
            
            if (logHistory) {
                console.log(author, jsonDiff.diffString(oldState, state))
            }
        }
        return state 
    }
}

module.exports = BlockChain