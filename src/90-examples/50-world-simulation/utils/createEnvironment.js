import * as THREE from '/node_modules/three127/build/three.module.js'
import { randomNuance, getTexture } from '/utils/helpers.js'
import { SimplexNoise } from '/libs/SimplexNoise.js'

// import chroma from '/libs/chroma.js'
// const greens = [0xA0522D, 0x2d4c1e, 0x228b22, 0x33aa33]
// const f = chroma.scale(greens).domain([-factorZ * .75, factorZ * .75])
// const nuance = new THREE.Color(f(vertex.z).hex())

const noise = new SimplexNoise()

const createWater = ({ size = 1200, color = 0x6699ff, segments = 20 } = {}) => {
  const material = new THREE.MeshLambertMaterial({ color, opacity: 0.75, vertexColors: THREE.FaceColors })
  const geometry = new THREE.PlaneGeometry(size, size, segments, segments)
  geometry.dynamic = true
  geometry.verticesNeedUpdate = true

  const colors = []
  for (let i = 0, l = geometry.attributes.position.count; i < l; i ++) {
    const nuance = randomNuance(color)
    colors.push(nuance.r, nuance.g, nuance.b)
  }
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

  const water = new THREE.Mesh(geometry, material)
  water.receiveShadow = true
  water.name = 'water'
  water.rotateX(-Math.PI / 2)
  return water
}

function createHillyTerrain(
  { color = 0x33aa33, size = 1200, segments = 20, factorX = 50, factorY = 25, factorZ = 60, file } = {}
) {
  const material = new THREE.MeshLambertMaterial({
    color: !file ? color : null,
    vertexColors: THREE.FaceColors,
    map: file ? getTexture({ file, repeat: 16 }) : null
  })
  const geometry = new THREE.PlaneGeometry(size, size, segments, segments)

  const { position } = geometry.attributes
  const vertex = new THREE.Vector3()

  for (let i = 0, l = position.count; i < l; i ++) {
    vertex.fromBufferAttribute(position, i)
    const dist = noise.noise(vertex.x / segments / factorX, vertex.y / segments / factorY)
    vertex.z = (dist - .25) * factorZ
    position.setXYZ(i, vertex.x, vertex.y, vertex.z)
  }

  const colors = []
  for (let i = 0, l = position.count; i < l; i ++) {
    const nuance = randomNuance(color)
    colors.push(nuance.r, nuance.g, nuance.b)
  }
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

  const land = new THREE.Mesh(geometry, material)
  land.receiveShadow = true
  land.name = 'land'
  land.rotateX(-Math.PI / 2)
  land.position.y = factorY * 1.2
  return land
}

export function createEnvironment({ color = 0x33aa33, size = 1200, segments = 20 } = {}) {
  const land = createHillyTerrain({ color, size, segments })
  const group = new THREE.Object3D()
  group.name = 'terrain'
  group.add(land)
  group.add(createWater({ size, segments }))
  group.receiveShadow = true
  return group
}