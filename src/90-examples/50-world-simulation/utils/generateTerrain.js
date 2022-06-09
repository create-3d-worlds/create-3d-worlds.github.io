import * as THREE from '/node_modules/three127/build/three.module.js'
import { randomNuance } from '/utils/helpers.js'
import SimplexNoise from '../libs/SimplexNoise.js'

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

function createLand({ color = 0x33aa33, size = 1200, segments = 20 } = {}) {
  const material = new THREE.MeshLambertMaterial({
    color,
    vertexColors: THREE.FaceColors
  })
  const geometry = new THREE.PlaneGeometry(size, size, segments, segments)
  geometry.dynamic = true
  geometry.verticesNeedUpdate = true

  const noise = new SimplexNoise()
  let n

  const factorX = 50
  const factorY = 25
  const factorZ = 60

  const { position } = geometry.attributes
  const vertex = new THREE.Vector3()

  for (let i = 0, l = position.count; i < l; i ++) {
    vertex.fromBufferAttribute(position, i)
    n = noise.noise(vertex.x / segments / factorX, vertex.y / segments / factorY)
    n -= 0.25
    vertex.z = n * factorZ
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
  land.position.set(0, factorY * 1.2, 0)
  return land
}

export function generateTerrain({ color = 0x33aa33, size = 1200, segments = 20 } = {}) {
  const land = createLand({ color, size, segments })
  const group = new THREE.Object3D()
  group.name = 'terrain'
  group.add(land)
  group.add(createWater({ size, segments }))
  group.receiveShadow = true
  return group
}