import { Vec3 } from './Math/Vector/vec';
import { Shader } from './Shader';
import { vec3ToF32 } from './Math/Vector/vecToF32';
import { Canvas } from './BaseStack/Canvas';

export class Material {

    private diffuse: WebGLTexture;
    private diffuse_image: HTMLImageElement;
    private specular: WebGLTexture;
    private specular_image: HTMLImageElement;
    shininess: number;

    constructor(shininess: number) {
        this.shininess = shininess;
    }

    init() {
        const GL = Canvas.getGL();
        this.specular = GL.createTexture();
        this.diffuse = GL.createTexture();

        this.diffuse_image = new Image();
        this.diffuse_image.onload = () => {
            GL.bindTexture(GL.TEXTURE_2D, this.diffuse);
            GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, 500, 500, 0, GL.RGBA, GL.UNSIGNED_BYTE, this.diffuse_image);
            GL.generateMipmap(GL.TEXTURE_2D);
            // base settings, make it editable with textureoptions
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_LINEAR);
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
        };
        this.diffuse_image.src = './Assets/container_diffuse.png';

        this.specular_image = new Image();
        this.specular_image.onload = () => {
            GL.bindTexture(GL.TEXTURE_2D, this.specular);
            GL.texImage2D(GL.TEXTURE_2D, 0, GL.RED, 500, 500, 0, GL.RED, GL.UNSIGNED_BYTE, this.specular_image);
            GL.generateMipmap(GL.TEXTURE_2D);
            // base settings, make it editable with textureoptions
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_LINEAR);
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
        };
        this.specular_image.src = './Assets/container_specular.png';
    }

    bind(shader: Shader) {
        const GL: WebGL2RenderingContext = Canvas.getGL();

        // bind textures
        GL.activeTexture(GL.TEXTURE0);
        GL.bindTexture(GL.TEXTURE_2D, this.diffuse);
        GL.uniform1i(shader.uniform_locations.mat_diffuse, 0);

        GL.activeTexture(GL.TEXTURE1);
        GL.bindTexture(GL.TEXTURE_2D, this.specular);
        GL.uniform1i(shader.uniform_locations.mat_specular, 1);

        GL.uniform1f(shader.uniform_locations.mat_shininess, this.shininess);
    }

}