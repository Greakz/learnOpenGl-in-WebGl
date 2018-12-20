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
import { vec3ToF32 } from './BaseStack/Math/Vector/vecToF32';

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
    cube.initBuffer();
    cube2.initBuffer();
    cube3.initBuffer();

    cube2.transformation.moveX(-1.5);
    cube3.transformation.moveX(1.5);

    const directionalLight: DirectionalLight = new DirectionalLight();

    const GL = Canvas.getGL();
    /*
        FRAMEBUFFER
     */
    var fb = GL.createFramebuffer();
    GL.bindFramebuffer(GL.FRAMEBUFFER, fb);

    /*
        TARGET TEXTURE
     */
    var tex = GL.createTexture();
    GL.bindTexture(GL.TEXTURE_2D, tex);
    GL.texImage2D(GL.TEXTURE_2D,0, GL.RGB, 512, 512, 0, GL.RGB, GL.UNSIGNED_BYTE, null);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
    GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, tex, 0);

    var render_buffer: WebGLRenderbuffer = GL.createRenderbuffer();
    GL.bindRenderbuffer(GL.RENDERBUFFER, render_buffer);
    GL.renderbufferStorage(GL.RENDERBUFFER, GL.DEPTH24_STENCIL8, 512, 512);
    GL.framebufferRenderbuffer(GL.FRAMEBUFFER, GL.DEPTH_STENCIL_ATTACHMENT, GL.RENDERBUFFER, render_buffer);

    Canvas.start(
        (time: number) => {
            camera.update(time);

            const screenRay = camera.getRay();

            cube.transformation.rotateX(-1);
            cube2.transformation.rotateZ(-0.7);
            cube3.transformation.rotateY(-1.9);

            let res1 = cube.checkRayHit(screenRay, camera.getPosition());
            let res2 = cube2.checkRayHit(screenRay, camera.getPosition());
            let res3 = cube3.checkRayHit(screenRay, camera.getPosition());

        },
        (GL: WebGL2RenderingContext) => {
            GL.useProgram(shader.program);
            GL.bindFramebuffer(GL.FRAMEBUFFER, fb);
            GL.viewport(0,0,512,512);
            GL.clearColor(1, 1, 1, 1.0);
            GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
            GL.enable(GL.DEPTH_TEST);
            GL.depthFunc(GL.LESS);


            directionalLight.bind(shader);
            GL.uniform3fv(shader.uniform_locations.camera_position, vec3ToF32(camera.getPosition()));

            cube.draw(shader, camera);
            cube2.draw(shader, camera);
            cube3.draw(shader, camera);

            GL.bindFramebuffer(GL.FRAMEBUFFER, null);
            GL.bindTexture(GL.TEXTURE_2D, tex);
            GL.viewport(0,0,Canvas.getScreenWidth(),Canvas.getScreenHeight());
            GL.enable(GL.DEPTH_TEST);

            GL.clearColor(0.2, 0.2, 0.2, 1.0);
            GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

            cube.draw(shader, camera, tex);
            cube2.draw(shader, camera, tex);
            cube3.draw(shader, camera);

        }
    );
});
