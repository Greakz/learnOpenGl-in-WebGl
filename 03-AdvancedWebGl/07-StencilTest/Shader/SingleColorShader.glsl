//#VERTEX-SHADER#//
#version 300 es
in vec3 VertexPosition;
in vec3 VertexNormal;
in vec2 VertexTexCoord;

uniform mat4 model_matrix;
uniform mat4 view_matrix;
uniform mat4 projection_matrix;

void main(void) {
    VertexNormal;
    VertexTexCoord;
    gl_Position = projection_matrix * view_matrix * model_matrix * vec4(VertexPosition, 1.0);
}

//#FRAGMENT-SHADER#//
#version 300 es
precision mediump float;
out vec4 fragmentColor;

void main(void) {
    fragmentColor = vec4(
        1.0,
        0.0,
        0.0,
        1.0
    );
}