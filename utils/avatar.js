import * as THREE from '/node_modules/three119/build/three.module.js'

export const skins = {
  STONE: 'stone',
  LAVA: 'lava',
  DISCO: 'disco'
}

const { STONE, LAVA, DISCO } = skins

/* LAVA */

const vertexShader = `
  uniform vec2 uvScale;
  varying vec2 vUv;

  void main()
  {
    vUv = uvScale * uv;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = `
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

const textureLoader = new THREE.TextureLoader()
export const uniforms = {
  'time': { value: 1.0 },
  'uvScale': { value: new THREE.Vector2(3.0, 1.0) },
  'texture1': { value: textureLoader.load('/assets/textures/lavacloud.png') },
  'texture2': { value: textureLoader.load('/assets/textures/lavatile.jpg') }
}
uniforms.texture1.value.wrapS = uniforms.texture1.value.wrapT = THREE.RepeatWrapping
uniforms.texture2.value.wrapS = uniforms.texture2.value.wrapT = THREE.RepeatWrapping

const createMaterial = skin => {
  if (skin == STONE) return new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load('/assets/textures/snow-512.jpg')
  })
  if (skin == LAVA) return new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader
  })
  return new THREE.MeshNormalMaterial({
    flatShading: THREE.FlatShading
  })
}

const chooseGeometry = skin => {
  if (skin == STONE) return THREE.DodecahedronGeometry
  if (skin == LAVA) return THREE.SphereGeometry
  if (skin == DISCO) return THREE.SphereGeometry
  return THREE.SphereGeometry
}

export function createAvatar({ skin = STONE, r = 1.2 } = {}) {
  const group = new THREE.Group()
  const Geometry = chooseGeometry(skin)
  const material = createMaterial(skin)

  const bodyGeo = new Geometry(r * .66)
  const body = new THREE.Mesh(bodyGeo, material)
  body.position.set(0, r, 0)
  group.add(body)

  const limbGeo = bodyGeo.clone().scale(.6, .6, .6)
  const rightHand = new THREE.Mesh(limbGeo, material)
  rightHand.position.set(-r, r, 0)
  rightHand.name = 'rightHand'
  group.add(rightHand)

  const leftHand = new THREE.Mesh(limbGeo, material)
  leftHand.position.set(r, r, 0)
  leftHand.name = 'leftHand'
  group.add(leftHand)

  const rightLeg = new THREE.Mesh(limbGeo, material)
  rightLeg.position.set(r / 2, r * .3, 0)
  rightLeg.name = 'rightLeg'
  group.add(rightLeg)

  const leftLeg = new THREE.Mesh(limbGeo, material)
  leftLeg.position.set(-r / 2, r * .3, 0)
  leftLeg.name = 'leftLeg'
  group.add(leftLeg)

  return group
}