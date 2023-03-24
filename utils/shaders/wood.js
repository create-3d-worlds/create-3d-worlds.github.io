// https://github.com/NikLever/GLSLfromScratch
import THREE from '/libs/shader-includes.js'

export const vertexShader = /* glsl */`
  uniform float u_scale;
  varying vec3 vPosition;

  void main() {
    vPosition = normalize(position) * u_scale;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }
`

export const fragmentShader = /* glsl */`
  #include <noise>

  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_frequency;
  uniform float u_noiseScale;
  uniform float u_ringScale;

  varying vec3 vPosition;

  void main() {
    float n = snoise(vPosition);
    float ring = fract(u_frequency * vPosition.z + u_noiseScale * n);
    ring *= 4.0 * (1.0 - ring);

    // Adjust ring smoothness and shape, and add some noise
    float lrp = pow(ring, u_ringScale) + n;
    vec3 base = mix(u_color1, u_color2, lrp);
    gl_FragColor = vec4(base, 1.0);
  }
`

const uniforms = {
  u_scale: { type: 'f', value: 1.0 },
  u_frequency: { type: 'f', value: 7.6 },
  u_noiseScale: { type: 'f', value: 6.4 },
  u_ringScale: { type: 'f', value: 0.6 },
  u_color1: { type: 'c', value: new THREE.Color(0x7d490b) },
  u_color2: { type: 'c', value: new THREE.Color(0xbb905d) }
}

export const material = new THREE.ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader
})
