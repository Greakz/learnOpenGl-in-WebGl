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
import { DirectionalLight } from './DirectionalLight';
import { PointLight } from './PointLight';
import { SpotLight } from './SpotLight';

document.addEventListener('DOMContentLoaded', () => {

    Canvas.init();
    Canvas.setNewFps(60);
    Log.show_logs(true);
    Log.clear();

    const camera: Camera = new Camera();

    const shader: Shader = new Shader();
    shader.create();

    const cube: Cube = new Cube();
    const cube2: Cube = new Cube();
    const cube3: Cube = new Cube();
    const cube4: Cube = new Cube();
    const cube4_size: number = 5;
    cube.initBuffer();
    cube2.initBuffer();
    cube3.initBuffer();
    cube4.initBuffer();

    cube2.transformation.moveX(-1.5);
    cube3.transformation.moveX(1.5);
    cube4.transformation.scale(cube4_size);
    cube4.transformation.moveY(-((cube4_size / 2) + 1));

    const ambientLight: Vec3 = {x: 0.1, y: 0.1, z: 0.1};

    const directionalLight: DirectionalLight = new DirectionalLight();


    const pointLight: PointLight = new PointLight();
    const pointLightCube: Cube = new Cube();
    pointLightCube.initBuffer();
    pointLightCube.transformation.scale(0.1).moveX(pointLight.position.x).moveY(pointLight.position.y).moveZ(pointLight.position.z);

    const spotLight: SpotLight = new SpotLight();
    const spotLightCube: Cube = new Cube();
    spotLightCube.initBuffer();
    spotLightCube.transformation.scale(0.1).moveX(spotLight.position.x).moveY(spotLight.position.y).moveZ(spotLight.position.z);

    Canvas.start(
        (time: number) => {
            camera.update(time);
            cube.transformation.rotateX(-1);
            cube2.transformation.rotateZ(-0.7);
            cube3.transformation.rotateY(-1.9);
        },
        (GL: WebGL2RenderingContext) => {
            GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
            GL.enable(GL.DEPTH_TEST);
            GL.clearColor(0.2, 0.2, 0.2, 1.0);

            GL.useProgram(shader.program);

            GL.uniform3fv(shader.uniform_locations.amb_color, vec3ToF32(ambientLight));

            directionalLight.bind(shader);

            pointLight.bind(shader);

            spotLight.bind(shader);

            GL.uniform3fv(shader.uniform_locations.camera_position, vec3ToF32(camera.getPosition()));

            pointLightCube.draw(shader, camera);
            spotLightCube.draw(shader, camera);

            cube.draw(shader, camera);
            cube2.draw(shader, camera);
            cube3.draw(shader, camera);

            cube4.draw(shader, camera);
        }
    );
});
