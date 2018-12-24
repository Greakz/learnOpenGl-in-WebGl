import { ShaderLoader } from './BaseStack/ShaderLoader';
import { Canvas } from './BaseStack/Canvas';

export class Shader {

    public program: WebGLProgram;

    public attribute_locations: {
        vertex_position: number;
        vertex_normal: number;
    };

    public uniform_locations: {
        model_matrix: WebGLUniformLocation;
        view_matrix: WebGLUniformLocation;
        projection_matrix: WebGLUniformLocation;
        mat_ambient: WebGLUniformLocation;
        mat_diffuse: WebGLUniformLocation;
        mat_specular: WebGLUniformLocation;
        mat_shininess: WebGLUniformLocation;
        light_position: WebGLUniformLocation;
        camera_position: WebGLUniformLocation;
    };

    create() {
        this.program = ShaderLoader.buildShader('Shader');
        const GL: WebGL2RenderingContext = Canvas.getGL();
        this.attribute_locations = {
            vertex_position: GL.getAttribLocation(this.program, 'VertexPosition'),
            vertex_normal: GL.getAttribLocation(this.program, 'VertexNormal'),
        };
        this.uniform_locations = {
            model_matrix: GL.getUniformLocation(this.program, 'model_matrix'),
            view_matrix: GL.getUniformLocation(this.program, 'view_matrix'),
            projection_matrix: GL.getUniformLocation(this.program, 'projection_matrix'),
            mat_ambient: GL.getUniformLocation(this.program, 'mat_ambient'),
            mat_diffuse: GL.getUniformLocation(this.program, 'mat_diffuse'),
            mat_specular: GL.getUniformLocation(this.program, 'mat_specular'),
            mat_shininess: GL.getUniformLocation(this.program, 'mat_shininess'),
            light_position: GL.getUniformLocation(this.program, 'light_position'),
            camera_position: GL.getUniformLocation(this.program, 'camera_position')
        };
    }

}