//#VERTEX-SHADER#//
#version 300 es
in vec2 VertexPosition;

out vec2 vTexCoords;

void main(void) {
    gl_Position = vec4(VertexPosition, 0.0, 1.0);
    vTexCoords = VertexPosition * vec2(0.5) + vec2(0.5);
}

//#FRAGMENT-SHADER#//
#version 300 es
precision mediump float;
in vec2 vTexCoords;

uniform sampler2D debug_sample;

out vec4 fragmentColor;

void main(void) {
    fragmentColor = texture(debug_sample, vTexCoords);
}