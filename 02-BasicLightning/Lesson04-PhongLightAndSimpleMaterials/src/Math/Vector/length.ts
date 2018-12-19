import { Vec3, Vec4 } from './vec';

export function lengthVec3(vec: Vec3): number {
    return Math.sqrt(
        Math.pow(vec.x, 2)
        + Math.pow(vec.y, 2)
        + Math.pow(vec.z, 2)
    );
}
export function lengthVec4(vec: Vec4): number {
    return Math.sqrt(
        Math.pow(vec.x, 2)
        + Math.pow(vec.y, 2)
        + Math.pow(vec.z, 2)
        + Math.pow(vec.w, 2)
    );
}