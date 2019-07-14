import SHA256 from 'crypto-js/sha256'
import ec from './keys'

export default class Block {
    timestamp: number
    operations: [ object ] | object
    author: string
    hash: string
    signature: string
    previousHash: string

    constructor (timestamp: number, operations:[ object ] | object, author: string, previousHash: string = '') {
        this.timestamp = timestamp
        this.operations = operations
        this.author = author
        this.previousHash = previousHash

        this.hash = this.calculateHash()
    }
    
    calculateHash(): string {
        return SHA256(this.timestamp + JSON.stringify(this.operations) + this.author + this.previousHash).toString()
    }

    signTransaction(signingKey: any) {
        if (signingKey.getPublic('hex') !== this.author) {
          throw new Error('You cannot sign blocks for other authors!')
        }
        
        const hashTx = this.calculateHash()
        const sig = signingKey.sign(hashTx, 'base64')
    
        this.signature = sig.toDER('hex')
    }

    isValid(): Boolean {
        if (this.author === null) return true

        if (!this.signature || this.signature.length === 0) {
            throw new Error('No signature in this block')
        }

        const publicKey = ec.keyFromPublic(this.author, 'hex')
        return publicKey.verify(this.calculateHash(), this.signature)
    }
}