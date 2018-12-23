import {Canvas} from "./BaseStack/Canvas";
import {getScalingMatrix} from "./Math/Matrix/scaling";
import {mat4ToF32} from "./Math/Matrix/matTo";
import {SkyBoxShader} from "./SkyBoxShader";

export class SkyBox {

    private texture: WebGLTexture;
    private files: string[] = [
        "interstellar_lf.jpg",
        "interstellar_rt.jpg",
        "interstellar_up.jpg",
        "interstellar_dn.jpg",
        "interstellar_ft.jpg",
        "interstellar_bk.jpg"
    ];
    private images: HTMLImageElement[];

    init() {
        const GL = Canvas.getGL();
        console.log(
            GL.TEXTURE_CUBE_MAP_POSITIVE_X,
            GL.TEXTURE_CUBE_MAP_NEGATIVE_X,
            GL.TEXTURE_CUBE_MAP_POSITIVE_Y,
            GL.TEXTURE_CUBE_MAP_NEGATIVE_Y,
            GL.TEXTURE_CUBE_MAP_POSITIVE_Z,
            GL.TEXTURE_CUBE_MAP_NEGATIVE_Z,
        );
        this.texture = GL.createTexture();
        GL.bindTexture(GL.TEXTURE_CUBE_MAP, this.texture);
        for(let i = 0; i < 6; i++) {
            let image: HTMLImageElement = new Image();
            image.onload = () => {
                GL.texImage2D(GL.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, GL.RGB, 512, 512, 0, GL.RGB, GL.UNSIGNED_BYTE, image);
            };
            image.src = 'Assets/CubeMaps/Interstellar/' + this.files[i];
        }
        GL.texParameteri(GL.TEXTURE_CUBE_MAP, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
        GL.texParameteri(GL.TEXTURE_CUBE_MAP, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
        GL.texParameteri(GL.TEXTURE_CUBE_MAP, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
        GL.texParameteri(GL.TEXTURE_CUBE_MAP, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
        GL.texParameteri(GL.TEXTURE_CUBE_MAP, GL.TEXTURE_WRAP_R, GL.CLAMP_TO_EDGE);
        this.initVao();
    }

    model_mat: Float32Array = mat4ToF32(getScalingMatrix(150,150,150));

    drawSkyBox (skyBoxShader: SkyBoxShader) {
        const GL = Canvas.getGL();
        GL.disable(GL.CULL_FACE);
        GL.depthFunc(GL.LEQUAL);
        GL.depthMask(false);
        GL.bindVertexArray(this.vao);

        this.bindCubeMapTexture(skyBoxShader.uniform_locations.skybox);

        GL.uniformMatrix4fv(skyBoxShader.uniform_locations.model_matrix, false, this.model_mat);
        GL.drawArrays(GL.TRIANGLES, 0, 36);
        GL.bindVertexArray(null);
        GL.depthFunc(GL.LESS);
        GL.depthMask(true);
        GL.enable(GL.CULL_FACE);
    }

    bindCubeMapTexture(position: WebGLUniformLocation) {
        const GL = Canvas.getGL();
        GL.activeTexture(GL.TEXTURE0);
        GL.bindTexture(GL.TEXTURE_CUBE_MAP, this.texture);
        GL.uniform1i(position, 0);
    }

    private vao: WebGLVertexArrayObject;
    private vertexBuffer: WebGLBuffer;
    private vertex: number[] = [
        // Position
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,
        1.0, 1.0, 1.0,
        -1.0, -1.0, 1.0,
        1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0,

        -1.0, -1.0, -1.0,
        -1.0, 1.0, -1.0,
        1.0, 1.0, -1.0,
        -1.0, -1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, -1.0, -1.0,

        -1.0, 1.0, -1.0,
        -1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        -1.0, 1.0, -1.0,
        1.0, 1.0, 1.0,
        1.0, 1.0, -1.0,

        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0, 1.0,
        -1.0, -1.0, -1.0,
        1.0, -1.0, 1.0,
        -1.0, -1.0, 1.0,

        1.0, -1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, 1.0, 1.0,
        1.0, -1.0, -1.0,
        1.0, 1.0, 1.0,
        1.0, -1.0, 1.0,

        -1.0, -1.0, -1.0,
        -1.0, -1.0, 1.0,
        -1.0, 1.0, 1.0,
        -1.0, -1.0, -1.0,
        -1.0, 1.0, 1.0,
        -1.0, 1.0, -1.0,
    ];
    private initVao() {
        const GL = Canvas.getGL();
        this.vao = GL.createVertexArray();
        GL.bindVertexArray(this.vao);

        this.vertexBuffer = GL.createBuffer();
        GL.bindBuffer(GL.ARRAY_BUFFER, this.vertexBuffer);
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(this.vertex), GL.STATIC_DRAW);
        GL.vertexAttribPointer(0, 3, GL.FLOAT, false, 0, 0);
        GL.enableVertexAttribArray(0);
        GL.bindBuffer(GL.ARRAY_BUFFER, null);
        GL.bindVertexArray(null);
    }
}