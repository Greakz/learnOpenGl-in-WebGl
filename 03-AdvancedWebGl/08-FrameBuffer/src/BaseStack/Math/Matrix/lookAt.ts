import { Vec3 } from '../Vector/vec';
import { Mat4 } from './mat';
import { mat4FromFlat } from './matFrom';

export const EPSILON = 0.000001;

export function lookAtMatrix(eye: Vec3, center: Vec3, up: Vec3): Mat4 {
    let out: number[] = [];

    out = identity(out);

    let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;

    let eyex = eye.x;

    let eyey = eye.y;

    let eyez = eye.z;

    let upx = up.x;

    let upy = up.y;

    let upz = up.z;

    let centerx = center.x;

    let centery = center.y;

    let centerz = center.z;

    if (Math.abs(eyex - centerx) < EPSILON &&

        Math.abs(eyey - centery) < EPSILON &&

        Math.abs(eyez - centerz) < EPSILON) {

        return identity(out);
    }

    z0 = eyex - centerx;

    z1 = eyey - centery;

    z2 = eyez - centerz;

    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);

    z0 *= len;

    z1 *= len;

    z2 *= len;

    x0 = upy * z2 - upz * z1;

    x1 = upz * z0 - upx * z2;

    x2 = upx * z1 - upy * z0;

    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);

    if (!len) {

        x0 = 0;

        x1 = 0;

        x2 = 0;

    } else {

        len = 1 / len;

        x0 *= len;

        x1 *= len;

        x2 *= len;

    }

    y0 = z1 * x2 - z2 * x1;

    y1 = z2 * x0 - z0 * x2;

    y2 = z0 * x1 - z1 * x0;

    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);

    if (!len) {

        y0 = 0;

        y1 = 0;

        y2 = 0;

    } else {

        len = 1 / len;

        y0 *= len;

        y1 *= len;

        y2 *= len;

    }

    out[0] = x0;

    out[1] = y0;

    out[2] = z0;

    out[3] = 0;

    out[4] = x1;

    out[5] = y1;

    out[6] = z1;

    out[7] = 0;

    out[8] = x2;

    out[9] = y2;

    out[10] = z2;

    out[11] = 0;

    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);

    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);

    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);

    out[15] = 1;

    return mat4FromFlat(out);

}


function identity(out) {

    out[0] = 1;

    out[1] = 0;

    out[2] = 0;

    out[3] = 0;

    out[4] = 0;

    out[5] = 1;

    out[6] = 0;

    out[7] = 0;

    out[8] = 0;

    out[9] = 0;

    out[10] = 1;

    out[11] = 0;

    out[12] = 0;

    out[13] = 0;

    out[14] = 0;

    out[15] = 1;

    return out;

}