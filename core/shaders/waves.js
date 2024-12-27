// https://codepen.io/Sanjeet-Nishad/full/oNZgGjw
import THREE from '/libs/shader-includes.js'

const vertexShader = /* glsl */`
  #include <noise>

  uniform float uTime;
  uniform float uBigWavesElevation;
  uniform vec2 uBigWavesFrequency;
  uniform float uBigWaveSpeed;

  uniform  float uSmallWavesElevation;
  uniform  float uSmallWavesFrequency;
  uniform  float uSmallWavesSpeed;
  uniform float uSmallWavesIterations;

  varying float vElevation;

  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float elevation = sin(modelPosition.x * uBigWavesFrequency.x + uTime * uBigWaveSpeed) 
      * sin(modelPosition.z * uBigWavesFrequency.y + uTime * uBigWaveSpeed) 
      * uBigWavesElevation;
    
    for(float i = 1.0; i <= uSmallWavesIterations; i++) {
      elevation -= cnoise(vec3(modelPosition.xz * uSmallWavesFrequency * i, uTime * uSmallWavesSpeed)) * uSmallWavesElevation / i;
    }
    
    modelPosition.y += elevation;
    vElevation = elevation;
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
  }
`

const fragmentShader = /* glsl */`
  precision mediump float;

  uniform vec3 uDepthColor;
  uniform vec3 uSurfaceColor;
  uniform float uColorOffset;
  uniform float uColorMultiplier;

  varying float vElevation;

  void main() {
    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);

    gl_FragColor = vec4(color, 1.0);
  }
`

const uniforms = {
  uTime: { value: 0 },
  uBigWavesElevation: { value: 0.2 },
  uBigWavesFrequency: { value: new THREE.Vector2(4, 2) },
  uBigWaveSpeed: { value: 0.75 },

  uSmallWavesElevation: { value: 0.15 },
  uSmallWavesFrequency: { value: 3.0 },
  uSmallWavesSpeed: { value: 0.3 },
  uSmallWavesIterations: { value: 4 },

  uDepthColor: { value: new THREE.Color('#1e4d40') },
  uSurfaceColor: { value: new THREE.Color('#4d9aaa') },
  uColorOffset: { value: 0.08 },
  uColorMultiplier: { value: 5 },
}

export const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms
})
