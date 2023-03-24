import * as THREE from 'three'

export const vertexShader = /* glsl */`
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    vNormal = normalMatrix * normal;
    vViewPosition = -mvPosition.xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`

export const fragmentShader = /* glsl */`
  uniform vec3 uMaterialColor;
  uniform vec3 uLightPos;
  uniform vec3 uLightColor;
  uniform float uLightness;

  varying vec3 vNormal;

  void main() {
    vec4 lightDirection = viewMatrix * vec4(uLightPos, 0.0);
    float diffuse = dot(normalize(vNormal), normalize(lightDirection.xyz));

    // shading steps
    float nSteps = 3.0;
    float step = sqrt(diffuse) * nSteps;
    step = (floor(step) + smoothstep(0.49, 0.50, fract(step))) / nSteps;
    float shade = step * step;

    gl_FragColor = vec4(uLightness * uMaterialColor * uLightColor * shade, 1.0);
  }
`

export const uniforms = {
  uLightPos:	{ type: 'v3', value: new THREE.Vector3(0, 100, 0) },
  uLightColor: { type: 'c', value: new THREE.Color(0xFFFFFF) },
  uMaterialColor: { type: 'c', value: new THREE.Color(0xFFFFFF) },
  uLightness: { type: 'f', value: 0.98 }
}

export const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader })