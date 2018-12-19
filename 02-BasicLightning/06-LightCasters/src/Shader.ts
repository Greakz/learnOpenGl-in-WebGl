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

        amb_color: WebGLUniformLocation;

        dir_color: WebGLUniformLocation;
        dir_direction: WebGLUniformLocation;
        dir_ambient: WebGLUniformLocation;
        dir_diffuse: WebGLUniformLocation;
        dir_specular: WebGLUniformLocation;

        point_color: WebGLUniformLocation;
        point_position: WebGLUniformLocation;
        point_ambient: WebGLUniformLocation;
        point_diffuse: WebGLUniformLocation;
        point_specular: WebGLUniformLocation;
        point_con_lin_quad: WebGLUniformLocation;

        spot_color: WebGLUniformLocation;
        spot_position: WebGLUniformLocation;
        spot_direction: WebGLUniformLocation;
        spot_ambient: WebGLUniformLocation;
        spot_diffuse: WebGLUniformLocation;
        spot_specular: WebGLUniformLocation;
        spot_con_lin_quad: WebGLUniformLocation;
        spot_cutoff: WebGLUniformLocation;

        camera_position: WebGLUniformLocation;
    };

    create() {
        this.program = ShaderLoader.buildShader('shader');
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

            amb_color: GL.getUniformLocation(this.program, 'amb_color'),

            dir_color: GL.getUniformLocation(this.program, 'dir_color'),
            dir_direction: GL.getUniformLocation(this.program, 'dir_direction'),
            dir_ambient: GL.getUniformLocation(this.program, 'dir_ambient'),
            dir_diffuse: GL.getUniformLocation(this.program, 'dir_diffuse'),
            dir_specular: GL.getUniformLocation(this.program, 'dir_specular'),

            point_color: GL.getUniformLocation(this.program, 'point_color'),
            point_position: GL.getUniformLocation(this.program, 'point_position'),
            point_ambient: GL.getUniformLocation(this.program, 'point_ambient'),
            point_diffuse: GL.getUniformLocation(this.program, 'point_diffuse'),
            point_specular: GL.getUniformLocation(this.program, 'point_specular'),
            point_con_lin_quad: GL.getUniformLocation(this.program, 'point_con_lin_quad'),

            spot_color: GL.getUniformLocation(this.program, 'spot_color'),
            spot_position: GL.getUniformLocation(this.program, 'spot_position'),
            spot_direction: GL.getUniformLocation(this.program, 'spot_direction'),
            spot_ambient: GL.getUniformLocation(this.program, 'spot_ambient'),
            spot_diffuse: GL.getUniformLocation(this.program, 'spot_diffuse'),
            spot_specular: GL.getUniformLocation(this.program, 'spot_specular'),
            spot_con_lin_quad: GL.getUniformLocation(this.program, 'spot_con_lin_quad'),
            spot_cutoff: GL.getUniformLocation(this.program, 'spot_cutoff'),

            camera_position: GL.getUniformLocation(this.program, 'camera_position')
        };
    }

}