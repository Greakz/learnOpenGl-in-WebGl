import { ShaderLoader } from './BaseStack/ShaderLoader';
import { Canvas } from './BaseStack/Canvas';

export class ShadowShader {

    public program: WebGLProgram;

    public attribute_locations: {
        vertex_position: number;
    };

    public uniform_locations: {
        model_matrix: WebGLUniformLocation;
        light_space_matrix: WebGLUniformLocation;
        dir_shadow_map: WebGLUniformLocation;
        light_pos: WebGLUniformLocation;
        far_plane: WebGLUniformLocation;
    };

    create() {
        this.program = ShaderLoader.buildShader('ShadowShader');
        const GL: WebGL2RenderingContext = Canvas.getGL();
        this.attribute_locations = {
            vertex_position: GL.getAttribLocation(this.program, 'VertexPosition'),
        };
        this.uniform_locations = {
            model_matrix: GL.getUniformLocation(this.program, 'model_matrix'),
            light_space_matrix: GL.getUniformLocation(this.program, 'light_space_matrix'),
            dir_shadow_map: GL.getUniformLocation(this.program, 'dir_shadow_map'),
            far_plane: GL.getUniformLocation(this.program, 'far_plane'),
            light_pos: GL.getUniformLocation(this.program, 'light_pos'),
        };
    }

}