import * as THREE from 'three'

const vertexShader = /* glsl */`
  varying vec2 vUv;

  void main() {	
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`
const fragmentShader = /* glsl */`
  #define PI 3.141592653589
  #define PI2 6.28318530718

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform sampler2D u_texture;

  varying vec2 vUv;

  void main (void) {
    vec2 p = vUv * 2.0 - 1.0;
    float len = length(p);
    vec2 ripple = vUv + p / len * 0.03 * cos(len * 12.0 - u_time * 4.0);
    float delta = (sin(u_time) + 1.0) / 2.0;
    vec2 uv = mix(ripple, vUv, delta);
    vec3 color = texture2D(u_texture, uv).rgb;

    gl_FragColor = vec4(color, 1.0); 
  }
`

export const uniforms = {
  u_texture: { value: new THREE.TextureLoader().load('/assets/textures/water512.jpg') },
  u_time: { value: 0.0 },
  u_resolution: { value: { x: window.innerWidth, y: window.innerHeight } }
}

export const material = new THREE.ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader
})
