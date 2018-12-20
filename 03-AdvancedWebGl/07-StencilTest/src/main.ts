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
import { DirectionalLight } from './DirectionalLight';
import { PointLight } from './PointLight';
import { SpotLight } from './SpotLight';
import { Vec3 } from './BaseStack/Math/Vector/vec';
import { vec3ToF32 } from './BaseStack/Math/Vector/vecToF32';
import { SingleColorShader } from './SingleColorShader';

document.addEventListener('DOMContentLoaded', () => {

    Canvas.init();
    Canvas.setNewFps(60);
    Log.show_logs(true);
    Log.clear();

    const camera: Camera = new Camera();

    const shader: Shader = new Shader();
    shader.create();
    const singleColorShader: SingleColorShader = new SingleColorShader();
    singleColorShader.create();

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

    const directionalLight: DirectionalLight = new DirectionalLight();

    const pointLight: PointLight = new PointLight();
    const pointLightCube: Cube = new Cube();
    pointLightCube.initBuffer();
    pointLightCube.transformation.scale(0.1).moveX(pointLight.position.x).moveY(pointLight.position.y).moveZ(pointLight.position.z);

    const spotLight: SpotLight = new SpotLight();
    const spotLightCube: Cube = new Cube();
    spotLightCube.initBuffer();
    spotLightCube.transformation.scale(0.1).moveX(spotLight.position.x).moveY(spotLight.position.y).moveZ(spotLight.position.z);

    var cube1_hovered: boolean = false;
    var cube2_hovered: boolean = false;
    var cube3_hovered: boolean = false;

    Canvas.start(
        (time: number) => {
            camera.update(time);

            const screenRay = camera.getRay();

            cube.transformation.rotateX(-1);
            cube2.transformation.rotateZ(-0.7);
            cube3.transformation.rotateY(-1.9);

            cube1_hovered = (cube.checkRayHit(screenRay, camera.getPosition()) !== null);
            cube2_hovered = (cube2.checkRayHit(screenRay, camera.getPosition()) !== null);
            cube3_hovered = (cube3.checkRayHit(screenRay, camera.getPosition()) !== null);

        },
        (GL: WebGL2RenderingContext) => {
            GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT | GL.STENCIL_BUFFER_BIT);
            GL.clearColor(0.2, 0.2, 0.2, 1.0);
            GL.colorMask(true, true, true, true);
            GL.enable(GL.DEPTH_TEST);

            GL.useProgram(shader.program);

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



            // STENCIL_PREPERATIONS
            // Replacing the values at the stencil buffer to 1 on every pixel we draw
            GL.enable(GL.STENCIL_TEST);
            GL.stencilOp(GL.REPLACE, GL.REPLACE, GL.REPLACE);
            GL.stencilFunc(GL.ALWAYS, 1, 0xFF);
            // GL.stencilMask(0xFF);
            // GL.stencilOp(GL.KEEP, GL.KEEP, GL.REPLACE);
            GL.colorMask(false, false, false, false);

            if(cube1_hovered) {
                cube.draw(shader, camera);
            }
            if(cube2_hovered) {
                cube2.draw(shader, camera);
            }
            if(cube3_hovered) {
                cube3.draw(shader, camera);
            }

            // Second pass: Draw slightly increased versions
            GL.stencilFunc(GL.NOTEQUAL, 1, 0xFF);
            GL.stencilOp(GL.KEEP, GL.KEEP, GL.KEEP);
            // GL.stencilMask(0x00);
            // GL.stencilOp(GL.KEEP, GL.KEEP, GL.KEEP);
            GL.disable(GL.DEPTH_TEST);

            let originalScaling1 = cube.transformation.getScaling();
            let originalScaling2 = cube2.transformation.getScaling();
            let originalScaling3 = cube3.transformation.getScaling();
            cube.transformation.scale(1.05);
            cube2.transformation.scale(1.05);
            cube3.transformation.scale(1.05);
            GL.colorMask(true, true, true, true);

            if(cube1_hovered) {
                cube.drawSingleColor(singleColorShader, camera);
            }
            if(cube2_hovered) {
                cube2.drawSingleColor(singleColorShader, camera);
            }
            if(cube3_hovered) {
                cube3.drawSingleColor(singleColorShader, camera);
            }

            cube.transformation.setScaling(originalScaling1);
            cube2.transformation.setScaling(originalScaling2);
            cube3.transformation.setScaling(originalScaling3);


            // DRAW ACTUAL SCENE



        }
    );
});
