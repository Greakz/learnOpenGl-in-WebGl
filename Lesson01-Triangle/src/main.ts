/*
    MAIN.TS
    This file is the Entry point of our Application.
    We should set up some Stages here and create a StateManager with them.
    To Start the Application we simply call runStateManager() on the CanvasInstance
 */
// wait for dom to get loaded!
import { Canvas } from './BaseStack/Canvas';
import { Log } from './BaseStack/Log';

document.addEventListener('DOMContentLoaded', () => {

    Log.show_logs(true);

    Canvas.init();
    Canvas.setNewFps(60);
    Canvas.start(
        (time: number) => Log.info('MAIN', 'RUNNING UPDATE LOOP'),
        (GL: WebGL2RenderingContext) => {/* do nothing */}
    );
});
