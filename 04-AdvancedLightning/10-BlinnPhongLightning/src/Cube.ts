import { Canvas } from './BaseStack/Canvas';
import { Shader } from './Shader';
import { Transformation } from './Transformation';
import { Camera } from './Camera';
import { Material } from './Material';
import { mat4ToF32 } from './BaseStack/Math/Matrix/matTo';
import { Vec3 } from './BaseStack/Math/Vector/vec';
import { Ray } from './BaseStack/Math/Ray/Ray';
import { Intersection } from './BaseStack/Intersection';
import { Log } from './BaseStack/Log';

export class Cube {

    public transformation: Transformation = new Transformation();
    public material: Material = new Material(1);

    // positioned left on screen
    private vertex_positions: number[] = [
        // Position         // Normals          //Textures
        -0.5, -0.5, 0.5,    0.0, 0.0, 1.0,      0.0, 0.0,
        0.5,  -0.5, 0.5,    0.0, 0.0, 1.0,      1.0, 0.0,
        0.5, 0.5, 0.5,      0.0, 0.0, 1.0,      1.0, 1.0,
        -0.5, -0.5, 0.5,    0.0, 0.0, 1.0,      0.0, 0.0,
        0.5, 0.5, 0.5,      0.0, 0.0, 1.0,      1.0, 1.0,
        -0.5, 0.5, 0.5,     0.0, 0.0, 1.0,      0.0, 1.0,

        -0.5, -0.5, -0.5,   0.0, 0.0, -1.0,     0.0, 0.0,
        -0.5, 0.5, -0.5,    0.0, 0.0, -1.0,     1.0, 0.0,
        0.5, 0.5, -0.5,     0.0, 0.0, -1.0,     1.0, 1.0,
        -0.5, -0.5, -0.5,   0.0, 0.0, -1.0,     0.0, 0.0,
        0.5, 0.5, -0.5,     0.0, 0.0, -1.0,     1.0, 1.0,
        0.5, -0.5, -0.5,    0.0, 0.0, -1.0,     0.0, 1.0,

        -0.5, 0.5, -0.5,    0.0, 1.0, 0.0,      0.0, 0.0,
        -0.5, 0.5, 0.5,     0.0, 1.0, 0.0,      1.0, 0.0,
        0.5, 0.5, 0.5,      0.0, 1.0, 0.0,      1.0, 1.0,
        -0.5, 0.5, -0.5,    0.0, 1.0, 0.0,      0.0, 0.0,
        0.5, 0.5, 0.5,      0.0, 1.0, 0.0,      1.0, 1.0,
        0.5, 0.5, -0.5,     0.0, 1.0, 0.0,      0.0, 1.0,

        -0.5, -0.5, -0.5,   0.0, -1.0, 0.0,     0.0, 0.0,
        0.5, -0.5, -0.5,    0.0, -1.0, 0.0,     1.0, 0.0,
        0.5, -0.5, 0.5,     0.0, -1.0, 0.0,     1.0, 1.0,
        -0.5, -0.5, -0.5,   0.0, -1.0, 0.0,     0.0, 0.0,
        0.5, -0.5, 0.5,     0.0, -1.0, 0.0,     1.0, 1.0,
        -0.5, -0.5, 0.5,    0.0, -1.0, 0.0,     0.0, 1.0,

        0.5, -0.5, -0.5,    1.0, 0.0, 0.0,      0.0, 0.0,
        0.5, 0.5, -0.5,     1.0, 0.0, 0.0,      1.0, 0.0,
        0.5, 0.5, 0.5,      1.0, 0.0, 0.0,      1.0, 1.0,
        0.5, -0.5, -0.5,    1.0, 0.0, 0.0,      0.0, 0.0,
        0.5, 0.5, 0.5,      1.0, 0.0, 0.0,      1.0, 1.0,
        0.5, -0.5, 0.5,     1.0, 0.0, 0.0,      0.0, 1.0,

        -0.5, -0.5, -0.5,   -1.0, 0.0, 0.0,     0.0, 0.0,
        -0.5, -0.5, 0.5,    -1.0, 0.0, 0.0,     1.0, 0.0,
        -0.5, 0.5, 0.5,     -1.0, 0.0, 0.0,     1.0, 1.0,
        -0.5, -0.5, -0.5,   -1.0, 0.0, 0.0,     0.0, 0.0,
        -0.5, 0.5, 0.5,     -1.0, 0.0, 0.0,     1.0, 1.0,
        -0.5, 0.5, -0.5,    -1.0, 0.0, 0.0,     0.0, 1.0
    ];

