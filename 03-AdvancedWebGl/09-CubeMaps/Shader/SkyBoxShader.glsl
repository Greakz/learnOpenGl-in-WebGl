//#VERTEX-SHADER#//
#version 300 es
layout (location = 0) in vec3 VertexPosition;

uniform mat4 model_matrix;
uniform mat4 view_matrix;
uniform mat4 projection_matrix;

out vec3 vTexCoords;

void main(void) {
    vTexCoords = VertexPosition;
    vec4 pos = projection_matrix * view_matrix * model_matrix * vec4(VertexPosition, 1.0);
    gl_Position = pos.xyww;
}

//#FRAGMENT-SHADER#//
#version 300 es
precision mediump float;
in vec3 vTexCoords;

uniform samplerCube skybox;

out vec4 fragmentColor;

void main(void) {
    fragmentColor = texture(skybox, vTexCoords);
}