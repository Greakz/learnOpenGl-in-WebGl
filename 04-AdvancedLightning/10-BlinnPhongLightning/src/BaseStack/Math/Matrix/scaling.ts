import { Mat4 } from './mat';

export function getScalingMatrix(w: number, h: number, d: number): Mat4 {
    return [
        [w, 0, 0, 0],
        [0, h, 0, 0],
        [0, 0, d, 0],
        [0, 0, 0, 1]
    ]
}