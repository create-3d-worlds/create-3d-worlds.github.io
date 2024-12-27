// https://threejs.org/examples/webgl_shader_lava.html
import * as THREE from 'three'

const textureLoader = new THREE.TextureLoader()

const vertexShader = /* glsl */`
  uniform vec2 uvScale;
  varying vec2 vUv;

  void main()
  {
    vUv = uvScale * uv;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = /* glsl */`
  uniform float time;
  uniform float fogDensity;
  uniform vec3 fogColor;
  uniform sampler2D texture1;
  uniform sampler2D texture2;
  varying vec2 vUv;

  void main( void ) {
    vec2 position = - 1.0 + 2.0 * vUv;
    vec4 noise = texture2D( texture1, vUv );
    vec2 T1 = vUv + vec2( 1.5, - 1.5 ) * time * 0.02;
    vec2 T2 = vUv + vec2( - 0.5, 2.0 ) * time * 0.01;

    T1.x += noise.x * 2.0;
    T1.y += noise.y * 2.0;
    T2.x -= noise.y * 0.2;
    T2.y += noise.z * 0.2;

    float p = texture2D( texture1, T1 * 2.0 ).a;
    vec4 color = texture2D( texture2, T2 * 2.0 );
    vec4 temp = color * ( vec4( p, p, p, p ) * 2.0 ) + ( color * color - 0.1 );

    if( temp.r > 1.0 ) { temp.bg += clamp( temp.r - 2.0, 0.0, 100.0 ); }
    if( temp.g > 1.0 ) { temp.rb += temp.g - 1.0; }
    if( temp.b > 1.0 ) { temp.rg += temp.b - 1.0; }

    gl_FragColor = temp;
    float depth = gl_FragCoord.z / gl_FragCoord.w;
    const float LOG2 = 1.442695;
    float fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );
    fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );

    gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );
  }
`

export const uniforms = {
  time: { value: 1.0 },
  uvScale: { value: new THREE.Vector2(3.0, 1.0) },
  texture1: { value: textureLoader.load('/assets/textures/lavacloud.png') },
  texture2: { value: textureLoader.load('/assets/textures/lavatile.jpg') }
}
uniforms.texture1.value.wrapS = uniforms.texture1.value.wrapT = THREE.RepeatWrapping
uniforms.texture2.value.wrapS = uniforms.texture2.value.wrapT = THREE.RepeatWrapping

export const material = new THREE.ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader,
  side: THREE.DoubleSide,
})
