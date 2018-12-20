import { Vec3 } from '../Vector/vec';
import { subtractVec3 } from '../Vector/subtract';
import { normalizeVec3 } from '../Vector/normalize';
import { crossProductVec3 } from '../Vector/crossProduct';
import { scaleVec3 } from '../Vector/scale';
import { addVec3 } from '../Vector/add';

export interface Ray {
    position: Vec3;
    direction: Vec3;
}

function calculateMousePositionRay(screen_width: number,
                                   screen_height: number,
                                   mouse_screen_x: number,
                                   mouse_screen_y: number,
                                   cam_position: Vec3,
                                   cam_target: Vec3,
                                   cam_up_vec: Vec3,
                                   cam_fovY: number,
                                   cam_zNear: number,
                                   cam_aspect: number,): Ray {
    mouse_screen_y = (screen_height - mouse_screen_y);

    let mouse_x: number = mouse_screen_x - (screen_width / 2);
    let mouse_y: number = mouse_screen_y - (screen_height / 2);
    mouse_y /= (screen_height / 2);
    mouse_x /= (screen_width / 2);

    // vectors
    let view: Vec3 = subtractVec3(cam_target, cam_position);
    view = normalizeVec3(view);

    let horiz: Vec3 = crossProductVec3(view, cam_up_vec);
    horiz = normalizeVec3(horiz);

    let vert: Vec3 = crossProductVec3(horiz, view);
    vert = normalizeVec3(vert);

    let rad = cam_fovY * Math.PI / 180;
    let vLength = Math.tan(rad / 2) * cam_zNear;
    let hLength = vLength * cam_aspect;

    vert = scaleVec3(vert, vLength);
    horiz = scaleVec3(horiz, hLength);

    let positionToNearPlaneCenter: Vec3 = scaleVec3(view, cam_zNear);

    // mouse and vectors
    let yPosOnNearPlane: Vec3 = scaleVec3(vert, mouse_y);
    let xPosOnNearPlane: Vec3 = scaleVec3(horiz, mouse_x);
    let nearPlaneCenter: Vec3 = addVec3(
        cam_position,
        positionToNearPlaneCenter
    );
    let pos: Vec3 = addVec3(addVec3(nearPlaneCenter, xPosOnNearPlane), yPosOnNearPlane);
    let direction: Vec3 = subtractVec3(pos, cam_position);

    return {
        position: pos,
        direction: direction
    }

}