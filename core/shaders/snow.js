// https://codepen.io/shubniggurath/pen/WgJZJo
import * as THREE from 'three'

const loader = new THREE.TextureLoader()

const map = await loader.loadAsync('/assets/images/noise.png')
map.wrapS = map.wrapT = THREE.RepeatWrapping

const vertexShader = /* glsl */`

  void main() {
    gl_Position = vec4( position, 1.0 );
  }
`

const fragmentShader = /* glsl */`
  #define PI 3.141592653589793
  #define TAU 6.28
  
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_time;
  uniform sampler2D u_noise;
  
  const float multiplier = 25.5;
  const float zoomSpeed = 10.;
  const int layers = 10;
  const int octaves = 5;

  #include <texture_noise>

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy);

    if (u_resolution.y < u_resolution.x) {
      uv /= u_resolution.y;
    } else {
      uv /= u_resolution.x;
    }

    float n = fbm((uv + vec2(sin(u_time*.1), u_time*.1)) * 2. - 2.);
    vec3 colour = vec3(0.);
    colour = n * mix(vec3(0., .5, 1.5), clamp(vec3(1., .5, .25)*2., 0., 1.), n);

    float opacity = 1.;
    float opacity_sum = 1.;

    for(int i = 1; i <= layers; i++) {
      colour += renderLayer(i, layers, uv, opacity, colour, n);
      opacity_sum += opacity;
    }
    colour /= opacity_sum;

    gl_FragColor = vec4(clamp(colour * 20., 0., 1.),1.0);
  }
`

const uniforms = {
  u_time: { type: 'f', value: 1.0 },
  u_resolution: { type: 'v2', value: new THREE.Vector2() },
  u_noise: { type: 't', value: map },
}

uniforms.u_resolution.value.x = window.innerWidth
uniforms.u_resolution.value.y = window.innerHeight

export const material = new THREE.ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader
})
