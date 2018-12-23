import { ShaderLoader } from './BaseStack/ShaderLoader';
import { Canvas } from './BaseStack/Canvas';

export class SkyBoxShader {

    public program: WebGLProgram;

    public attribute_locations: {
        vertex_position: number;
    };

    public uniform_locations: {
        model_matrix: WebGLUniformLocation;
        view_matrix: WebGLUniformLocation;
        projection_matrix: WebGLUniformLocation;
        skybox: WebGLUniformLocation;
    };

    create() {
        this.program = ShaderLoader.buildShader('SkyBoxShader');
        const GL: WebGL2RenderingContext = Canvas.getGL();
        this.attribute_locations = {
            vertex_position: GL.getAttribLocation(this.program, 'VertexPosition'),
        };
        this.uniform_locations = {
            model_matrix: GL.getUniformLocation(this.program, 'model_matrix'),
            view_matrix: GL.getUniformLocation(this.program, 'view_matrix'),
            projection_matrix: GL.getUniformLocation(this.program, 'projection_matrix'),
            skybox: GL.getUniformLocation(this.program, 'skybox'),
        };
    }

}