import { lengthVec3, lengthVec4 } from './length';
import { Vec3, Vec4 } from './vec';

export function normalizeVec3(vec: Vec3): Vec3 {
    const length = lengthVec3(vec);
    return {
        x: vec.x / length,
        y: vec.y / length,
        z: vec.z / length
    }
}
export function normalizeVec4(vec: Vec4): Vec4 {
    const length = lengthVec4(vec);
    return {
        x: vec.x / length,
        y: vec.y / length,
        z: vec.z / length,
        w: vec.w / length
    }
}