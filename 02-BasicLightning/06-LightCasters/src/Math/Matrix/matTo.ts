import { Mat4 } from './mat';

export function mat4ToF32(matrix: Mat4): Float32Array {
    return new Float32Array(mat4ToFlat(matrix));
}

export function mat4ToFlat(matrix: Mat4): number[] {
    let result: number [] = [];
    for (let i = 0; i < 16; i++) {
        let row = Math.floor(i / 4);
        result.push(matrix[row][i % 4]);
    }
    return result;
}