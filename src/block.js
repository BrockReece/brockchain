var SHA256 = require("crypto-js/sha256")
const ec = require('./keys')

class Block {
    constructor (timestamp, data, author, previousHash = '') {
        this.timestamp = timestamp
        this.data = data
        this.author = author
        this.previousHash = previousHash

        this.hash = this.calculateHash()
    }
    
    calculateHash() {
        return SHA256(this.timestamp + JSON.stringify(this.data) + this.author + this.previousHash).toString()
    }

    signTransaction(signingKey) {
        if (signingKey.getPublic('hex') !== this.author) {
          throw new Error('You cannot sign blocks for other authors!')
        }
        
        const hashTx = this.calculateHash()
        const sig = signingKey.sign(hashTx, 'base64')
    
        this.signature = sig.toDER('hex')
    }

    isValid() {
        if (this.author === null) return true

        if (!this.signature || this.signature.length === 0) {
            throw new Error('No signature in this block')
        }

        const publicKey = ec.keyFromPublic(this.author, 'hex')
        return publicKey.verify(this.calculateHash(), this.signature)
    }
}

module.exports = Block