#version 450
#extension GL_ARB_separate_shader_objects : enable

layout (location = 0) in vec3 vertNormal;
layout (location = 1) in vec3 lightDir[3];
layout (location = 4) in vec3 eyeDir; 
layout (location = 5) in vec2 texCoords;

struct Light {
    vec4 position;
    vec4 diffuse;
};

layout (binding = 1) uniform GlobalLighting {
    Light lights[3];
} gLights;

layout (binding = 2) uniform sampler2D myTexture;

layout(location = 0) out vec4 fragColor;

void main() { 

    vec4 kTexture = texture(myTexture, texCoords);
    vec4 ka = kTexture;
    vec4 colorOutput = ka * 0.5;

    for(int i = 0; i < 3; i++){
        vec4 ks = gLights.lights[i].diffuse; 
        float diff = max(dot(vertNormal, lightDir[i]), 0.0);

        vec3 reflection = normalize(reflect(-lightDir[i], vertNormal));
        float spec = max(dot(eyeDir, reflection), 0.0);
        if(diff > 0.0){
            spec = pow(spec, 35); 
        }
        colorOutput += (diff * kTexture * gLights.lights[i].diffuse) + (spec * ks);
    }
    fragColor = colorOutput;    
}
    