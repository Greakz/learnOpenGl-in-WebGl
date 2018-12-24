import { Mat4 } from '../Matrix/mat';
import { Vec3, Vec4 } from './vec';
import { mat4ToFlat } from '../Matrix/matTo';

export function multiplyMat4Vec3(matrixIn: Mat4, pointIn: Vec3): Vec3 {
    const res: Vec4 =  multiplyMat4Vec4(matrixIn, {...pointIn, w: 1});
    return {x: res.x, y: res.y, z: res.z};
}

export function multiplyMat4Vec4(matrixIn: Mat4, pointIn: Vec4): Vec4 {

    let matrix = mat4ToFlat(matrixIn);

    let x = pointIn.x, y = pointIn.y, z = pointIn.z, w = pointIn.w;
    let c1r1 = matrix[0], c2r1 = matrix[1], c3r1 = matrix[2], c4r1 = matrix[3],
        c1r2 = matrix[4], c2r2 = matrix[5], c3r2 = matrix[6], c4r2 = matrix[7],
        c1r3 = matrix[8], c2r3 = matrix[9], c3r3 = matrix[10], c4r3 = matrix[11],
        c1r4 = matrix[12], c2r4 = matrix[13], c3r4 = matrix[14], c4r4 = matrix[15];
    return {
        x: x * c1r1 + y * c1r2 + z * c1r3 + w * c1r4,
        y: x * c2r1 + y * c2r2 + z * c2r3 + w * c2r4,
        z: x * c3r1 + y * c3r2 + z * c3r3 + w * c3r4,
        w: x * c4r1 + y * c4r2 + z * c4r3 + w * c4r4
    };
}