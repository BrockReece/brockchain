declare module "*ot" {
    export function getOperationalTransformations(original: object, updated: object): [ object ];
    export function applyOperationalTransformations(original: object, operations: object | [ object ]): object;
}