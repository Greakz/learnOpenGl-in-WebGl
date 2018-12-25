import { ShaderLoader } from './BaseStack/ShaderLoader';
import { Canvas } from './BaseStack/Canvas';
import {Transform} from "stream";
import {Transformation} from "./Transformation";
import {mat4ToF32} from "./BaseStack/Math/Matrix/matTo";
import {Camera} from "./Camera";

export class DebugCubeMapShader {

    public program: WebGLProgram;

    public attribute_locations: {
        vertex_position: number;
    };

    public uniform_locations: {
       model_matrix: WebGLUniformLocation;
       debug_sample: WebGLUniformLocation;
       view_matrix: WebGLUniformLocation;
       projection_matrix: WebGLUniformLocation;
    };

    create() {
        this.program = ShaderLoader.buildShader('DebugCubeMapShader');
        const GL: WebGL2RenderingContext = Canvas.getGL();
        this.attribute_locations = {
            vertex_position: GL.getAttribLocation(this.program, 'VertexPosition'),
        };
        this.uniform_locations = {
            debug_sample: GL.getUniformLocation(this.program, 'debug_sample'),
            model_matrix: GL.getUniformLocation(this.program, 'model_matrix'),
            view_matrix: GL.getUniformLocation(this.program, 'view_matrix'),
            projection_matrix: GL.getUniformLocation(this.program, 'projection_matrix')
        };

        this.cubeVAO = GL.createVertexArray();
        GL.bindVertexArray(this.cubeVAO);

        this.planeBuffer = GL.createBuffer();
        GL.bindBuffer(GL.ARRAY_BUFFER, this.planeBuffer);
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array([
            -0.5, -0.5, 0.5,
            0.5,  -0.5, 0.5,
            0.5, 0.5, 0.5,
            -0.5, -0.5, 0.5,
            0.5, 0.5, 0.5,
            -0.5, 0.5, 0.5,

            -0.5, -0.5, -0.5,
            -0.5, 0.5, -0.5,
            0.5, 0.5, -0.5,
            -0.5, -0.5, -0.5,
            0.5, 0.5, -0.5,
            0.5, -0.5, -0.5,

            -0.5, 0.5, -0.5,
            -0.5, 0.5, 0.5,
            0.5, 0.5, 0.5,
            -0.5, 0.5, -0.5,
            0.5, 0.5, 0.5,
            0.5, 0.5, -0.5,

            -0.5, -0.5, -0.5,
            0.5, -0.5, -0.5,
            0.5, -0.5, 0.5,
            -0.5, -0.5, -0.5,
            0.5, -0.5, 0.5,
            -0.5, -0.5, 0.5,

            0.5, -0.5, -0.5,
            0.5, 0.5, -0.5,
            0.5, 0.5, 0.5,
            0.5, -0.5, -0.5,
            0.5, 0.5, 0.5,
            0.5, -0.5, 0.5,

            -0.5, -0.5, -0.5,
            -0.5, -0.5, 0.5,
            -0.5, 0.5, 0.5,
            -0.5, -0.5, -0.5,
            -0.5, 0.5, 0.5,
            -0.5, 0.5, -0.5,
        ]), GL.STATIC_DRAW);

        GL.vertexAttribPointer(this.attribute_locations.vertex_position, 3, GL.FLOAT, false, 0, 0);
        GL.enableVertexAttribArray(this.attribute_locations.vertex_position);

        GL.bindBuffer(GL.ARRAY_BUFFER, null);
        GL.bindVertexArray(null);

        this.camera.setPosition({x: 1.5, y: -2, z: -0.9});

    }

    private planeBuffer: WebGLBuffer;
    cubeVAO: WebGLVertexArrayObject;
    transform: Transformation = new Transformation();
    camera: Camera = new Camera();

    time: number = 0;
    renderDebugSample(debug_sample: WebGLTexture) {
        const GL: WebGL2RenderingContext = Canvas.getGL();
        this.time += 50;
        this.camera.update(this.time);
        GL.disable(GL.DEPTH_TEST);
        GL.enable(GL.CULL_FACE);
        GL.cullFace(GL.BACK);
        GL.useProgram(this.program);
        GL.bindVertexArray(this.cubeVAO);

        GL.uniformMatrix4fv(this.uniform_locations.view_matrix, false, mat4ToF32(this.camera.getViewMatrix()));
        GL.uniformMatrix4fv(this.uniform_locations.projection_matrix, false, mat4ToF32(this.camera.getProjectionMatrix()));
        GL.uniformMatrix4fv(this.uniform_locations.model_matrix, false, mat4ToF32(this.transform.getMatrix()));

        GL.activeTexture(GL.TEXTURE0);
        GL.bindTexture(GL.TEXTURE_CUBE_MAP, debug_sample);
        GL.uniform1i(this.uniform_locations.debug_sample, 0);

        GL.drawArrays(GL.TRIANGLES, 0, 36);
        GL.bindVertexArray(null);
    }

}