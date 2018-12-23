import { Vec3 } from './Math/Vector/vec';
import { Shader } from './Shader';
import { vec3ToF32 } from './Math/Vector/vecToF32';
import { Canvas } from './BaseStack/Canvas';

export class Material {

    ambient: Vec3;
    diffuse: Vec3;
    specular: Vec3;
    shininess: number;
    reflection: number;
    refraction: number;

    constructor(ambient: Vec3, diffuse: Vec3, specular: Vec3, shininess: number, reflection: number = 0.7, refraction: number = 0.2) {
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
        this.shininess = shininess;
        this.reflection = reflection;
        this.refraction = refraction;
    }

    bind(shader: Shader) {
        const GL: WebGL2RenderingContext = Canvas.getGL();
        GL.uniform3fv(shader.uniform_locations.mat_ambient, vec3ToF32(this.ambient));
        GL.uniform3fv(shader.uniform_locations.mat_diffuse, vec3ToF32(this.diffuse));
        GL.uniform3fv(shader.uniform_locations.mat_specular, vec3ToF32(this.specular));
        GL.uniform1f(shader.uniform_locations.mat_shininess, this.shininess);
        GL.uniform1f(shader.uniform_locations.mat_reflect, this.reflection);
        GL.uniform1f(shader.uniform_locations.mat_refract, this.refraction);
    }

}