// Actual File
import { Log } from './Log';

// Canvas Storage!
var canvas_instance: HTMLCanvasElement;
var canvas_context: WebGL2RenderingContext;
var canvas_fps: number;
var canvas_interval: number;

var canvas_lastTime: number = (new Date()).getTime();
var canvas_measuredFps = 0;
var canvas_framesInThisSecond = 0;
var canvas_lastSeconds = (new Date()).getSeconds();
var canvas_seconds = (new Date()).getSeconds();

var canvas_loop_update_func: (time: number) => void;
var canvas_loop_render_func: (context: any) => void;

// Public methods
export abstract class Canvas {

    static getGL(): WebGL2RenderingContext {
        return canvas_context;
    }

    static init() {
        initDom();
        Canvas.setNewFps(60);
        canvas_instance = (document.querySelector('#canvas') as HTMLCanvasElement);
        canvas_context = canvas_instance.getContext('webgl2') as WebGL2RenderingContext;
        window.addEventListener('resize', () => adjustCanvasSize());
        adjustCanvasSize();
        // Mouse.init();
        Log.info('Canvas', 'Initialised Successfully...')
    }

    static setNewFps(newFps: number) {
        canvas_fps = newFps;
        canvas_interval = 1000 / canvas_fps;
    }

    static start(updateFunc: (time: number) => void,
                 renderFunc: (context: WebGL2RenderingContext) => void,) {
        canvas_loop_update_func = updateFunc;
        canvas_loop_render_func = renderFunc;
        loop();
    }
}

// private methods of our Canvas
function loop() {
    window.requestAnimationFrame(loop);
    let currentTime = (new Date()).getTime();
    let delta = (currentTime - canvas_lastTime);
    canvas_seconds = (new Date()).getSeconds();

    if (delta > canvas_interval) {

        // let the engine roll...!
        canvas_loop_update_func(currentTime);
        canvas_loop_render_func(canvas_context);


        if (canvas_lastSeconds === canvas_seconds) {
            canvas_framesInThisSecond++;
        } else {
            canvas_measuredFps = canvas_framesInThisSecond;
            canvas_framesInThisSecond = 1;
            canvas_lastSeconds = canvas_seconds;
            displayFps();
        }

        canvas_lastTime = currentTime - (delta % canvas_interval);
    }
}

function initDom() {
    const content: string = '<div id="container"><canvas id="canvas" /></div><div id="fps"></div><div id="overlay"></div>';
    const root: HTMLElement | null = document.getElementById('root');
    if (root === null) {
        Log.error('Canvas', 'Cant find root node!');
    } else {
        root.innerHTML = content;
    }
}

function adjustCanvasSize() {
    const newHeight = document.getElementById('container').clientHeight;
    const newWidth = document.getElementById('container').clientWidth;
    canvas_instance.height = newHeight;
    (canvas_instance as any).width = newWidth;
    canvas_context.viewport(0, 0, newWidth, newHeight);
}

function displayFps() {
    document.getElementById('fps').innerHTML = 'FPS:' + canvas_measuredFps.toString();
}