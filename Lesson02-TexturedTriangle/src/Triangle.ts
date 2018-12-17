import { Canvas } from './BaseStack/Canvas';
import { Shader } from './Shader';

const textureSrc = require('./Assets/wadahek.jpg');

export class Triangle {

    // positioned left on screen
    private vertex_positions: number[] = [
        -0.9, -0.4, 0.0, // bottom left
        -0.1, -0.4, 0.0, // bottom right
        -0.5, 0.4, 0.0, // top
    ];

    private texture_coordinates: number[] = [
        0.0, 0.0, // bottom left
        1.0, 0.0, // bottom right
        0.5, 1.0, // top
    ];

    private color: number[] = [
        0.5, 0.1, 0.1, 1.0
    ];

    private vertex_position_buffer: WebGLBuffer;
    private texture_coordinate_buffer: WebGLBuffer;

    private texture: WebGLTexture;

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

        this.texture = GL.createTexture();
        GL.bindTexture(GL.TEXTURE_2D, this.texture);
        let image = new Image();
        image.src = textureSrc;
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGB, 128, 128, 0, GL.RGB, GL.UNSIGNED_BYTE, image)
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

        GL.uniform4fv(shader.uniform_locations.color, new Float32Array(this.color));

        GL.drawArrays(GL.TRIANGLES, 0, 3);
    }
}