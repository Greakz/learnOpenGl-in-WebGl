import { Canvas } from './BaseStack/Canvas';
import { Shader } from './Shader';
import { Vec3 } from './BaseStack/Math/Vector/vec';
import { radians } from './BaseStack/Math/radians';
import { vec3ToF32 } from './BaseStack/Math/Vector/vecToF32';

export class SpotLight {

    color: Vec3 = {x: 1.0, y: 1.0, z: 1.0};
    position: Vec3 = {x: 2.5, y: 1.5, z: 0};
    direction: Vec3 = {x: -0.25, y: -1, z: 0};
    ambient: Vec3 = {x: 0.15, y: 0.15, z: 0.15};
    diffuse: Vec3 = {x: 0.9, y: 0.9, z: 0.9};
    specular: Vec3 = {x: 0.5, y: 0.5, z: 0.5};
    cutoff_inner: number = Math.cos(radians(18));
    cutoff_outer: number = Math.cos(radians(25));
    constant: number = 1;
    linear: number = 0.22;
    quadric: number = 0.2;

    bind(shader: Shader) {
        const GL = Canvas.getGL();

        GL.uniform3fv(shader.uniform_locations.spot_color, vec3ToF32(this.color));
        GL.uniform3fv(shader.uniform_locations.spot_position, vec3ToF32(this.position));
        GL.uniform3fv(shader.uniform_locations.spot_direction, vec3ToF32(this.direction));
        GL.uniform3fv(shader.uniform_locations.spot_ambient, vec3ToF32(this.ambient));
        GL.uniform3fv(shader.uniform_locations.spot_diffuse, vec3ToF32(this.diffuse));
        GL.uniform3fv(shader.uniform_locations.spot_specular, vec3ToF32(this.specular));
        GL.uniform3f(shader.uniform_locations.spot_con_lin_quad, this.constant, this.linear, this.quadric);
        GL.uniform2f(shader.uniform_locations.spot_cutoff, this.cutoff_inner, this.cutoff_outer);
    }
}