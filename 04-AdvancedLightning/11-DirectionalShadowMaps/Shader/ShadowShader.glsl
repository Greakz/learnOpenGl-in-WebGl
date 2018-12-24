//#VERTEX-SHADER#//
#version 300 es
in vec3 VertexPosition;

uniform mat4 model_matrix;
uniform mat4 light_space_matrix;

void main(void) {
    gl_Position = light_space_matrix * model_matrix * vec4(VertexPosition, 1.0);
}

//#FRAGMENT-SHADER#//
#version 300 es
precision mediump float;

out vec4 fragmentColor;

void main(void) {
    fragmentColor = vec4(vec3(gl_FragCoord.z), 1.0);
}