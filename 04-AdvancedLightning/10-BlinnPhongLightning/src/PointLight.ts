import { Canvas } from './BaseStack/Canvas';
import { Shader } from './Shader';
import { Vec3 } from './BaseStack/Math/Vector/vec';
import { vec3ToF32 } from './BaseStack/Math/Vector/vecToF32';

export class PointLight {

    color: Vec3 = {x: 1.0, y: 1.0, z: 1.0};
    position: Vec3 = {x: -0.7, y: 0.7, z: -0.2};
    ambient: Vec3 = {x: 0.15, y: 0.15, z: 0.15};
    diffuse: Vec3 = {x: 0.9, y: 0.9, z: 0.9};
    specular: Vec3 = {x: 0.5, y: 0.5, z: 0.5};

    constant: number = 1;
    linear: number = 0.35;
    quadric: number = 0.44;


    bind(shader: Shader) {
        const GL = Canvas.getGL();

        GL.uniform3fv(shader.uniform_locations.point_color, vec3ToF32(this.color));
        GL.uniform3fv(shader.uniform_locations.point_position, vec3ToF32(this.position));
        GL.uniform3fv(shader.uniform_locations.point_ambient, vec3ToF32(this.ambient));
        GL.uniform3fv(shader.uniform_locations.point_diffuse, vec3ToF32(this.diffuse));
        GL.uniform3fv(shader.uniform_locations.point_specular, vec3ToF32(this.specular));
        GL.uniform3f(shader.uniform_locations.point_con_lin_quad, this.constant, this.linear, this.quadric);
    }
}