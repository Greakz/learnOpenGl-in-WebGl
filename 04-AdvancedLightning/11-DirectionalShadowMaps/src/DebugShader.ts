import { ShaderLoader } from './BaseStack/ShaderLoader';
import { Canvas } from './BaseStack/Canvas';

export class DebugShader {

    public program: WebGLProgram;

    public attribute_locations: {
        vertex_position: number;
    };

    public uniform_locations: {
       debug_sample: WebGLUniformLocation;
    };

    create() {
        this.program = ShaderLoader.buildShader('DebugShader');
        const GL: WebGL2RenderingContext = Canvas.getGL();
        this.attribute_locations = {
            vertex_position: GL.getAttribLocation(this.program, 'VertexPosition'),
        };
        this.uniform_locations = {
            debug_sample: GL.getUniformLocation(this.program, 'debug_sample')
        };

        this.planeVAO = GL.createVertexArray();
        GL.bindVertexArray(this.planeVAO);

        this.planeBuffer = GL.createBuffer();
        GL.bindBuffer(GL.ARRAY_BUFFER, this.planeBuffer);
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array([
            -1.0, 1.0,
            -1.0, -1.0,
            1.0, 1.0,

            -1.0, -1.0,
            1.0, -1.0,
            1.0, 1.0
        ]), GL.STATIC_DRAW);

        GL.vertexAttribPointer(this.attribute_locations.vertex_position, 2, GL.FLOAT, false, 0, 0);
        GL.enableVertexAttribArray(this.attribute_locations.vertex_position);

        GL.bindBuffer(GL.ARRAY_BUFFER, null);
        GL.bindVertexArray(null);


    }

    private planeBuffer: WebGLBuffer;
    planeVAO: WebGLVertexArrayObject;

    renderDebugSample(debug_sample: WebGLTexture) {
        const GL: WebGL2RenderingContext = Canvas.getGL();
        GL.disable(GL.DEPTH_TEST);
        GL.disable(GL.CULL_FACE);
        GL.useProgram(this.program);
        GL.bindVertexArray(this.planeVAO);

        GL.activeTexture(GL.TEXTURE0);
        GL.bindTexture(GL.TEXTURE_2D, debug_sample);
        GL.uniform1i(this.uniform_locations.debug_sample, 0);

        GL.drawArrays(GL.TRIANGLES, 0, 6);
        GL.bindVertexArray(null);
    }

}