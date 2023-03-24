// https://codepen.io/nik-lever/pen/gEoaez
import THREE from '/libs/shader-includes.js'

const vertexShader = /* glsl */`
  varying vec3 v_position;

  void main() {
    v_position = position;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`
const fragmentShader = /* glsl */`
  varying vec3 v_position;
  #include <noise>

  void main(){
    vec2 p = v_position.xy;
    float scale = 800.0;
    
    p *= scale;

    float d = perlin(p.x, p.y) * scale; 
    float u = p.x + d;
    float v = p.y + d;
    d = perlin(u, v) * scale;
    float noise = perlin(p.x + d, p.y + d);

    vec3 color = vec3(0.6 * (vec3(2.0 * noise) - vec3(noise * 0.1, noise * 0.2 - sin(u / 30.0) * 0.1, noise * 0.3 + sin(v / 40.0) * 0.2))); 
    gl_FragColor = vec4(color, 1.0);
  }
`

export const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader
})
