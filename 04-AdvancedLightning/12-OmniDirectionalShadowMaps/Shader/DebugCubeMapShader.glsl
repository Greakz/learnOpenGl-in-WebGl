//#VERTEX-SHADER#//
#version 300 es
in vec3 VertexPosition;

uniform mat4 model_matrix;
uniform mat4 view_matrix;
uniform mat4 projection_matrix;

out vec3 vTexCoords;

void main(void) {
    gl_Position = projection_matrix * view_matrix * model_matrix * vec4(VertexPosition, 1.0);
    vTexCoords = VertexPosition;
}

//#FRAGMENT-SHADER#//
#version 300 es
precision mediump float;
in vec3 vTexCoords;

uniform samplerCube debug_sample;

out vec4 fragmentColor;

void main(void) {
    fragmentColor = texture(debug_sample, vTexCoords);
}