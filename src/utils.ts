/**
 * Perform an in place shuffle of an array.
 * 
 * @param array the array to shuffle
 */
export function shuffle<T>(array: T[]) {
    for (let i = array.length - 1; i > 0; --i) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = array[i];
        array[i] = array[j];
        array[j] = tmp;
    }
}
