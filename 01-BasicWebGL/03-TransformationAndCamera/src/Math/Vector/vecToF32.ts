import { Vec3, Vec4 } from './vec';

export function vec3ToF32(vec3: Vec3): Float32Array {
    return new Float32Array([vec3.x, vec3.y, vec3.z]);
}
export function vec4ToF32(vec4: Vec4): Float32Array {
    return new Float32Array([vec4.x, vec4.y, vec4.z, vec4.w]);
}