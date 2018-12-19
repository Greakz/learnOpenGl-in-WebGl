import { Canvas } from './BaseStack/Canvas';
import { Shader } from './Shader';
import { Transformation } from './Transformation';
import { mat4ToF32 } from './Math/Matrix/matTo';
import { Camera } from './Camera';
import { Material } from './Material';

export class Cube {

    public transformation: Transformation = new Transformation();
    public material: Material = getRandomMaterial();

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

    initBuffer() {
        const GL: WebGL2RenderingContext = Canvas.getGL();
        this.vertex_position_buffer = GL.createBuffer();
        GL.bindBuffer(GL.ARRAY_BUFFER, this.vertex_position_buffer);
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(this.vertex_positions), GL.STATIC_DRAW);
        GL.bindBuffer(GL.ARRAY_BUFFER, null);
    }

    private c: number = 0;
    update(time: number) {
        this.transformation.rotateX(2.5);
        this.c++;
        if(this.c > 100) {
            this.material = getRandomMaterial();
            this.c = 0;
        }
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

function getRandomMaterial(): Material {

    let i = Math.floor(Math.random() * 8);
    if(i === 0) {
        // Emerald
        return new Material(
            {x: 0.0215, y: 0.1745, z: 0.0215},
            {x: 0.07568, y: 0.61424, z: 0.07568},
            {x: 0.633, y: 0.727811, z: 0.633},
            0.6 * 128,
        )
    } else if (i === 1) {
        // Pearl
        return new Material(
            {x: 0.25, y: 0.20725, z: 0.20725},
            {x: 1, y: 0.829, z: 0.829},
            {x: 0.296648, y: 0.296648, z: 0.296648},
            0.088 * 128,
        )
    } else if (i === 2) {
        // Bronze
        return new Material(
            {x: 0.2125, y: 0.1275, z: 0.054},
            {x: 0.714, y: 0.4284, z: 0.18144},
            {x: 0.393548, y: 0.271906, z: 0.166721},
            0.2 * 128,
        )
    } else if (i === 3) {
        // Gold
        return new Material(
            {x: 0.24725, y: 0.1995, z: 0.0745},
            {x: 0.75164, y: 0.60648, z: 0.22648},
            {x: 0.628281, y: 0.555802, z: 0.366065},
            0.4 * 128,
        )
    } else if (i === 4) {
        // Cyan Plastic
        return new Material(
            {x: 0.0, y: 0.1, z: 0.06},
            {x: 0.0, y: 0.50980392, z: 0.50980392},
            {x: 0.50196078, y: 0.50196078, z: 0.50196078},
            0.25 * 128,
        )
    } else if (i === 5) {
        // Red Plastic
        return new Material(
            {x: 0.0, y: 0.0, z: 0.00},
            {x: 0.5, y: 0.0, z: 0.0},
            {x: 0.7, y: 0.6, z: 0.6},
            0.25 * 128,
        )
    } else if (i === 6) {
        // Green Rubber
        return new Material(
            {x: 0.0, y: 0.05, z: 0.00},
            {x: 0.4, y: 0.5, z: 0.4},
            {x: 0.04, y: 0.7, z: 0.04},
            0.078125 * 128,
        )
    } else if (i === 7) {
        // Yellow Rubber
        return new Material(
            {x: 0.05, y: 0.05, z: 0.00},
            {x: 0.5, y: 0.5, z: 0.4},
            {x: 0.7, y: 0.7, z: 0.04},
            0.078125 * 128,
        )
    }




}