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
import { Triangle } from './Triangle';
import { TriangleIndexed } from './TriangleIndexed';

document.addEventListener('DOMContentLoaded', () => {

    Canvas.init();
    Canvas.setNewFps(60);
    Log.show_logs(true);
    Log.clear();

    const shader: Shader = new Shader();
    shader.create();

    const triangle: Triangle = new Triangle();
    triangle.initBuffer();

    const triangle2: TriangleIndexed = new TriangleIndexed();
    triangle2.initBuffer();

    Canvas.start(
        (time: number) => Log.info('MAIN', 'RUNNING UPDATE LOOP'),
        (GL: WebGL2RenderingContext) => {
            GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
            triangle.draw(shader);
            triangle2.draw(shader);
        }
    );
});
