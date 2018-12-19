import { Mat4 } from './mat';

export function getPerspectiveMatrix(fovRad: number, aspect: number, near: number, far: number): Mat4 {
    let f = 1.0 / Math.tan(fovRad / 2);
    let rangeInv = 1 / (near - far);
    return [
        [f / aspect, 0, 0, 0],
        [0, f, 0, 0],
        [0, 0, (near + far) * rangeInv, -1],
        [0, 0, near * far * rangeInv * 2, 0]
    ]
}
