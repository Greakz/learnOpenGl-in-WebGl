import { Canvas } from './BaseStack/Canvas';
import { Shader } from './Shader';
import { Vec3 } from './BaseStack/Math/Vector/vec';
import { vec3ToF32 } from './BaseStack/Math/Vector/vecToF32';

export class DirectionalLight {

    color: Vec3 = {x: 1.0, y: 1.0, z: 1.0};
    direction: Vec3 = {x: -0.5, y: -1, z: -0.5};
    ambient: Vec3 = {x: 0.15, y: 0.15, z: 0.15};
    diffuse: Vec3 = {x: 0.3, y: 0.3, z: 0.3};
    specular: Vec3 = {x: 0.25, y: 0.25, z: 0.25};

    bind(shader: Shader) {
        const GL = Canvas.getGL();

        GL.uniform3fv(shader.uniform_locations.dir_color, vec3ToF32(this.color));
        GL.uniform3fv(shader.uniform_locations.dir_direction, vec3ToF32(this.direction));
        GL.uniform3fv(shader.uniform_locations.dir_ambient, vec3ToF32(this.ambient));
        GL.uniform3fv(shader.uniform_locations.dir_diffuse, vec3ToF32(this.diffuse));
        GL.uniform3fv(shader.uniform_locations.dir_specular, vec3ToF32(this.specular));
    }
}