    private vertex_position_buffer: WebGLBuffer;

    initBuffer() {
        const GL: WebGL2RenderingContext = Canvas.getGL();
        this.material.init();
        this.vertex_position_buffer = GL.createBuffer();
        GL.bindBuffer(GL.ARRAY_BUFFER, this.vertex_position_buffer);
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(this.vertex_positions), GL.STATIC_DRAW);
        GL.bindBuffer(GL.ARRAY_BUFFER, null);
    }

    update(time: number) {}

    draw(shader: Shader, camera: Camera) {
        const GL: WebGL2RenderingContext = Canvas.getGL();
        GL.useProgram(shader.program);

        GL.bindBuffer(GL.ARRAY_BUFFER, this.vertex_position_buffer);
        GL.vertexAttribPointer(shader.attribute_locations.vertex_position, 3, GL.FLOAT, false, 8 * 4, 0);
        GL.enableVertexAttribArray(shader.attribute_locations.vertex_position);

        GL.vertexAttribPointer(shader.attribute_locations.vertex_normal, 3, GL.FLOAT, false, 8 * 4, 3 * 4);
        GL.enableVertexAttribArray(shader.attribute_locations.vertex_normal);

        GL.vertexAttribPointer(shader.attribute_locations.vertex_tex_coord, 2, GL.FLOAT, false, 8 * 4, 6 * 4);
        GL.enableVertexAttribArray(shader.attribute_locations.vertex_tex_coord);
        GL.bindBuffer(GL.ARRAY_BUFFER, null);

        this.material.bind(shader);

        const model_matrix: Float32Array = mat4ToF32(this.transformation.getMatrix());
        GL.uniformMatrix4fv(shader.uniform_locations.model_matrix, false, model_matrix);

        const view_matrix: Float32Array = mat4ToF32(camera.getViewMatrix());
        GL.uniformMatrix4fv(shader.uniform_locations.view_matrix, false, view_matrix);

        const projection_matrix: Float32Array = mat4ToF32(camera.getProjectionMatrix());
        GL.uniformMatrix4fv(shader.uniform_locations.projection_matrix, false, projection_matrix);

        GL.drawArrays(GL.TRIANGLES, 0, 36);
    }

    private hitbox_vertices: number[] = [
        // Position
        -0.5, -0.5, 0.5,
        0.5,  -0.5, 0.5,
        0.5, 0.5, 0.5,
        -0.5, -0.5, 0.5,
        0.5, 0.5, 0.5,
        -0.5, 0.5, 0.5,

        -0.5, -0.5, -0.5,
        -0.5, 0.5, -0.5,
        0.5, 0.5, -0.5,
        -0.5, -0.5, -0.5,
        0.5, 0.5, -0.5,
        0.5, -0.5, -0.5,

        -0.5, 0.5, -0.5,
        -0.5, 0.5, 0.5,
        0.5, 0.5, 0.5,
        -0.5, 0.5, -0.5,
        0.5, 0.5, 0.5,
        0.5, 0.5, -0.5,

        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5,
        0.5, -0.5, 0.5,
        -0.5, -0.5, -0.5,
        0.5, -0.5, 0.5,
        -0.5, -0.5, 0.5,

        0.5, -0.5, -0.5,
        0.5, 0.5, -0.5,
        0.5, 0.5, 0.5,
        0.5, -0.5, -0.5,
        0.5, 0.5, 0.5,
        0.5, -0.5, 0.5,

        -0.5, -0.5, -0.5,
        -0.5, -0.5, 0.5,
        -0.5, 0.5, 0.5,
        -0.5, -0.5, -0.5,
        -0.5, 0.5, 0.5,
        -0.5, 0.5, -0.5,
    ];

    checkRayHit(ray: Ray, cam_pos: Vec3): null | Vec3 {
        let result = Intersection.check(
            ray,
            this.transformation.getMatrix(),
            cam_pos,
            this.hitbox_vertices
        )
        if(result !== null) {
            this.material.add_color = {x: 0.1, y: 0.1, z: 0.0};
        } else {
            this.material.add_color = {x: 0.0, y: 0.0, z: 0.0};
        }
        return result;
    }
}