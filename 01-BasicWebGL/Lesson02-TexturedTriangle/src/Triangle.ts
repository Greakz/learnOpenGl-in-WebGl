import { Canvas } from './BaseStack/Canvas';
import { Shader } from './Shader';

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
        1.0, 0.5, 0.5, 1.0
    ];

    private vertex_position_buffer: WebGLBuffer;
    private texture_coordinate_buffer: WebGLBuffer;

    private texture: WebGLTexture;
    private image: HTMLImageElement;
    private texture2: WebGLTexture;
    private image2: HTMLImageElement;

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

        this.image = new Image();
        this.image.onload = () => {
            GL.bindTexture(GL.TEXTURE_2D, this.texture);
            GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, 16, 16, 0, GL.RGBA, GL.UNSIGNED_BYTE, this.image);
            // base settings, make it editable with textureoptions
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
        };
        this.image.src = './Assets/wood_top.png';

        this.texture2 = GL.createTexture();
        GL.bindTexture(GL.TEXTURE_2D, this.texture2);

        this.image = new Image();
        this.image.onload = () => {
            GL.bindTexture(GL.TEXTURE_2D, this.texture2);
            GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, 16, 16, 0, GL.RGBA, GL.UNSIGNED_BYTE, this.image);
            // base settings, make it editable with textureoptions
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
        };
        this.image.src = './Assets/face.png';
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

        GL.activeTexture(GL.TEXTURE0);
        GL.bindTexture(GL.TEXTURE_2D, this.texture);
        GL.uniform1i(shader.uniform_locations.texture, 0);

        GL.activeTexture(GL.TEXTURE1);
        GL.bindTexture(GL.TEXTURE_2D, this.texture2);
        GL.uniform1i(shader.uniform_locations.texture2, 1);

        GL.uniform4fv(shader.uniform_locations.color, new Float32Array(this.color));

        GL.drawArrays(GL.TRIANGLES, 0, 3);
    }
}