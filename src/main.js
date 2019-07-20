const ec = require('./keys')
const Block = require('./block')
const BlockChain = require('./blockChain')
const { getOperationalTransformations, applyOperationalTransformations } = require('./ot')

// Use private key from keygen
const myKey = ec.keyFromPrivate('624070edffb3bda30d8111e5bcd9ee477b3806cdddb011b66641208b72c0a574')
const myAuthorKey = myKey.getPublic('hex')

// Create new BlockChain instance
const blockChain = new BlockChain()

// Little helper for creating a block and adding to the chain
const makeChange = (newState, bc) => {
    const state = bc.getWorldState()
    const operations = getOperationalTransformations(state, newState)

    const block = new Block(Date.now(), operations, myAuthorKey, blockChain.getLatestHash())
    block.signTransaction(myKey)
    bc.addBlock(block)
}

// Make some changes
makeChange({foo: 'bar'}, blockChain)
makeChange({foo: 'baz', bar: 'bar'}, blockChain)

// Check the BlockChain
console.log(blockChain.getWorldState())
blockChain.showHistory()
