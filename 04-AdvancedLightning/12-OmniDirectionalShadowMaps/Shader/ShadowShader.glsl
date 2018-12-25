//#VERTEX-SHADER#//
#version 300 es
in vec3 VertexPosition;

uniform mat4 model_matrix;
uniform mat4 light_space_matrix;

uniform vec3 light_pos;
uniform float far_plane;

out vec3 vPosition;
out vec3 vLightPos;
out float vFarPlane;

void main(void) {
    vLightPos = light_pos;
    vFarPlane = far_plane;
    vPosition = vec3(model_matrix * vec4(VertexPosition, 1.0));
    gl_Position = light_space_matrix * vec4(vPosition, 1.0);
}

//#FRAGMENT-SHADER#//
#version 300 es
precision mediump float;
in vec3 vPosition;
in vec3 vLightPos;
in float vFarPlane;

out vec4 fragmentColor;

void main(void) {
    float distance = (length(vPosition - vLightPos) / vFarPlane);
    fragmentColor = vec4(vec3(distance), 1.0);
}