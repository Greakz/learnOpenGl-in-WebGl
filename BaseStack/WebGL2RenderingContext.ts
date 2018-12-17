// This Is Just a mock to prevent the Canvas.ts file in the BaseStack folder from printing errors because
// there is no installed node_modules, with webgl2!
export interface WebGL2RenderingContext {
    viewport(x: number, y: number, width: number, height: number);
}