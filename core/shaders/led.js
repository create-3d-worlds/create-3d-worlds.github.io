// https://threejs.org/examples/webgl_shader2.html
import * as THREE from 'three'

export const vertexShader = /* glsl */`
  varying vec2 vUv;

  void main()
  {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

    gl_Position = projectionMatrix * mvPosition;
  }
`

export const fragmentShader = /* glsl */`
  uniform float time;
  varying vec2 vUv;

  void main( void ) {
    vec2 position = vUv;

    float color = 0.0;
    color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
    color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
    color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
    color *= sin( time / 10.0 ) * 0.5;
    gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );
  }
`

const uniforms = {
  time: { value: 1.0 }
}

export const material = new THREE.ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader
})
