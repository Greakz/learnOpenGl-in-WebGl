//#VERTEX-SHADER#//
#version 300 es
in vec3 VertexPosition;
in vec3 VertexNormal;

uniform mat4 model_matrix;
uniform mat4 view_matrix;
uniform mat4 projection_matrix;

out vec3 vSurfaceNormal;
out vec3 vSurfacePosition;

void main(void) {
    gl_Position = projection_matrix * view_matrix * model_matrix * vec4(VertexPosition, 1.0);
    vSurfaceNormal = vec3(model_matrix * vec4(VertexNormal, 1.0));
    vSurfacePosition = vec3(model_matrix * vec4(VertexPosition, 1.0));
}

//#FRAGMENT-SHADER#//
#version 300 es
precision mediump float;
in vec3 vSurfaceNormal;
in vec3 vSurfacePosition;

uniform vec3 mat_ambient;
uniform vec3 mat_diffuse;
uniform vec3 mat_specular;
uniform float mat_shininess;

uniform vec3 light_position;
uniform vec3 camera_position;

const vec3 light_color = vec3(1.0);

out vec4 fragmentColor;

void main(void) {

    // ambient light
    vec3 ambient_light_result = mat_ambient * light_color;
    // diffuse light
    vec3 surface_normal_unit = normalize(vSurfaceNormal);
    vec3 light_dir = normalize(light_position - vSurfacePosition);
    float diff_strength = max(dot(surface_normal_unit, light_dir), 0.0);
    vec3 diff_light_result = vec3(diff_strength) * mat_diffuse * light_color;
    // specular light
    vec3 view_dir = normalize(camera_position - vSurfacePosition);
    vec3 reflect_dir = reflect(-light_dir, surface_normal_unit);
    float spec_strenght = pow(max(dot(view_dir, reflect_dir), 0.0), mat_shininess);
    vec3 spec_light_result = mat_specular * vec3(spec_strenght) * light_color;

    fragmentColor = vec4(ambient_light_result + diff_light_result + spec_light_result, 1.0);
}