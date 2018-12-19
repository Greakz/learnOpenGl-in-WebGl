import { Vec3, Vec4 } from './vec';

export function subtractVec3(a: Vec3, b: Vec3): Vec3 {
    return {
        x: a.x - b.x,
        y: a.y - b.y,
        z: a.z - b.z
    }
}
export function subtractVec4(a: Vec4, b: Vec4): Vec4 {
    return {
        x: a.x - b.x,
        y: a.y - b.y,
        z: a.z - b.z,
        w: a.w - b.w
    }
}