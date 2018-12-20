// error prevention
import { WebGL2RenderingContext } from '../WebGL2RenderingContext';
// Actual File
import { Log } from './Log';

// Canvas Storage!
var canvas_instance: HTMLCanvasElement;
var canvas_context: WebGL2RenderingContext;
var canvas_fps: number;
var canvas_interval: number;
var canvas_initialised: boolean;

var canvas_lastTime: number = (new Date()).getTime();
var canvas_measuredFps = 0;
var canvas_framesInThisSecond = 0;
var canvas_lastSeconds = (new Date()).getSeconds();
var canvas_seconds = (new Date()).getSeconds();

var canvas_loop_update_func: (time: number) => void;
var canvas_loop_render_func: (context: any) => void;

var canvas_mouse_x: number = 0;
var canvas_mouse_y: number = 0;
var canvas_mouse_left: boolean = false;
var canvas_mouse_right: boolean = false;

var canvas_height: number = 0;
var canvas_width: number = 0;

// Public methods
export abstract class Canvas {

    static getGL(): WebGL2RenderingContext {
        return canvas_context;
    }

    static init() {
        initDom();
        Canvas.setNewFps(60);
        canvas_instance = (document.querySelector('#canvas') as HTMLCanvasElement);
        canvas_context = canvas_instance.getContext('webgl2', {stencil: true}) as WebGL2RenderingContext;
        window.addEventListener('resize', () => adjustCanvasSize());
        adjustCanvasSize();
        registerMoveHandler();
        // Mouse.init();
        Log.info('Canvas', 'Initialised Successfully...');
        canvas_initialised = true;
        if (canvas_loop_update_func !== undefined && canvas_loop_render_func !== undefined) {
            loop();
        }
    }

    static setNewFps(newFps: number) {
        canvas_fps = newFps;
        canvas_interval = 1000 / canvas_fps;
    }

    static start(updateFunc: (time: number) => void,
                 renderFunc: (context: WebGL2RenderingContext) => void,) {
        canvas_loop_update_func = updateFunc;
        canvas_loop_render_func = renderFunc;
        if (canvas_initialised) {
            loop();
        }
    }

    static getMouseX(): number {
        return canvas_mouse_x;
    }

    static getMouseY(): number {
        return canvas_mouse_y;
    }

    static getScreenHeight(): number {
        return canvas_height;
    }

    static getScreenWidth(): number {
        return canvas_width;
    }

    static getMouseLeft(): boolean {
        return canvas_mouse_left;
    }

    static getMouseRight(): boolean {
        return canvas_mouse_right;
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

function registerMoveHandler() {
    const overlay: HTMLElement | null = document.getElementById('overlay');
    if (overlay === null) {
        Log.error('Mouse', 'Cant find overlay to track!')
    }
    overlay.addEventListener('mousemove', (e) => {
        canvas_mouse_x = e.clientX;
        canvas_mouse_y = e.clientY;
    });
    overlay.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
    overlay.addEventListener('mousedown', (e: any) => {
        let isRightMB;
        if ('which' in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
            isRightMB = e.which == 3;
        else if ('button' in e)  // IE, Opera
            isRightMB = e.button == 2;

        if (isRightMB) {
            canvas_mouse_right = true;
        } else {
            canvas_mouse_left = true;
        }
    });
    overlay.addEventListener('mouseup', (e: any) => {
        let isRightMB;
        if ('which' in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
            isRightMB = e.which == 3;
        else if ('button' in e)  // IE, Opera
            isRightMB = e.button == 2;

        if (isRightMB) {
            canvas_mouse_right = false;
        } else {
            canvas_mouse_left = false;
        }
    });
    overlay.addEventListener('mouseleave', (e: any) => {
        canvas_mouse_right = false;
        canvas_mouse_left = false;
    });
}

function adjustCanvasSize() {
    canvas_height = document.getElementById('container').clientHeight;
    canvas_width = document.getElementById('container').clientWidth;
    canvas_instance.height = canvas_height;
    (canvas_instance as any).width = canvas_width;
    canvas_context.viewport(0, 0, canvas_width, canvas_height);
}

function displayFps() {
    document.getElementById('fps').innerHTML = 'FPS:' + canvas_measuredFps.toString();
}