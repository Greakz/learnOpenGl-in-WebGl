import { Vec3 } from './vec';

export function crossProductVec3(vector_one: Vec3, vector_two: Vec3): Vec3 {
    return {
        x: vector_one.y * vector_two.z - vector_one.z * vector_two.y,
        y: vector_one.z * vector_two.x - vector_one.x * vector_two.z,
        z: vector_one.x * vector_two.y - vector_one.y * vector_two.x
    }
}