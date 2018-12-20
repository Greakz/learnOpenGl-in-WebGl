import { Log } from './Log';
import { Mat4 } from './Math/Matrix/mat';
import { Vec3 } from './Math/Vector/vec';
import { mat4ToFlat } from './Math/Matrix/matTo';
import { compareVec3AGreaterB } from './Math/Vector/compare';
import { subtractVec3 } from './Math/Vector/subtract';
import { Ray } from './Math/Ray/Ray';

export abstract class Intersection {
    static check(ray: Ray, modelMatrix: Mat4, camPos: Vec3, vertex_array_polygon: number[]): null | Vec3 {
        if (vertex_array_polygon.length % 9 !== 0) {
            Log.error('Intersection', 'failed to Calculate: No full Polygon!');
        }
        let result = null;

        let inverse_model_matrix: number[] = invert(mat4ToFlat(modelMatrix));
        let ray_pos = multiplyInverseModelMatWithRay(inverse_model_matrix ,[ray.position.x, ray.position.y, ray.position.z]);
        let ray_dir = multiplyInverseModelMatWithRay(inverse_model_matrix ,[ray.direction.x, ray.direction.y, ray.direction.z]);

        for (let i = 0; i < vertex_array_polygon.length; i += 9) {
            let triangle: number[][] = [
                [vertex_array_polygon[i], vertex_array_polygon[i + 1], vertex_array_polygon[i + 2]],
                [vertex_array_polygon[i + 3], vertex_array_polygon[i + 4], vertex_array_polygon[i + 5]],
                [vertex_array_polygon[i + 6], vertex_array_polygon[i + 7], vertex_array_polygon[i + 8]],
            ];
            let partial_result = intersectTriangle(ray_pos, ray_dir, triangle);
            if(partial_result !== null) {
                let part_res: Vec3 = {x: partial_result[0], y: partial_result[1], z: partial_result[2]};
                if(result === null || compareVec3AGreaterB(subtractVec3(result, camPos), subtractVec3(part_res, camPos))) {
                    result = partial_result;
                }
            }
        }
        return result;
    }
}

function invert(input) {
    let inverted_mat = [];
    let a00 = input[0], a01 = input[1], a02 = input[2], a03 = input[3],
        a10 = input[4], a11 = input[5], a12 = input[6], a13 = input[7],
        a20 = input[8], a21 = input[9], a22 = input[10], a23 = input[11],
        a30 = input[12], a31 = input[13], a32 = input[14], a33 = input[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) {
        return null;
    }
    det = 1.0 / det;

    inverted_mat[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    inverted_mat[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    inverted_mat[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    inverted_mat[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    inverted_mat[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    inverted_mat[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    inverted_mat[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    inverted_mat[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    inverted_mat[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    inverted_mat[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    inverted_mat[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    inverted_mat[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    inverted_mat[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    inverted_mat[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    inverted_mat[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    inverted_mat[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return inverted_mat;
}

function multiplyInverseModelMatWithRay(matrix: number[], ray: number[]): number[] {


    let x = ray[0], y = ray[1], z = ray[2], w = 1.0;
    let c1r1 = matrix[0], c2r1 = matrix[1], c3r1 = matrix[2], c4r1 = matrix[3],
        c1r2 = matrix[4], c2r2 = matrix[5], c3r2 = matrix[6], c4r2 = matrix[7],
        c1r3 = matrix[8], c2r3 = matrix[9], c3r3 = matrix[10], c4r3 = matrix[11],
        c1r4 = matrix[12], c2r4 = matrix[13], c3r4 = matrix[14], c4r4 = matrix[15];
    return [
        x * c1r1 + y * c1r2 + z * c1r3 + w * c1r4,
        x * c2r1 + y * c2r2 + z * c2r3 + w * c2r4,
        x * c3r1 + y * c3r2 + z * c3r3 + w * c3r4
    ];
}



const EPSILON = 0.000001;
function intersectTriangle(ray_pos: number[], ray_dir: number[], triangle: number[][]): null | number[] {
    let edge1 = subtract(triangle[1], triangle[0]);
    let edge2 = subtract(triangle[2], triangle[0]);

    let pvec = crossProductV3Arr(ray_dir, edge2);
    let det = dotProductV3Array(edge1, pvec);

    if (det < EPSILON) return null;
    let tvec = subtract(ray_pos, triangle[0]);
    let u = dotProductV3Array(tvec, pvec);
    if (u < 0 || u > det) return null;
    let qvec = crossProductV3Arr(tvec, edge1);
    let v = dotProductV3Array(ray_dir, qvec);
    if (v < 0 || u + v > det) return null;

    let t = dotProductV3Array(edge2, qvec) / det;
    return [
        ray_pos[0] + t * ray_dir[0],
        ray_pos[1] + t * ray_dir[1],
        ray_pos[2] + t * ray_dir[2]
    ];
}

function crossProductV3Arr(vector_one: number[], vector_two: number[]): number[] {
    return [
        vector_one[1] * vector_two[2] - vector_one[2] * vector_two[1],
        vector_one[2] * vector_two[0] - vector_one[0] * vector_two[2],
        vector_one[0] * vector_two[1] - vector_one[1] * vector_two[0]
    ]
}
function dotProductV3Array(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
}
function subtract(a, b) {
    return [
        a[0] - b[0],
        a[1] - b[1],
        a[2] - b[2]
    ];
}