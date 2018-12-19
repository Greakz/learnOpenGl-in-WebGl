import { Vec3, Vec4 } from './vec';

export function scaleVec3(a: Vec3, scalar: number): Vec3 {
    return {
        x: a.x * scalar,
        y: a.y * scalar,
        z: a.z * scalar
    }
}
export function scaleVec4(a: Vec4, scalar: number): Vec4 {
    return {
        x: a.x * scalar,
        y: a.y * scalar,
        z: a.z * scalar,
        w: a.w * scalar
    }
}