import { Canvas } from './BaseStack/Canvas';
import { Shader } from './Shader';
import { Vec3 } from './BaseStack/Math/Vector/vec';
import { vec3ToF32 } from './BaseStack/Math/Vector/vecToF32';
import {ShadowShader} from "./ShadowShader";
import {Mat4} from "./BaseStack/Math/Matrix/mat";
import {getPerspectiveMatrix} from "./BaseStack/Math/Matrix/perspective";
import {radians} from "./BaseStack/Math/radians";
import {lookAtMatrix} from "./BaseStack/Math/Matrix/lookAt";
import {addVec3} from "./BaseStack/Math/Vector/add";
import {multiplyMatrices} from "./BaseStack/Math/Matrix/multiply";
import {mat4ToF32} from "./BaseStack/Math/Matrix/matTo";

const SHADOW_WIDTH: number = 1024;
const SHADOW_HEIGHT: number = 1024;
const NEAR_PLANE: number = 1.0;
const FAR_PLANE: number = 18.0;

export class PointLight {

    color: Vec3 = {x: 1.0, y: 1.0, z: 1.0};
    position: Vec3 = {x: -0.7, y: 2, z: -0.2};
    ambient: Vec3 = {x: 0.15, y: 0.15, z: 0.15};
    diffuse: Vec3 = {x: 0.9, y: 0.9, z: 0.9};
    specular: Vec3 = {x: 0.5, y: 0.5, z: 0.5};

    constant: number = 1;
    linear: number = 0.22;
    quadric: number = 0.20;


    bind(shader: Shader) {
        const GL = Canvas.getGL();

        GL.uniform3fv(shader.uniform_locations.point_color, vec3ToF32(this.color));
        GL.uniform3fv(shader.uniform_locations.point_position, vec3ToF32(this.position));
        GL.uniform3fv(shader.uniform_locations.point_ambient, vec3ToF32(this.ambient));
        GL.uniform3fv(shader.uniform_locations.point_diffuse, vec3ToF32(this.diffuse));
        GL.uniform3fv(shader.uniform_locations.point_specular, vec3ToF32(this.specular));
        GL.uniform3f(shader.uniform_locations.point_con_lin_quad, this.constant, this.linear, this.quadric);

        GL.activeTexture(GL.TEXTURE3);
        GL.bindTexture(GL.TEXTURE_CUBE_MAP, this.depthMap);
        GL.uniform1i(shader.uniform_locations.point_shadow_map, 3);

        GL.uniform1f(shader.uniform_locations.point_shadow_far_plane, FAR_PLANE)
    }

    light_space_matrix: Float32Array[] = [];

    depthMap: WebGLTexture;

    initShadowMap() {
        const aspect: number = SHADOW_WIDTH / SHADOW_HEIGHT;
        const perspectiveMatrix: Mat4 = getPerspectiveMatrix(radians(90), aspect, NEAR_PLANE, FAR_PLANE);
        const lookAtMatrixes: Mat4[] = [
            lookAtMatrix(this.position, addVec3(this.position, {x: 1.0, y: 0.0, z: 0.0}), {x: 0.0, y: -1.0, z: 0.0}),
            lookAtMatrix(this.position, addVec3(this.position, {x: -1.0, y: 0.0, z: 0.0}), {x: 0.0, y: -1.0, z: 0.0}),
            lookAtMatrix(this.position, addVec3(this.position, {x: 0.0, y: 1.0, z: 0.0}), {x: 0.0, y: 0.0, z: 1.0}),
            lookAtMatrix(this.position, addVec3(this.position, {x: 0.0, y: -1.0, z: 0.0}), {x: 0.0, y: 0.0, z: -1.0}),
            lookAtMatrix(this.position, addVec3(this.position, {x: 0.0, y: 0.0, z: 1.0}), {x: 0.0, y: -1.0, z: 0.0}),
            lookAtMatrix(this.position, addVec3(this.position, {x: 0.0, y: 0.0, z: -1.0}), {x: 0.0, y: -1.0, z: 0.0}),
        ];

        const GL = Canvas.getGL();

        this.depthMap = GL.createTexture();
        GL.bindTexture(GL.TEXTURE_CUBE_MAP,  this.depthMap);
        GL.enable(GL.DEPTH_TEST);

        for(let i = 0; i < 6; i++) {
            GL.texImage2D(GL.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, GL.RGB, SHADOW_WIDTH, SHADOW_HEIGHT, 0,
                GL.RGB, GL.UNSIGNED_BYTE, null);
            this.light_space_matrix[i] = mat4ToF32(multiplyMatrices(perspectiveMatrix, lookAtMatrixes[i]));
        }

        GL.texParameteri(GL.TEXTURE_CUBE_MAP, GL.TEXTURE_MIN_FILTER, GL.NEAREST);
        GL.texParameteri(GL.TEXTURE_CUBE_MAP, GL.TEXTURE_MAG_FILTER, GL.NEAREST);
        GL.texParameteri(GL.TEXTURE_CUBE_MAP, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
        GL.texParameteri(GL.TEXTURE_CUBE_MAP, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);

        GL.bindTexture(GL.TEXTURE_CUBE_MAP,  null);
    }

    shadowRenderPass(shadowShader: ShadowShader, drawScene: () => void) {
        const GL = Canvas.getGL();

        GL.useProgram(shadowShader.program);
        GL.viewport(0, 0, SHADOW_WIDTH, SHADOW_HEIGHT);

        GL.drawBuffers([GL.COLOR_ATTACHMENT0]);
        GL.clear(GL.DEPTH_BUFFER_BIT | GL.COLOR_BUFFER_BIT);
        GL.enable(GL.CULL_FACE);
        GL.cullFace(GL.FRONT);
        for(let i = 0; i < 6; i++) {
            //GL.clearColor(1.0, 1.0, 1.0, 1.0);
            //GL.clearColor(0.0, 0.0, 0.0, 1.0);
            // preparations
            GL.uniformMatrix4fv(shadowShader.uniform_locations.light_space_matrix, false, this.light_space_matrix[i]);
            GL.uniform1f(shadowShader.uniform_locations.far_plane, FAR_PLANE);
            GL.uniform3fv(shadowShader.uniform_locations.light_pos, vec3ToF32(this.position));
            GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_CUBE_MAP_POSITIVE_X + i, this.depthMap, 0);
            GL.clear(GL.DEPTH_BUFFER_BIT | GL.COLOR_BUFFER_BIT);
            // draw shadow scenes
            drawScene();
        }
    }

}