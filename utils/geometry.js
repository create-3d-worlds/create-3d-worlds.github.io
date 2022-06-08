import * as THREE from '/node_modules/three127/build/three.module.js'
import { randomInRange, randomNuance } from './helpers.js'

const loader = new THREE.TextureLoader()

/* BOXES */

export function createBox({ size = 1, file, bumpFile, color = randomNuance({ h: 0.1, s: 0.01, l: .75 }), zModifier = 1, yModifier = 1, xModifier = 1 } = {}) {
  const xSize = size * xModifier
  const ySize = size * yModifier
  const zSize = size * zModifier
  const geometry = new THREE.BoxBufferGeometry(xSize, ySize, zSize)
  const options = {
    map: file ? loader.load(`/assets/textures/${file}`) : null,
    color: !file ? color : null,
    bumpMap: bumpFile ? loader.load(`/assets/textures/${bumpFile}`) : null,
  }
  const material = new THREE.MeshPhongMaterial(options)
  const mesh = new THREE.Mesh(geometry, material)
  mesh.translateY(ySize / 2)
  mesh.updateMatrix()
  mesh.geometry.applyMatrix4(mesh.matrix)
  return mesh
}

export const createCrate = ({ size, file = 'crate.gif' } = {}) => createBox({ size, file })

export const createBumpBox = ({ size, file = 'bricks.jpg', bumpFile = 'gray-bricks.jpg' } = {}) =>
  createBox({ size, file, bumpFile })

/* FACTORIES */

export function createRandomBoxes({ n = 100, size = 5, mapSize = 50 } = {}) {
  const group = new THREE.Group()
  for (let i = 0; i < n; i++) {
    const color = randomNuance({ h: 0.1, s: 0.01, l: .75 })
    const x = randomInRange(-mapSize, mapSize), y = randomInRange(-5, mapSize * .5), z = randomInRange(-mapSize, mapSize)
    const box = createBox({ size, color })
    box.position.set(x, y, z)
    group.add(box)
  }
  return group
}

/* BARRELS */

export function createBarrel({ r = 40, height = 90, segments = 32 } = {}) {
  const geometry = new THREE.CylinderGeometry(r, r, height, segments)
  const material = new THREE.MeshBasicMaterial({ map: loader.load('/assets/textures/rust.jpg') })
  const cylinder = new THREE.Mesh(geometry, material)
  return cylinder
}

/* SPHERES */

export function createSphere({
  r = 1, widthSegments = 32, heightSegments = widthSegments, color = 0xff0000,
  castShadow = true, receiveShadow = true } = {}
) {
  const geometry = new THREE.SphereGeometry(r, widthSegments, heightSegments)
  const material = new THREE.MeshStandardMaterial({
    color,
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.receiveShadow = receiveShadow
  mesh.castShadow = castShadow
  return mesh
}

export function createBall({ r = 1 } = {}) {
  const geometry = new THREE.DodecahedronGeometry(r, 1)
  const material = new THREE.MeshStandardMaterial({
    color: 0xe5f2f2,
    flatShading: true
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.receiveShadow = mesh.castShadow = true
  return mesh
}

/* WORLD SPHERE */

export function createWorldSphere({ r = 26, widthSegments = 40, heightSegments = 40, distort = .5 } = {}) {
  const geometry = new THREE.SphereBufferGeometry(r, widthSegments, heightSegments)

  const { position } = geometry.attributes
  const vertex = new THREE.Vector3()
  for (let i = 0, l = position.count; i < l; i ++) {
    vertex.fromBufferAttribute(position, i)
    vertex.x += randomInRange(-distort, distort)
    vertex.z += randomInRange(-distort, distort)
    position.setXYZ(i, vertex.x, vertex.y, vertex.z)
  }

  const material = new THREE.MeshStandardMaterial({
    color: 0xfffafa,
    flatShading: true
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.receiveShadow = mesh.castShadow = false
  mesh.rotation.z = -Math.PI / 2
  return mesh
}

/* SKY SPHERE */

export function createSkySphere({ r = 4000, topColor = 0x0077ff, bottomColor = 0xffffff } = {}) {
  const vertexShader = `
  varying vec3 vWorldPosition;
  void main() {
    vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }`

  const fragmentShader = `
  uniform vec3 topColor;
  uniform vec3 bottomColor;
  uniform float offset;
  uniform float exponent;
  varying vec3 vWorldPosition;
  void main() {
    float h = normalize( vWorldPosition + offset ).y;
    gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );
  }`

  const uniforms = {
    'topColor': { value: new THREE.Color(topColor) },
    'bottomColor': { value: new THREE.Color(bottomColor) },
    'offset': { value: 33 },
    'exponent': { value: 0.6 }
  }
  const geometry = new THREE.SphereGeometry(r, 32, 15)
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    side: THREE.BackSide
  })
  return new THREE.Mesh(geometry, material)
}
