import { ShaderLoader } from './BaseStack/ShaderLoader';
import { Canvas } from './BaseStack/Canvas';

export class Shader {

    public program: WebGLProgram;

    public attribute_locations: {
        vertex_position: number
    };

    public uniform_locations: {
        color: WebGLUniformLocation
    };

    create() {
        this.program = ShaderLoader.buildShader('shader');
        const GL: WebGL2RenderingContext = Canvas.getGL();
        this.attribute_locations = {
            vertex_position: GL.getAttribLocation(this.program, 'VertexPosition')
        };
        this.uniform_locations = {
            color: GL.getUniformLocation(this.program, 'color')
        };
    }

}