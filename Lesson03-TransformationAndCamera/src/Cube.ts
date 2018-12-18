import { Canvas } from './BaseStack/Canvas';
import { Shader } from './Shader';
import { Transformation } from './Transformation';
import { mat4ToF32 } from './Math/Matrix/matTo';
import { Camera } from './Camera';

export class Cube {

    public transformation: Transformation = new Transformation();

    // positioned left on screen
    private vertex_positions: number[] = [
        // Position         // Color
        -0.5, -0.5, 0.5,    1.0, 0.0, 0.0, 1.0,
        0.5, -0.5, 0.5,    1.0, 0.0, 0.0, 1.0,
        0.5, 0.5, 0.5,    1.0, 0.0, 0.0, 1.0,
        -0.5, -0.5, 0.5,    1.0, 0.0, 0.0, 1.0,
        0.5, 0.5, 0.5,    1.0, 0.0, 0.0, 1.0,
        -0.5, 0.5, 0.5,    1.0, 0.0, 0.0, 1.0,

        -0.5, -0.5, -0.5,   0.0, 1.0, 0.0, 1.0,
        -0.5, 0.5, -0.5,   0.0, 1.0, 0.0, 1.0,
        0.5, 0.5, -0.5,   0.0, 1.0, 0.0, 1.0,
        -0.5, -0.5, -0.5,   0.0, 1.0, 0.0, 1.0,
        0.5, 0.5, -0.5,   0.0, 1.0, 0.0, 1.0,
        0.5, -0.5, -0.5,   0.0, 1.0, 0.0, 1.0,

        -0.5, 0.5, -0.5,   0.0, 0.0, 1.0, 1.0,
        -0.5, 0.5, 0.5,   0.0, 0.0, 1.0, 1.0,
        0.5, 0.5, 0.5,   0.0, 0.0, 1.0, 1.0,
        -0.5, 0.5, -0.5,   0.0, 0.0, 1.0, 1.0,
        0.5, 0.5, 0.5,   0.0, 0.0, 1.0, 1.0,
        0.5, 0.5, -0.5,   0.0, 0.0, 1.0, 1.0,

        -0.5, -0.5, -0.5,   0.0, 1.0, 1.0, 1.0,
        0.5, -0.5, -0.5,   0.0, 1.0, 1.0, 1.0,
        0.5, -0.5, 0.5,   0.0, 1.0, 1.0, 1.0,
        -0.5, -0.5, -0.5,   0.0, 1.0, 1.0, 1.0,
        0.5, -0.5, 0.5,   0.0, 1.0, 1.0, 1.0,
        -0.5, -0.5, 0.5,   0.0, 1.0, 1.0, 1.0,

        0.5, -0.5, -0.5,   1.0, 1.0, 1.0, 1.0,
        0.5, 0.5, -0.5,   1.0, 1.0, 1.0, 1.0,
        0.5, 0.5, 0.5,   1.0, 1.0, 1.0, 1.0,
        0.5, -0.5, -0.5,   1.0, 1.0, 1.0, 1.0,
        0.5, 0.5, 0.5,   1.0, 1.0, 1.0, 1.0,
        0.5, -0.5, 0.5,   1.0, 1.0, 1.0, 1.0,

        -0.5, -0.5, -0.5,   0.0, 0.0, 0.0, 1.0,
        -0.5, -0.5, 0.5,   0.0, 0.0, 0.0, 1.0,
        -0.5, 0.5, 0.5,   0.0, 0.0, 0.0, 1.0,
        -0.5, -0.5, -0.5,   0.0, 0.0, 0.0, 1.0,
        -0.5, 0.5, 0.5,   0.0, 0.0, 0.0, 1.0,
        -0.5, 0.5, -0.5,   0.0, 0.0, 0.0, 1.0,
    ];

    private vertex_position_buffer: WebGLBuffer;

    initBuffer() {
        const GL: WebGL2RenderingContext = Canvas.getGL();
        this.vertex_position_buffer = GL.createBuffer();
        GL.bindBuffer(GL.ARRAY_BUFFER, this.vertex_position_buffer);
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(this.vertex_positions), GL.STATIC_DRAW);
        GL.bindBuffer(GL.ARRAY_BUFFER, null);
    }

    update(time: number) {
        this.transformation.rotateX(0.9);
    }

    draw(shader: Shader, camera: Camera) {
        const GL: WebGL2RenderingContext = Canvas.getGL();
        GL.useProgram(shader.program);

        GL.bindBuffer(GL.ARRAY_BUFFER, this.vertex_position_buffer);
        GL.vertexAttribPointer(shader.attribute_locations.vertex_position, 3, GL.FLOAT, false, 7 * 4, 0);
        GL.enableVertexAttribArray(shader.attribute_locations.vertex_position);
        GL.vertexAttribPointer(shader.attribute_locations.vertex_color, 4, GL.FLOAT, false, 7 * 4, 3 * 4);
        GL.enableVertexAttribArray(shader.attribute_locations.vertex_color);
        GL.bindBuffer(GL.ARRAY_BUFFER, null);

        const model_matrix: Float32Array = mat4ToF32(this.transformation.getMatrix());
        GL.uniformMatrix4fv(shader.uniform_locations.model_matrix, false, model_matrix);

        const view_matrix: Float32Array = mat4ToF32(camera.getViewMatrix());
        GL.uniformMatrix4fv(shader.uniform_locations.view_matrix, false, view_matrix);

        const projection_matrix: Float32Array = mat4ToF32(camera.getProjectionMatrix());
        GL.uniformMatrix4fv(shader.uniform_locations.projection_matrix, false, projection_matrix);

        // GL.uniform4fv(shader.uniform_locations.color, new Float32Array(this.color));

        GL.drawArrays(GL.TRIANGLES, 0, 36);
    }
}