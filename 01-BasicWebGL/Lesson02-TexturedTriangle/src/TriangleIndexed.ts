import { Canvas } from './BaseStack/Canvas';
import { Shader } from './Shader';

export class TriangleIndexed {

    // positioned left on screen
    private vertex: number[] = [
        0.5, 0.4, 0.0, 0.5, 1.0, // top
        0.9, -0.4, 0.0, 1.0, 0.0, // bottom right
        0.1, -0.4, 0.0, 0.0, 0.0 // bottom left
    ];

    // in wich order the components get loaded
    private vertex_indices: number[] = [
        2, 1, 0
    ];

    private color: number[] = [
        0.5, 0.5, 1.0, 1.0
    ];

    private vertex_buffer: WebGLBuffer;
    private vertex_index_buffer: WebGLBuffer;

    private texture: WebGLTexture;
    private image: HTMLImageElement;

    initBuffer() {
        const GL: WebGL2RenderingContext = Canvas.getGL();

        this.vertex_buffer = GL.createBuffer();
        GL.bindBuffer(GL.ARRAY_BUFFER, this.vertex_buffer);
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(this.vertex), GL.STATIC_DRAW);
        GL.bindBuffer(GL.ARRAY_BUFFER, null);

        this.vertex_index_buffer = GL.createBuffer();
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.vertex_index_buffer);
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.vertex_indices), GL.STATIC_DRAW);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);

        this.texture = GL.createTexture();
        GL.bindTexture(GL.TEXTURE_2D, this.texture);

        this.image = new Image();
        this.image.onload = () => {
            GL.bindTexture(GL.TEXTURE_2D, this.texture);
            GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, 16, 16, 0, GL.RGBA, GL.UNSIGNED_BYTE, this.image);
            // base settings, make it editable with textureoptions
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST);
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST);
        };
        this.image.src = './Assets/stone.png';
    }

    draw(shader: Shader) {
        const GL: WebGL2RenderingContext = Canvas.getGL();
        GL.useProgram(shader.program);

        GL.bindBuffer(GL.ARRAY_BUFFER, this.vertex_buffer);
        GL.vertexAttribPointer(shader.attribute_locations.vertex_position, 3, GL.FLOAT, false, 5 * 4, 0);
        GL.enableVertexAttribArray(shader.attribute_locations.vertex_position);
        GL.vertexAttribPointer(shader.attribute_locations.texture_coordinate, 2, GL.FLOAT, false, 5 * 4, 3 * 4);
        GL.enableVertexAttribArray(shader.attribute_locations.texture_coordinate);
        GL.bindBuffer(GL.ARRAY_BUFFER, null);

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.vertex_index_buffer);

        GL.uniform4fv(shader.uniform_locations.color, new Float32Array(this.color));

        GL.activeTexture(GL.TEXTURE0);
        GL.bindTexture(GL.TEXTURE_2D, this.texture);
        GL.uniform1i(shader.uniform_locations.texture, 0);
        // GL.uniform1i(shader.uniform_locations.texture2, 0);

        GL.drawElements(GL.TRIANGLES, 3, GL.UNSIGNED_SHORT, 0);

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);
    }
}