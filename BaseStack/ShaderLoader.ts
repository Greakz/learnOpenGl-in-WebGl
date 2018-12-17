// remove, only error prevention
import { WebGL2RenderingContext } from './WebGL2RenderingContext';
// actual file
import { Canvas } from './Canvas';
import { Log } from './Log';

export abstract class ShaderLoader {
    static buildShader(id: string): WebGLProgram {
        let rawFile = new XMLHttpRequest();
        rawFile.open(
            'GET',
            '/Shader/' + id + '.glsl',
            false
        );
        let shader: WebGLProgram;
        Log.info('ShaderLoader', 'Read in Shader: ' + id + '.glsl');
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                if (rawFile.status === 200 || rawFile.status == 0) {
                    let allText = rawFile.responseText;

                    shader = ShaderLoaderUtil.parseShader(id, allText);

                } else {
                    Log.error('ShaderLoader', 'Could not load Shader into Dom: ' + id)
                }
            } else {
                Log.error('ShaderLoader', 'Could not load Shader into Dom: ' + id)
            }
        };
        rawFile.send(null);
        return shader;
    }
}


abstract class ShaderLoaderUtil {

    static parseShader(id: string,
                       source: string): WebGLProgram {
        let vertexParsed = source.split('//#VERTEX-SHADER#//');
        let vertexSource = vertexParsed[1];
        let fragSource = '';
        let fragParsed = vertexSource.split('//#FRAGMENT-SHADER#//');
        if (fragParsed.length > 1) {
            vertexSource = fragParsed[0];
            fragSource = fragParsed[1];
        } else {
            fragParsed = vertexParsed[0].split('//#FRAGMENT-SHADER#//');
            fragSource = fragParsed[1];
        }
        fragSource = ShaderLoaderUtil.killEmptyLines(fragSource);
        vertexSource = ShaderLoaderUtil.killEmptyLines(vertexSource);
        const vs = ShaderLoaderUtil.buildVertexShaderWithSource(id, vertexSource);
        const fs = ShaderLoaderUtil.buildFragmentShaderWithSource(id, fragSource);
        const compiledProgram = ShaderLoaderUtil.buildShaderProgram(id, vs, fs);
        return compiledProgram
    }

    static killEmptyLines(value: string): string {
        const parts = value.split('\n');
        let result: string = '';
        for(let i = 0; i < parts.length; i++) {
            if(parts[i].trim() !== '') {
                result += parts[i] + '\n';
            }
        }
        return result;
    }

    static buildShaderProgram(id: string, vs_shader: WebGLShader, fs_shader: WebGLShader): WebGLProgram {
        const gl = Canvas.getGL();

        let shaderProgram: WebGLProgram = gl.createProgram();
        if (shaderProgram !== null) {
            const compiledProgram = shaderProgram;
            gl.attachShader(compiledProgram, vs_shader);
            gl.attachShader(compiledProgram, fs_shader);
            gl.linkProgram(compiledProgram);
            return compiledProgram;
        } else {
            Log.error('ShaderLoader', 'Could not create WebGl-Program: ' + id + '.glsl');
        }
    }

    static buildFragmentShaderWithSource(id: string, source: string): WebGLShader {
        const gl = Canvas.getGL();
        let shader: WebGLShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            Log.error('ShaderLoader', 'Error while compiling Fragment-Shader: ' + id + '.glsl');
            Log.error('ShaderLoader', gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }

    static buildVertexShaderWithSource(id: string, source: string): WebGLShader {
        const gl = Canvas.getGL();
        let shader: WebGLShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            Log.error('ShaderLoader', 'Error while compiling Vertex-Shader: ' + id + '.glsl');
            Log.error('ShaderLoader', gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }
}