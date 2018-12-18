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

document.addEventListener('DOMContentLoaded', () => {

    Canvas.init();
    Canvas.setNewFps(60);
    Log.show_logs(true);
    Log.clear();

    const camera: Camera = new Camera();

    const shader: Shader = new Shader();
    shader.create();

    const cube: Cube = new Cube();
    cube.initBuffer();


    Canvas.start(
        (time: number) => {
            camera.update(time);
            cube.update(time);
        },
        (GL: WebGL2RenderingContext) => {
            GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
            GL.enable(GL.DEPTH_TEST);
            GL.clearColor(0.2, 0.2, 0.2, 1.0);
            cube.draw(shader, camera);
        }
    );
});
