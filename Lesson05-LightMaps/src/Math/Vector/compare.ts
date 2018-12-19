import { Vec3, Vec4 } from './vec';

export function compareVec3AGreaterB(a: Vec3, b: Vec3) {
    return (
        a.x * a.x
        + a.y * a.y
        + a.z * a.z
        >
        b.x * b.x
        + b.y * b.y
        + b.z * b.z
    );
}
export function compareVec4AGreaterB(a: Vec4, b: Vec4) {
    return (
        a.x * a.x
        + a.y * a.y
        + a.z * a.z
        + a.w * a.w
        >
        b.x * b.x
        + b.y * b.y
        + b.z * b.z
        + b.w * b.w
    );
}