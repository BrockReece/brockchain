import jsonDiff from 'json-diff'
import Block from './block'
import { applyOperationalTransformations } from './ot'

export default class BlockChain {
    genesisTime: number
    chain: [ Block ]

    constructor() {
        this.genesisTime = Date.now()
        this.chain = [this.createGenesisBlock()]
    }
   
    createGenesisBlock(): Block {
        return new Block(this.genesisTime, {}, '');
    }

    addBlock(block: Block) {
        if (!block.author) {
            throw new Error('Block must contain an author')
        } 
        if (!block.isValid()) {
            throw new Error('Cannot add invalid block to chain')
        }

        this.chain.push(block)
    }

    getLatestBlock(): Block {
        return this.chain[this.chain.length - 1]
    }

    getLatestHash(): string {
        return this.getLatestBlock().hash
    }

    isChainValid(): boolean {
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

    getWorldState(logHistory: boolean = false): object {
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