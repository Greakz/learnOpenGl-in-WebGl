import { Mat4 } from './mat';

const c = Math.cos;
const s = Math.sin;

export function getRotationXMatrix(rad: number): Mat4 {
    return [
        [1, 0, 0, 0],
        [0, c(rad), -s(rad), 0],
        [0, s(rad), c(rad), 0],
        [0, 0, 0, 1],
    ]
}

export function getRotationYMatrix(rad: number): Mat4 {
    return [
        [c(rad), 0, s(rad), 0],
        [0, 1, 0, 0],
        [-s(rad), 0, c(rad), 0],
        [0, 0, 0, 1],
    ]
}

export function getRotationZMatrix(rad: number): Mat4 {
    return [
        [c(rad), -s(rad), 0, 0],
        [s(rad), c(rad), 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
    ]
}
