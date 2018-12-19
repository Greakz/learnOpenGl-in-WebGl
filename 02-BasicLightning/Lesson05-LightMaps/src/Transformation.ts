import { Vec3 } from './Math/Vector/vec';
import { Mat4 } from './Math/Matrix/mat';
import { multiplyArrayOfMatrices } from './Math/Matrix/multiply';
import { getTranslationMatrix } from './Math/Matrix/translation';
import { getScalingMatrix } from './Math/Matrix/scaling';
import { getRotationXMatrix, getRotationYMatrix, getRotationZMatrix } from './Math/Matrix/rotation';
import { radians } from './Math/radians';
import { scaleVec3 } from './Math/Vector/scale';

export class Transformation {

    static zeroVec() {return {x: 0, y: 0, z: 0}}
    static oneVec() {return {x: 1, y: 1, z: 1}}

    private translation: Vec3;
    private rotation: Vec3;
    private scaling: Vec3;

    constructor() {
        this.translation = Transformation.zeroVec();
        this.rotation = Transformation.zeroVec();
        this.scaling = Transformation.oneVec();
    }

    getMatrix(): Mat4 {
        return multiplyArrayOfMatrices([
            getTranslationMatrix(this.translation.x, this.translation.y, this.translation.z),
            getRotationZMatrix(radians(this.rotation.z)),
            getRotationXMatrix(radians(this.rotation.x)),
            getRotationYMatrix(radians(this.rotation.y)),
            getScalingMatrix(this.scaling.x, this.scaling.y, this.scaling.z),
        ])
    }

    moveX(offset: number) {this.translation.x += offset; return this;}
    moveY(offset: number) {this.translation.y += offset; return this;}
    moveZ(offset: number) {this.translation.z += offset; return this;}

    rotateX(degree: number) {this.rotation.x = (this.rotation.x + degree) % 360; return this;}
    rotateY(degree: number) {this.rotation.y = (this.rotation.y + degree) % 360; return this;}
    rotateZ(degree: number) {this.rotation.z = (this.rotation.z + degree) % 360; return this;}

    scaleX(scale: number) {this.scaling.x *= scale; return this;}
    scaleY(scale: number) {this.scaling.y *= scale; return this;}
    scaleZ(scale: number) {this.scaling.y *= scale; return this;}
    scale(scale: number) {this.scaling = scaleVec3(this.scaling, scale); return this;}

    setTranslation(t: Vec3) {this.translation = t; return this;}
    getTranslation(): Vec3 {return this.translation}
    setRotation(r: Vec3) {this.rotation = r; return this;}
    getRotation(): Vec3 {return this.rotation}
    setScaling(s: Vec3) {this.scaling = s; return this;}
    getScaling(): Vec3 {return this.scaling}
}