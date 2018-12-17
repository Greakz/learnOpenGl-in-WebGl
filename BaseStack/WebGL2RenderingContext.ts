// This Is Just a mock to prevent the Canvas.ts file in the BaseStack folder from printing errors because
// there is no installed node_modules, with webgl2!
export interface WebGL2RenderingContext {
    viewport(x: number, y: number, width: number, height: number);
    createProgram();
    attachShader(program: any, shader: any)
    linkProgram(program: any)
    createShader(FRAGMENT_OR_VERTEX: number)
    shaderSource(shader: any, source: any)
    compileShader(shader: any)
    getShaderParameter(shader: any, parameter: any)
    getShaderInfoLog(shader: any)
    FRAGMENT_SHADER: number
    VERTEX_SHADER: number
    COMPILE_STATUS: number
}