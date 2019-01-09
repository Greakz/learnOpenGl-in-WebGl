import { Canvas } from './BaseStack/Canvas';
import { Shader } from './Shader';
import { Transformation } from './Transformation';
import { mat4ToF32 } from './Math/Matrix/matTo';
import { Camera } from './Camera';
import { Material } from './Material';

export class Cube {

    public transformation: Transformation = new Transformation();
    public material: Material;

    // positioned left on screen
    private vertex_positions: number[] = [
        // Position         // Normals
        -0.5, -0.5, 0.5,    0.0, 0.0, 1.0,
        0.5, -0.5, 0.5,    0.0, 0.0, 1.0,
        0.5, 0.5, 0.5,    0.0, 0.0, 1.0,
        -0.5, -0.5, 0.5,    0.0, 0.0, 1.0,
        0.5, 0.5, 0.5,    0.0, 0.0, 1.0,
        -0.5, 0.5, 0.5,    0.0, 0.0, 1.0,

        -0.5, -0.5, -0.5,   0.0, 0.0, -1.0,
        -0.5, 0.5, -0.5,   0.0, 0.0, -1.0,
        0.5, 0.5, -0.5,   0.0, 0.0, -1.0,
        -0.5, -0.5, -0.5,   0.0, 0.0, -1.0,
        0.5, 0.5, -0.5,   0.0, 0.0, -1.0,
        0.5, -0.5, -0.5,   0.0, 0.0, -1.0,

        -0.5, 0.5, -0.5,   0.0, 1.0, 0.0,
        -0.5, 0.5, 0.5,   0.0, 1.0, 0.0,
        0.5, 0.5, 0.5,   0.0, 1.0, 0.0,
        -0.5, 0.5, -0.5,   0.0, 1.0, 0.0,
        0.5, 0.5, 0.5,   0.0, 1.0, 0.0,
        0.5, 0.5, -0.5,   0.0, 1.0, 0.0,

        -0.5, -0.5, -0.5,   0.0, -1.0, 0.0,
        0.5, -0.5, -0.5,   0.0, -1.0, 0.0,
        0.5, -0.5, 0.5,   0.0, -1.0, 0.0,
        -0.5, -0.5, -0.5,   0.0, -1.0, 0.0,
        0.5, -0.5, 0.5,   0.0, -1.0, 0.0,
        -0.5, -0.5, 0.5,   0.0, -1.0, 0.0,

        0.5, -0.5, -0.5,   1.0, 0.0, 0.0,
        0.5, 0.5, -0.5,    1.0, 0.0, 0.0,
        0.5, 0.5, 0.5,    1.0, 0.0, 0.0,
        0.5, -0.5, -0.5,    1.0, 0.0, 0.0,
        0.5, 0.5, 0.5,    1.0, 0.0, 0.0,
        0.5, -0.5, 0.5,    1.0, 0.0, 0.0,

        -0.5, -0.5, -0.5,   -1.0, 0.0, 0.0,
        -0.5, -0.5, 0.5,   -1.0, 0.0, 0.0,
        -0.5, 0.5, 0.5,   -1.0, 0.0, 0.0,
        -0.5, -0.5, -0.5,   -1.0, 0.0, 0.0,
        -0.5, 0.5, 0.5,   -1.0, 0.0, 0.0,
        -0.5, 0.5, -0.5,   -1.0, 0.0, 0.0,
    ];

    private vertex_position_buffer: WebGLBuffer;

    initBuffer(material: number) {
        this.material = getRandomMaterial(material);
        const GL: WebGL2RenderingContext = Canvas.getGL();
        this.vertex_position_buffer = GL.createBuffer();
        GL.bindBuffer(GL.ARRAY_BUFFER, this.vertex_position_buffer);
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(this.vertex_positions), GL.STATIC_DRAW);
        GL.bindBuffer(GL.ARRAY_BUFFER, null);
    }

    update(time: number) {
    }

    draw(shader: Shader, camera: Camera) {
        const GL: WebGL2RenderingContext = Canvas.getGL();
        GL.useProgram(shader.program);

        GL.bindBuffer(GL.ARRAY_BUFFER, this.vertex_position_buffer);
        GL.vertexAttribPointer(shader.attribute_locations.vertex_position, 3, GL.FLOAT, false, 6 * 4, 0);
        GL.enableVertexAttribArray(shader.attribute_locations.vertex_position);
        GL.vertexAttribPointer(shader.attribute_locations.vertex_normal, 3, GL.FLOAT, false, 6 * 4, 3 * 4);
        GL.enableVertexAttribArray(shader.attribute_locations.vertex_normal);
        GL.bindBuffer(GL.ARRAY_BUFFER, null);

        this.material.bind(shader);

        const model_matrix: Float32Array = mat4ToF32(this.transformation.getMatrix());
        GL.uniformMatrix4fv(shader.uniform_locations.model_matrix, false, model_matrix);

        const view_matrix: Float32Array = mat4ToF32(camera.getViewMatrix());
        GL.uniformMatrix4fv(shader.uniform_locations.view_matrix, false, view_matrix);

        const projection_matrix: Float32Array = mat4ToF32(camera.getProjectionMatrix());
        GL.uniformMatrix4fv(shader.uniform_locations.projection_matrix, false, projection_matrix);

        GL.drawArrays(GL.TRIANGLES, 0, 36);
    }
}

function getRandomMaterial(i: number): Material {

    if(i === 0) {
        // Chrome
        return new Material(
            {x: 0.25, y: 0.25, z: 0.25},
            {x: 0.4, y: 0.4, z: 0.4},
            {x: 0.774597, y: 0.774597, z: 0.774597},
            0.6 * 128,
            0.95,
            0.0
        )
    } else if (i === 1) {
        // Glass
        return new Material(
            {x: 0.0215, y: 0.1745, z: 0.0215},
            {x: 0.42, y: 0.42, z: 0.65},
            {x: 0.52, y: 0.48, z: 0.80},
            0.088 * 128,
            0.1,
            0.9
        )
    } else {
        // simple only ambient
        return new Material(
            {x: 1, y: 1, z: 1},
            {x: 0, y: 0, z: 0},
            {x: 0, y: 0, z: 0},
            0,
            0.0,
            0.0
        )
    }




}