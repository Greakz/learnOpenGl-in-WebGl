import { Vec3 } from './Math/Vector/vec';
import { Shader } from './Shader';
import { vec3ToF32 } from './Math/Vector/vecToF32';
import { Canvas } from './BaseStack/Canvas';

export class Material {

    ambient: Vec3;
    diffuse: Vec3;
    specular: Vec3;
    shininess: number;
    reflect: number;

    constructor(ambient: Vec3, diffuse: Vec3, specular: Vec3, shininess: number, reflect: number = 0.7) {
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
        this.shininess = shininess;
        this.reflect = reflect;
    }

    bind(shader: Shader) {
        const GL: WebGL2RenderingContext = Canvas.getGL();
        GL.uniform3fv(shader.uniform_locations.mat_ambient, vec3ToF32(this.ambient));
        GL.uniform3fv(shader.uniform_locations.mat_diffuse, vec3ToF32(this.diffuse));
        GL.uniform3fv(shader.uniform_locations.mat_specular, vec3ToF32(this.specular));
        GL.uniform1f(shader.uniform_locations.mat_shininess, this.shininess);
        GL.uniform1f(shader.uniform_locations.mat_reflect, this.reflect);
    }

}