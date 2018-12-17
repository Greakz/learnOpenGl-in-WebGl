import { Canvas } from './BaseStack/Canvas';
import { Shader } from './Shader';

export class Triangle {

    private vertex_positions: number[] = [
        -0.5, -0.5, 0.0, // bottom left
        0.5, -0.5, 0.0, // bottom right
        0.0, 0.5, 0.0, // top
    ];

    private color: number[] = [
        0.5, 0.1, 0.1, 1.0
    ];

    private vertex_position_buffer: WebGLBuffer;

    initBuffer() {
        const GL: WebGL2RenderingContext = Canvas.getGL();
        this.vertex_position_buffer = GL.createBuffer();
        GL.bindBuffer(GL.ARRAY_BUFFER, this.vertex_position_buffer);
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(this.vertex_positions), GL.STATIC_DRAW);
        GL.bindBuffer(GL.ARRAY_BUFFER, null);
    }

    draw(shader: Shader) {
        const GL: WebGL2RenderingContext = Canvas.getGL();
        GL.useProgram(shader.program);
        GL.bindBuffer(GL.ARRAY_BUFFER, this.vertex_position_buffer);
        GL.vertexAttribPointer(shader.attribute_locations.vertex_position, 3, GL.FLOAT, false, 0, 0);
        GL.enableVertexAttribArray(shader.attribute_locations.vertex_position);
        GL.uniform4fv(shader.uniform_locations.color, new Float32Array(this.color));
        GL.drawArrays(GL.TRIANGLES, 0, 3);
    }
}