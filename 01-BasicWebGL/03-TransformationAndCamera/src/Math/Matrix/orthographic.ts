import { Mat4 } from './mat';

export function getOrthographicMatrix(left: number, right: number, bottom: number, top: number, near: number, far: number): Mat4 {
    let lr = 1 / (left - right);
    let bt = 1 / (bottom - top);
    let nf = 1 / (near - far);

    let row4col1 = (left + right) * lr;
    let row4col2 = (top + bottom) * bt;
    let row4col3 = (far + near) * nf;

    return [
        [-2 * lr, 0, 0, 0],
        [0, -2 * bt, 0, 0],
        [0, 0, 2 * nf, 0],
        [row4col1, row4col2, row4col3, 1]
    ];
}