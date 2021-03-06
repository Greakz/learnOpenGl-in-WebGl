//#VERTEX-SHADER#//
#version 300 es
in vec3 VertexPosition;
in vec2 TextureCoordinate;

uniform vec4 color;

out vec4 vColor;
out vec2 vTextureCoordinate;


void main(void) {
    gl_Position = vec4(VertexPosition, 1.0);
    vColor = color;
    vTextureCoordinate = TextureCoordinate;
}
//#FRAGMENT-SHADER#//
#version 300 es
precision mediump float;
in vec4 vColor;
in vec2 vTextureCoordinate;

uniform sampler2D SomeTexture;
uniform sampler2D SomeTexture2;

out vec4 fragmentColor;

void main(void) {
    fragmentColor = vColor * (texture(SomeTexture, vTextureCoordinate) + texture(SomeTexture2, vTextureCoordinate));
}