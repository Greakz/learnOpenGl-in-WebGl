/*
    Texture Shaders
    ===============
    Vertex-Shader Source
*/
//#VERTEX-SHADER#//
#version 300 es
in vec3 vertexPosition;
out vec4 vColor;

uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;
uniform vec4 color;


void main(void) {
    gl_Position = projectionMatrix * modelMatrix * vec4(vertexPosition, 1.0);
    vColor = color;
}
/*
Fragment-Shader Source
*/
//#FRAGMENT-SHADER#//
#version 300 es
precision mediump float;
in vec4 vColor;
out vec4 fragmentColor;

void main(void) {
    fragmentColor = vColor;
}