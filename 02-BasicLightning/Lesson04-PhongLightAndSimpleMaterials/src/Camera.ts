import { Log } from './BaseStack/Log';
import { Mat4 } from './Math/Matrix/mat';
import { Vec3 } from './Math/Vector/vec';
import { getPerspectiveMatrix } from './Math/Matrix/perspective';
import { lookAtMatrix } from './Math/Matrix/lookAt';
import { radians } from './Math/radians';

export class Camera {
    protected projection_matrix: Mat4;
    protected view_matrix: Mat4;

    protected position: Vec3 = {x: 0.0, y: 1.5, z: -5.0};
    protected target: Vec3 = {x: 0.0, y: 0.0, z: 0.0};
    protected up: Vec3 = {x: 0, y: 1, z: 0};

    protected fovY: number = 60;
    protected aspect: number;
    protected zNear: number = 0.5;
    protected zFar: number = 100;

    constructor() {
        window.addEventListener('resize', () => {
            this.calculateWindowSize();
        });
        this.calculateWindowSize();
        Log.info('Camera', 'Created!')
        this.updateViewMatrix();
    }

    init() {
    }

    update(time: number) {

        const position: number = (time * 0.001) % (2 * Math.PI);

        this.position = {
            x: Math.sin(position) * 6,
            y: this.position.y,
            z: Math.cos(position) * 6
        };
        this.updateViewMatrix();
    }

    getViewMatrix(): Mat4 {
        return this.view_matrix;
    }

    getProjectionMatrix(): Mat4 {
        return this.projection_matrix;
    }

    getPosition(): Vec3 {
        return this.position;
    }

    getTarget(): Vec3 {
        return this.target;
    }

    protected updateProjectionMatrix() {
        this.projection_matrix = getPerspectiveMatrix(
            radians(this.fovY),
            this.aspect,
            this.zNear,
            this.zFar
        );
    }

    protected updateViewMatrix() {
        this.view_matrix = lookAtMatrix(
            this.position,
            this.target,
            this.up
        );
    }

    private screenHeight: number;
    private screenWidth: number;

    private calculateWindowSize() {
        const container: HTMLElement | null = document.getElementById('container');
        if (container !== null) {
            const newHeight = document.getElementById('container').clientHeight;
            const newWidth = document.getElementById('container').clientWidth;
            if (newWidth === undefined || newHeight === undefined) {
                Log.error('Camera', 'Height or Width of Container is undefined!')
            }
            this.screenHeight = newHeight;
            this.screenWidth = newWidth;
            this.aspect = this.screenWidth / this.screenHeight;
            this.updateProjectionMatrix();
        } else {
            setTimeout(() => this.calculateWindowSize(), 20)
        }
    }
}
