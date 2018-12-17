import { Canvas } from './BaseStack/Canvas';
import { Shader } from './Shader';

export class TriangleIndexed {

    // positioned left on screen
    private vertex_positions: number[] = [
        0.5, 0.4, 0.0, // top
        0.9, -0.4, 0.0, // bottom right
        0.1, -0.4, 0.0, // bottom left
    ];

    private texture_coordinates: number[] = [
        0.5, 1.0, // top,
        1.0, 0.0, // bottom right
        0.0, 0.0, // bottom left
    ];

    // in wich order the components get loaded
    private vertex_indices: number[] = [
        2, 1, 0
    ];

    private color: number[] = [
        0.1, 0.1, 0.5, 1.0
    ];

    private vertex_position_buffer: WebGLBuffer;
    private texture_coordinate_buffer: WebGLBuffer;
    private vertex_index_buffer: WebGLBuffer;

    initBuffer() {
        const GL: WebGL2RenderingContext = Canvas.getGL();

        this.vertex_position_buffer = GL.createBuffer();
        GL.bindBuffer(GL.ARRAY_BUFFER, this.vertex_position_buffer);
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(this.vertex_positions), GL.STATIC_DRAW);
        GL.bindBuffer(GL.ARRAY_BUFFER, null);

        this.texture_coordinate_buffer = GL.createBuffer();
        GL.bindBuffer(GL.ARRAY_BUFFER, this.texture_coordinate_buffer);
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(this.texture_coordinates), GL.STATIC_DRAW);
        GL.bindBuffer(GL.ARRAY_BUFFER, null);

        this.vertex_index_buffer = GL.createBuffer();
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.vertex_index_buffer);
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.vertex_indices), GL.STATIC_DRAW);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null)
    }

    draw(shader: Shader) {
        const GL: WebGL2RenderingContext = Canvas.getGL();
        GL.useProgram(shader.program);

        GL.bindBuffer(GL.ARRAY_BUFFER, this.vertex_position_buffer);
        GL.vertexAttribPointer(shader.attribute_locations.vertex_position, 3, GL.FLOAT, false, 0, 0);
        GL.enableVertexAttribArray(shader.attribute_locations.vertex_position);
        GL.bindBuffer(GL.ARRAY_BUFFER, null);

        GL.bindBuffer(GL.ARRAY_BUFFER, this.texture_coordinate_buffer);
        GL.vertexAttribPointer(shader.attribute_locations.texture_coordinate, 2, GL.FLOAT, false, 0, 0);
        GL.enableVertexAttribArray(shader.attribute_locations.texture_coordinate);
        GL.bindBuffer(GL.ARRAY_BUFFER, null);

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.vertex_index_buffer);

        GL.uniform4fv(shader.uniform_locations.color, new Float32Array(this.color));

        GL.drawElements(GL.TRIANGLES, 3, GL.UNSIGNED_SHORT, 0);

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);
    }
}