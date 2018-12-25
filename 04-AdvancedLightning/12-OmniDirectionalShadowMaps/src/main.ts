/*
    MAIN.TS
    This file is the Entry point of our Application.
    We should set up some Stages here and create a StateManager with them.
    To Start the Application we simply call runStateManager() on the CanvasInstance
 */
// wait for dom to get loaded!
import {Canvas} from './BaseStack/Canvas';
import {Log} from './BaseStack/Log';
import {Shader} from './Shader';
import {Cube} from './Cube';
import {Camera} from './Camera';
import {DirectionalLight} from './DirectionalLight';
import {PointLight} from './PointLight';
import {SpotLight} from './SpotLight';
import {Vec3} from './BaseStack/Math/Vector/vec';
import {vec3ToF32} from './BaseStack/Math/Vector/vecToF32';
import {ShadowShader} from "./ShadowShader";
import {DebugTextureShader} from "./DebugTextureShader";
import {debug} from "util";
import {DebugCubeMapShader} from "./DebugCubeMapShader";

document.addEventListener('DOMContentLoaded', () => {
    Log.show_logs(true);
    Log.clear();
    Canvas.init();
    Canvas.setNewFps(60);


    const camera: Camera = new Camera();

    const shader: Shader = new Shader();
    shader.create();
    const shadowShader: ShadowShader = new ShadowShader();
    shadowShader.create();
    const debugShader: DebugTextureShader = new DebugTextureShader();
    debugShader.create();
    const debugCubeShader: DebugCubeMapShader = new DebugCubeMapShader();
    debugCubeShader.create();

    const cube: Cube = new Cube();
    const cube2: Cube = new Cube();
    const cube3: Cube = new Cube();
    const cube4: Cube = new Cube();
    const cube4_size: number = 15;
    cube.initBuffer();
    cube.transformation.moveY(-0.5);
    cube2.initBuffer();
    cube3.initBuffer();
    cube4.initBuffer();

    cube2.transformation.moveX(-1.5);
    cube3.transformation.moveX(1.5);
    cube4.transformation.scale(cube4_size);
    cube4.transformation.moveY(-((cube4_size / 2) + 1));

    const directionalLight: DirectionalLight = new DirectionalLight();
    directionalLight.initShadowMap();

    const pointLight: PointLight = new PointLight();
    const pointLightCube: Cube = new Cube();
    pointLightCube.initBuffer();
    pointLightCube.transformation.scale(0.1).moveX(pointLight.position.x).moveY(pointLight.position.y).moveZ(pointLight.position.z);
    pointLight.initShadowMap();

    const spotLight: SpotLight = new SpotLight();
    const spotLightCube: Cube = new Cube();
    spotLightCube.initBuffer();
    spotLightCube.transformation.scale(0.1).moveX(spotLight.position.x).moveY(spotLight.position.y).moveZ(spotLight.position.z);

    const GL = Canvas.getGL();
    const shadowMapFrameBuffer: WebGLFramebuffer = GL.createFramebuffer();

    // Step 3: Create and initialize a texture buffer to hold the depth values.
    // Note: the WEBGL_depth_texture extension is required for this to work
    //       and for the GL.DEPTH_COMPONENT texture format to be supported.
    const depth_renderbuffer = GL.createRenderbuffer();

    GL.bindRenderbuffer(GL.RENDERBUFFER, depth_renderbuffer);
    GL.renderbufferStorage(GL.RENDERBUFFER, GL.DEPTH_COMPONENT16, 1024, 1024);

    // Step 4: Attach the specific buffers to the frame buffer.
    GL.bindFramebuffer(GL.FRAMEBUFFER, shadowMapFrameBuffer);
    GL.framebufferRenderbuffer(GL.FRAMEBUFFER, GL.DEPTH_ATTACHMENT, GL.RENDERBUFFER, depth_renderbuffer);

    GL.bindTexture(GL.TEXTURE_2D, null);
    // GL.bindRenderbuffer(GL.RENDERBUFFER, null);
    GL.bindFramebuffer(GL.FRAMEBUFFER, null);

    const status = GL.checkFramebufferStatus(GL.FRAMEBUFFER);
    if (status !== GL.FRAMEBUFFER_COMPLETE) {
        Log.error('MAIN', "The created frame buffer is invalid: " + status.toString());
    }


    Canvas.start(
        (time: number) => {
            camera.update(time);

            const screenRay = camera.getRay();

            // cube.transformation.rotateX(-1);
            cube2.transformation.rotateZ(-0.7);
            cube3.transformation.rotateY(-1.9);

            let res1 = cube.checkRayHit(screenRay, camera.getPosition());
            let res2 = cube2.checkRayHit(screenRay, camera.getPosition());
            let res3 = cube3.checkRayHit(screenRay, camera.getPosition());

        },
        (GL: WebGL2RenderingContext) => {
            // DRAW SHADOW MAPS

            GL.bindFramebuffer(GL.FRAMEBUFFER, shadowMapFrameBuffer);
            GL.enable(GL.DEPTH_TEST);
            GL.depthFunc(GL.LESS);
            GL.viewport(0, 0, 1024, 1024);
            GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
            // GL.cullFace(GL.FRONT);


            directionalLight.prepareShadowRenderPass(shadowShader);

            cube.drawLightSpace(shadowShader);
            cube2.drawLightSpace(shadowShader);
            cube3.drawLightSpace(shadowShader);
            cube4.drawLightSpace(shadowShader);

            pointLight.shadowRenderPass(shadowShader, () => {
                cube.drawLightSpace(shadowShader);
                cube2.drawLightSpace(shadowShader);
                cube3.drawLightSpace(shadowShader);
                cube4.drawLightSpace(shadowShader);
            });


            GL.bindFramebuffer(GL.FRAMEBUFFER, null);
            GL.cullFace(GL.BACK);
            Canvas.viewportToScreen();

            // debugCubeShader.renderDebugSample(pointLight.depthMap);
            // DRAW SCENE

            GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
            GL.clearColor(0.2, 0.2, 0.2, 1.0);

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
            // */
        }
    );

});
