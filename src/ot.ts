import json0 from 'ot-json0'
import jsonDiff from 'json0-ot-diff'
import diffMatchPatch from 'diff-match-patch'

export function getOperationalTransformations(original: object, updated: object): [ object ] {
    return jsonDiff(
        original,
        updated,
        diffMatchPatch
    );
}

export function applyOperationalTransformations(original: object, operations: object | [ object ]): object {
    return json0.type.apply(original, operations)
} 