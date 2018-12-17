# learnopengl.com in WebGl

Since i think the website learnopengl.com provides the best tutorials around learning OpenGL-/Shaderprogramming, i tried them out in WebGl, because i was personally intrested in the mechanics of all these calculations and theire theory. \
Ofcourse, there may be some chapters, that solutions require to much performance on the CPU and since all the CPU-work-to-to will be done in JavaScript (written in TypeScript), not everything is possible in a medium complex scene!

## Repeatable files

To use WebGl we will need a Canvas, therefore i will allways use the same index.html file and the same entrypoint, precompiled by WebPack! \

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
    body {margin: 0, padding: 0;}
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
  
 
  ```canvas.ts```:
  ```Typescript
    ...comming soon
  ```
