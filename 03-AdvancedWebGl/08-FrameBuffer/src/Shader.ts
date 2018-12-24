import { ShaderLoader } from './BaseStack/ShaderLoader';
import { Canvas } from './BaseStack/Canvas';

export class Shader {

    public program: WebGLProgram;

    public attribute_locations: {
        vertex_position: number;
        vertex_normal: number;
        vertex_tex_coord: number;
    };

    public uniform_locations: {
        model_matrix: WebGLUniformLocation;
        view_matrix: WebGLUniformLocation;
        projection_matrix: WebGLUniformLocation;

        mat_diffuse: WebGLUniformLocation;
        mat_specular: WebGLUniformLocation;
        mat_shininess: WebGLUniformLocation;
        mat_add_color: WebGLUniformLocation;

        dir_color: WebGLUniformLocation;
        dir_direction: WebGLUniformLocation;
        dir_ambient: WebGLUniformLocation;
        dir_diffuse: WebGLUniformLocation;
        dir_specular: WebGLUniformLocation;

        camera_position: WebGLUniformLocation;
    };

    create() {
        this.program = ShaderLoader.buildShader('Shader');
        const GL: WebGL2RenderingContext = Canvas.getGL();
        this.attribute_locations = {
            vertex_position: GL.getAttribLocation(this.program, 'VertexPosition'),
            vertex_normal: GL.getAttribLocation(this.program, 'VertexNormal'),
            vertex_tex_coord: GL.getAttribLocation(this.program, 'VertexTexCoord'),
        };
        this.uniform_locations = {
            model_matrix: GL.getUniformLocation(this.program, 'model_matrix'),
            view_matrix: GL.getUniformLocation(this.program, 'view_matrix'),
            projection_matrix: GL.getUniformLocation(this.program, 'projection_matrix'),

            mat_diffuse: GL.getUniformLocation(this.program, 'mat_diffuse'),
            mat_specular: GL.getUniformLocation(this.program, 'mat_specular'),
            mat_shininess: GL.getUniformLocation(this.program, 'mat_shininess'),
            mat_add_color: GL.getUniformLocation(this.program, 'mat_add_color'),

            dir_color: GL.getUniformLocation(this.program, 'dir_color'),
            dir_direction: GL.getUniformLocation(this.program, 'dir_direction'),
            dir_ambient: GL.getUniformLocation(this.program, 'dir_ambient'),
            dir_diffuse: GL.getUniformLocation(this.program, 'dir_diffuse'),
            dir_specular: GL.getUniformLocation(this.program, 'dir_specular'),

            camera_position: GL.getUniformLocation(this.program, 'camera_position')
        };
    }

}