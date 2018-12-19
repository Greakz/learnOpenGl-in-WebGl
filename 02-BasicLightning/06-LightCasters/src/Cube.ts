import { Canvas } from './BaseStack/Canvas';
import { Shader } from './Shader';
import { Transformation } from './Transformation';
import { mat4ToF32 } from './Math/Matrix/matTo';
import { Camera } from './Camera';
import { Material } from './Material';

export class Cube {

    public transformation: Transformation = new Transformation();
    public material: Material = new Material(8);

    // positioned left on screen
    private vertex_positions: number[] = [
        // Position         // Normals          //Textures
        -0.5, -0.5, 0.5,    0.0, 0.0, 1.0,      0.0, 0.0,
        0.5,  -0.5, 0.5,    0.0, 0.0, 1.0,      1.0, 0.0,
        0.5, 0.5, 0.5,      0.0, 0.0, 1.0,      1.0, 1.0,
        -0.5, -0.5, 0.5,    0.0, 0.0, 1.0,      0.0, 0.0,
        0.5, 0.5, 0.5,      0.0, 0.0, 1.0,      1.0, 1.0,
        -0.5, 0.5, 0.5,     0.0, 0.0, 1.0,      0.0, 1.0,

        -0.5, -0.5, -0.5,   0.0, 0.0, -1.0,     0.0, 0.0,
        -0.5, 0.5, -0.5,    0.0, 0.0, -1.0,     1.0, 0.0,
        0.5, 0.5, -0.5,     0.0, 0.0, -1.0,     1.0, 1.0,
        -0.5, -0.5, -0.5,   0.0, 0.0, -1.0,     0.0, 0.0,
        0.5, 0.5, -0.5,     0.0, 0.0, -1.0,     1.0, 1.0,
        0.5, -0.5, -0.5,    0.0, 0.0, -1.0,     0.0, 1.0,

        -0.5, 0.5, -0.5,    0.0, 1.0, 0.0,      0.0, 0.0,
        -0.5, 0.5, 0.5,     0.0, 1.0, 0.0,      1.0, 0.0,
        0.5, 0.5, 0.5,      0.0, 1.0, 0.0,      1.0, 1.0,
        -0.5, 0.5, -0.5,    0.0, 1.0, 0.0,      0.0, 0.0,
        0.5, 0.5, 0.5,      0.0, 1.0, 0.0,      1.0, 1.0,
        0.5, 0.5, -0.5,     0.0, 1.0, 0.0,      0.0, 1.0,

        -0.5, -0.5, -0.5,   0.0, -1.0, 0.0,     0.0, 0.0,
        0.5, -0.5, -0.5,    0.0, -1.0, 0.0,     1.0, 0.0,
        0.5, -0.5, 0.5,     0.0, -1.0, 0.0,     1.0, 1.0,
        -0.5, -0.5, -0.5,   0.0, -1.0, 0.0,     0.0, 0.0,
        0.5, -0.5, 0.5,     0.0, -1.0, 0.0,     1.0, 1.0,
        -0.5, -0.5, 0.5,    0.0, -1.0, 0.0,     0.0, 1.0,

        0.5, -0.5, -0.5,    1.0, 0.0, 0.0,      0.0, 0.0,
        0.5, 0.5, -0.5,     1.0, 0.0, 0.0,      1.0, 0.0,
        0.5, 0.5, 0.5,      1.0, 0.0, 0.0,      1.0, 1.0,
        0.5, -0.5, -0.5,    1.0, 0.0, 0.0,      0.0, 0.0,
        0.5, 0.5, 0.5,      1.0, 0.0, 0.0,      1.0, 1.0,
        0.5, -0.5, 0.5,     1.0, 0.0, 0.0,      0.0, 1.0,

        -0.5, -0.5, -0.5,   -1.0, 0.0, 0.0,     0.0, 0.0,
        -0.5, -0.5, 0.5,    -1.0, 0.0, 0.0,     1.0, 0.0,
        -0.5, 0.5, 0.5,     -1.0, 0.0, 0.0,     1.0, 1.0,
        -0.5, -0.5, -0.5,   -1.0, 0.0, 0.0,     0.0, 0.0,
        -0.5, 0.5, 0.5,     -1.0, 0.0, 0.0,     1.0, 1.0,
        -0.5, 0.5, -0.5,    -1.0, 0.0, 0.0,     0.0, 1.0
    ];

    private vertex_position_buffer: WebGLBuffer;

    initBuffer() {
        const GL: WebGL2RenderingContext = Canvas.getGL();
        this.material.init();
        this.vertex_position_buffer = GL.createBuffer();
        GL.bindBuffer(GL.ARRAY_BUFFER, this.vertex_position_buffer);
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(this.vertex_positions), GL.STATIC_DRAW);
        GL.bindBuffer(GL.ARRAY_BUFFER, null);
    }

    update(time: number) {}

    draw(shader: Shader, camera: Camera) {
        const GL: WebGL2RenderingContext = Canvas.getGL();
        GL.useProgram(shader.program);

        GL.bindBuffer(GL.ARRAY_BUFFER, this.vertex_position_buffer);
        GL.vertexAttribPointer(shader.attribute_locations.vertex_position, 3, GL.FLOAT, false, 8 * 4, 0);
        GL.enableVertexAttribArray(shader.attribute_locations.vertex_position);

        GL.vertexAttribPointer(shader.attribute_locations.vertex_normal, 3, GL.FLOAT, false, 8 * 4, 3 * 4);
        GL.enableVertexAttribArray(shader.attribute_locations.vertex_normal);

        GL.vertexAttribPointer(shader.attribute_locations.vertex_tex_coord, 2, GL.FLOAT, false, 8 * 4, 6 * 4);
        GL.enableVertexAttribArray(shader.attribute_locations.vertex_tex_coord);
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