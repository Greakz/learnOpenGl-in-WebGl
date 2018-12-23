/*
    MAIN.TS
    This file is the Entry point of our Application.
    We should set up some Stages here and create a StateManager with them.
    To Start the Application we simply call runStateManager() on the CanvasInstance
 */
// wait for dom to get loaded!
import { Canvas } from './BaseStack/Canvas';
import { Log } from './BaseStack/Log';
import { Shader } from './Shader';
import { Cube } from './Cube';
import { Camera } from './Camera';
import { Vec3 } from './Math/Vector/vec';
import { vec3ToF32 } from './Math/Vector/vecToF32';
import {SkyBoxShader} from "./SkyBoxShader";
import {mat4ToF32} from "./Math/Matrix/matTo";
import {SkyBox} from "./SkyBox";

document.addEventListener('DOMContentLoaded', () => {

    Canvas.init();
    Canvas.setNewFps(60);
    Log.show_logs(true);
    Log.clear();

    const camera: Camera = new Camera();

    const shader: Shader = new Shader();
    shader.create();
    const skybox_shader: SkyBoxShader = new SkyBoxShader();
    skybox_shader.create();

    const skybox: SkyBox = new SkyBox();
    skybox.init();

    const cube: Cube = new Cube();
    cube.initBuffer();
    cube.transformation.moveX(-1.25);

    const cube2: Cube = new Cube();
    cube2.initBuffer();
    cube2.transformation.moveX(1.25);

    const lightPos: Vec3 = {x: 0.8, y: 0.75, z:0.8};
    const cube_at_light: Cube = new Cube();
    cube_at_light.initBuffer();
    cube_at_light.transformation.scale(0.2).moveX(lightPos.x).moveY(lightPos.y).moveZ(lightPos.z);

    Canvas.start(
        (time: number) => {
            camera.update(time);
            cube.update(time);
            cube2.update(time);
            cube.transformation.rotateZ(0.5);
            cube2.transformation.rotateX(0.3);
        },
        (GL: WebGL2RenderingContext) => {
            GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
            GL.enable(GL.DEPTH_TEST);
            GL.clearColor(0.2, 0.2, 0.2, 1.0);

            GL.useProgram(shader.program);

            skybox.bindCubeMapTexture(shader.uniform_locations.skybox);

            GL.uniform3fv(shader.uniform_locations.light_position, vec3ToF32(lightPos));
            GL.uniform3fv(shader.uniform_locations.camera_position, vec3ToF32(camera.getPosition()));

            cube.draw(shader, camera);
            cube2.draw(shader, camera);
            cube_at_light.draw(shader, camera);

            GL.useProgram(skybox_shader.program);
            GL.uniformMatrix4fv(skybox_shader.uniform_locations.view_matrix, false, mat4ToF32(camera.getViewMatrix()));
            GL.uniformMatrix4fv(skybox_shader.uniform_locations.projection_matrix, false, mat4ToF32(camera.getProjectionMatrix()));
            skybox.drawSkyBox(skybox_shader);
        }
    );
});
