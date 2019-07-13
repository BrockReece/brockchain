const json0 = require('ot-json0')
const jsonDiff = require('json0-ot-diff')
const diffMatchPatch = require('diff-match-patch')

module.exports.getOperationalTransformations = (original, updated) => {
    return jsonDiff(
        original,
        updated,
        diffMatchPatch
    );
}

module.exports.applyOperationalTransformations = (original, operations) => {
    return json0.type.apply(original, operations)
} 