import * as THREE from 'three'

const vertexShader = /* glsl */`
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }
`

const fragmentShader = /* glsl */`
  uniform vec3 color1;
  uniform vec3 color2;
  varying vec2 vUv;

  void main() {
    gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
  }
`

const uniforms = {
  color1: { type: 'vec3', value: new THREE.Color(0xffffff) },
  color2: { type: 'vec3', value: new THREE.Color(0x0077ff) },
}

export const material = new THREE.ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader
})