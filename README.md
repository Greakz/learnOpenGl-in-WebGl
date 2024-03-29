# learnopengl.com in WebGl
ref: [LearnOpenGL.com](https://learnopengl.com)

Since I think the website learnopengl.com provides the best tutorials around learning OpenGL-/Shaderprogramming, I tried them out in WebGL, because I was personally interested in the mechanics of all these calculations and their theory. \
Of course, there may be some chapters, that solutions require too much performance on the CPU and since all the CPU-work-to-do will be done in JavaScript (written in TypeScript), not everything is possible in a medium complex scene!

## How To check out some lesson

To check out the lessons you need to clone this repository, navigate into any lessons folder and type:

```npm install``` \
```npm start```


## "Base Stack"

To use WebGl we will need a Canvas, therefore i will allways use these index.html, Canvas.ts and ShaderLoader.ts file in every Lesson!

```index.html```:
```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>learnopengl.com in WebGl</title>
        <style>
            body {margin: 0; padding: 0;}
            #canvas {height: 100%;width: 100%;}
            #container, #overlay {position: fixed;top: 0;left: 0;right: 0;bottom: 0;}
            #fps {position: absolute;}
        </style>
        <script src="app.js" type="text/javascript"></script>
    </head>
    <body>
        <div id="root" />
    </body>
</html>
  ```
  
 
  ```Canvas.ts```:
  ```Typescript
export abstract class Canvas {

    static getGL(): WebGl2RenderingContext {
        // Returns the WebGl2RenderingContext
    }

    static init() {
      // Initialised the Canvas on the Dom and creates an WebGl2RenderingContext
    }

    static setNewFps(newFps: number) {
        // adjust the framerate (take a divisor of 60 to match requestAnimationFrame)
    }

    static start(updateFunc: (time: number) => void,
                 renderFunc: (context: WebGl2RenderingContext) => void,) {
        // start the Application by calling start and supply the core functions of the application
    }
}
  ``` 
  ```ShaderLoader.ts```:
  ```Typescript

export abstract class ShaderLoader {
    static buildShader(id: string): WebGLProgram {
        // Loads a Shader and gives back the compiled Program
        /*
            This requires a specific layout in the shaders:
            
            //#VERTEX-SHADER#//
            #version...
            //#FRAGMENT-SHADER#//
            #versiono...
            
            So both shaders, vertex and fragment get defined in the same file.
            To make them parsable, we need to mark the start of a shader
            with the //#WHICH-SHADER#// line!
         */
    }
}
  ```

For debugging purposes, i created a custom LogClass \
  ```Log.ts```:
  ```Typescript
export abstract class Log {

    static show_logs(val: boolean) {
        // set the Value if logs should be printed on income (default = false)
    }

    static info(comp: string, message: any) {
       // push an information log
    }

    static warning(comp: string, message: any) {
       // push a warning
    }

    static error(comp: string, message: any) {
       // push an error
    }

    static printLog(index?: number) {
        // print the log with the given index or, if no index given, the latest log entry
    }
}
  ```
