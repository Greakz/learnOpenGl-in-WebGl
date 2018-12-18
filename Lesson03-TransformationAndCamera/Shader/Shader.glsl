//#VERTEX-SHADER#//
#version 300 es
in vec3 VertexPosition;
in vec4 VertexColor;

uniform mat4 model_matrix;
uniform mat4 view_matrix;
uniform mat4 projection_matrix;


out vec4 vColor;

void main(void) {
    gl_Position = projection_matrix * view_matrix * model_matrix * vec4(VertexPosition, 1.0);
    vColor = VertexColor;
}

//#FRAGMENT-SHADER#//
#version 300 es
precision mediump float;
in vec4 vColor;

out vec4 fragmentColor;

void main(void) {
    fragmentColor = vColor;
}