//#VERTEX-SHADER#//
#version 300 es
in vec3 VertexPosition;
in vec3 VertexNormal;
in vec2 VertexTexCoord;

uniform mat4 model_matrix;
uniform mat4 view_matrix;
uniform mat4 projection_matrix;

out vec3 vSurfaceNormal;
out vec3 vSurfacePosition;
out vec2 vVertexTexCoord;

void main(void) {
    gl_Position = projection_matrix * view_matrix * model_matrix * vec4(VertexPosition, 1.0);
    vSurfaceNormal = vec3(model_matrix * vec4(VertexNormal, 0.0));
    vSurfacePosition = vec3(model_matrix * vec4(VertexPosition, 1.0));
    vVertexTexCoord = VertexTexCoord;
}

//#FRAGMENT-SHADER#//
#version 300 es
precision mediump float;
in vec3 vSurfaceNormal;
in vec3 vSurfacePosition;
in vec2 vVertexTexCoord;

uniform sampler2D mat_diffuse;
uniform sampler2D mat_specular;
uniform float mat_shininess;

//ambient
uniform vec3 amb_color;

// dir_light
uniform vec3 dir_color;
uniform vec3 dir_direction;
uniform vec3 dir_ambient;
uniform vec3 dir_diffuse;
uniform vec3 dir_specular;

//pointlight
uniform vec3 point_color;
uniform vec3 point_position;
uniform vec3 point_ambient;
uniform vec3 point_diffuse;
uniform vec3 point_specular;
uniform vec3 point_con_lin_quad;

uniform vec3 camera_position;

const vec3 light_color = vec3(1.0);

out vec4 fragmentColor;

vec3 calculateDiffuseLight(vec3 surface_normal_unit, vec3 mat_diff, vec3 light_dir_unit, vec3 light_color, vec3 light_diffuse) {
    float diff_strength = max(dot(surface_normal_unit, light_dir_unit), 0.0);
    return vec3(diff_strength) * light_diffuse * light_color * mat_diff;
}

vec3 calculateSpecularLight(vec3 surface_normal_unit, vec3 mat_spec, vec3 view_dir, vec3 light_dir_unit, vec3 light_color, vec3 light_specular) {
    vec3 reflect_dir = reflect(-light_dir_unit, surface_normal_unit);
    float spec_strenght = pow(max(dot(view_dir, reflect_dir), 0.0), mat_shininess);
    return vec3(spec_strenght) * light_specular * light_color * mat_spec;
}

void main(void) {

    vec3 current_mat_diffuse = vec3(texture(mat_diffuse, vVertexTexCoord));
    vec3 current_mat_specular = vec3(texture(mat_specular, vVertexTexCoord));
    vec3 surface_normal_unit = normalize(vSurfaceNormal);
    vec3 view_direction = normalize(camera_position - vSurfacePosition);

    // ambient light
    vec3 ambient_light_result = amb_color * current_mat_diffuse;

    // dir light
    vec3 dir_light_dir_unit = normalize(-dir_direction);
    vec3 dir_diff_light_res = calculateDiffuseLight(surface_normal_unit, current_mat_diffuse, dir_light_dir_unit, dir_color, dir_diffuse);
    vec3 dir_spec_light_res = calculateSpecularLight(surface_normal_unit, current_mat_specular, view_direction, dir_light_dir_unit, dir_color, dir_specular);

    // point light
    vec3 point_light_dir_unit = normalize(point_position - vSurfacePosition);
    float distance    = length(point_position - vSurfacePosition);
    float attenuation = 1.0 / (point_con_lin_quad.x + point_con_lin_quad.y * distance + point_con_lin_quad.z * (distance * distance));
    vec3 point_diff_light_res = calculateDiffuseLight(surface_normal_unit, current_mat_diffuse, point_light_dir_unit, point_color, point_diffuse) * vec3(attenuation);
    vec3 point_spec_light_res = calculateSpecularLight(surface_normal_unit, vec3(1.0), view_direction, point_light_dir_unit, point_color, point_specular) * vec3(attenuation);

    vec3 diff_light_result = dir_diff_light_res + point_diff_light_res;
    vec3 spec_light_result = dir_spec_light_res + point_spec_light_res;

    fragmentColor = vec4(ambient_light_result + diff_light_result + spec_light_result, 1.0);
}