import {Canvas} from './BaseStack/Canvas';
import {Shader} from './Shader';
import {Vec3} from './BaseStack/Math/Vector/vec';
import {vec3ToF32} from './BaseStack/Math/Vector/vecToF32';
import {getOrthographicMatrix} from "./BaseStack/Math/Matrix/orthographic";
import {mat4ToF32} from "./BaseStack/Math/Matrix/matTo";
import {normalizeVec3} from "./BaseStack/Math/Vector/normalize";
import {multiplyMatrices} from "./BaseStack/Math/Matrix/multiply";
import {ShadowShader} from "./ShadowShader";
import {lookAtMatrix} from "./BaseStack/Math/Matrix/lookAt";
import {scaleVec3} from "./BaseStack/Math/Vector/scale";

const SHADOW_WIDTH: number = 1024;
const SHADOW_HEIGHT: number = 1024;

export class DirectionalLight {

    color: Vec3 = {x: 1.0, y: 1.0, z: 1.0};
    direction: Vec3 = {x: -0.5, y: -1, z: -0.5};
    ambient: Vec3 = {x: 0.3, y: 0.3, z: 0.3};
    diffuse: Vec3 = {x: 0.6, y: 0.6, z: 0.6};
    specular: Vec3 = {x: 0.25, y: 0.25, z: 0.25};

    bind(shader: Shader) {
        const GL = Canvas.getGL();

        GL.activeTexture(GL.TEXTURE2);
        GL.bindTexture(GL.TEXTURE_2D, this.depthMap);
        GL.uniform1i(shader.uniform_locations.dir_shadow_map, 2);

        GL.uniform3fv(shader.uniform_locations.dir_color, vec3ToF32(this.color));
        GL.uniform3fv(shader.uniform_locations.dir_direction, vec3ToF32(this.direction));
        GL.uniform3fv(shader.uniform_locations.dir_ambient, vec3ToF32(this.ambient));
        GL.uniform3fv(shader.uniform_locations.dir_diffuse, vec3ToF32(this.diffuse));
        GL.uniform3fv(shader.uniform_locations.dir_specular, vec3ToF32(this.specular));

        GL.uniformMatrix4fv(shader.uniform_locations.dir_light_space_matrix, false, this.light_space_matrix);
    }

    light_space_matrix: Float32Array;
    depthMap: WebGLTexture;

    initShadowMap() {
        const GL = Canvas.getGL();

        let light_projection_matrix = getOrthographicMatrix(-10.0, 10.0, -10.0, 10.0, 1, 32.0);
        let light_pos_norm = normalizeVec3(this.direction);
        let look_at = lookAtMatrix(scaleVec3(light_pos_norm, -5), {x: 0, y: 0, z: 0}, {x: 0, y: 1.0, z: 0});
        this.light_space_matrix = mat4ToF32(multiplyMatrices(light_projection_matrix, look_at));

        this.depthMap = GL.createTexture();
        GL.bindTexture(GL.TEXTURE_2D,  this.depthMap);
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGB, 1024, 1024, 0,
            GL.RGB, GL.UNSIGNED_BYTE, null);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
        GL.bindTexture(GL.TEXTURE_2D,  null);

    }

    prepareShadowRenderPass(shadowShader: ShadowShader) {
        const GL = Canvas.getGL();

        //GL.bindFramebuffer(GL.FRAMEBUFFER, depthMapFBO); this should happen for all sshadow calcs one time
        GL.useProgram(shadowShader.program);

        GL.viewport(0, 0, SHADOW_WIDTH, SHADOW_HEIGHT);
        // preparations
        GL.uniformMatrix4fv(shadowShader.uniform_locations.light_space_matrix, false, this.light_space_matrix);
        GL.bindTexture(GL.TEXTURE_2D, this.depthMap);
        GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, this.depthMap, 0);
        GL.bindTexture(GL.TEXTURE_2D, null);

        // console.log(GL.checkFramebufferStatus(GL.FRAMEBUFFER))


        // GL.bindFramebuffer(GL.FRAMEBUFFER, 0);
    }
}