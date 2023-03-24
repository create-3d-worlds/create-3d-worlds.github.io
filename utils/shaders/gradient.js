import * as THREE from 'three'

const fragmentShader = /* glsl */`
  uniform vec2 resolution; // uniform variables must be declared here
  uniform vec3 color1;
  uniform vec3 color2;

  void main() {
    vec2 coord = gl_FragCoord.xy / resolution.xy; // normalize coordinates
    vec3 rgb = mix( color2, color1, coord.y );
    gl_FragColor = vec4( rgb, 1.0 );
  }
`

const uniforms = {
  color1: { value: new THREE.Color(0x0077ff) },
  color2: { value: new THREE.Color(0xffffff) },
  resolution: { type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
}

export const material = new THREE.ShaderMaterial({ uniforms, fragmentShader })