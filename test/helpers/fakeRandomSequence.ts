// The first value controls the initial tile count.
// The following values control the tile positions picked during setup.
export function fakeRandomSequence(values: number[]): () => number {
    let index = 0
    return () => values[index++]
}