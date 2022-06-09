import * as THREE from '/node_modules/three127/build/three.module.js'
import { randomNuance, getTexture } from '/utils/helpers.js'
import { createWater } from '/utils/ground.js'
import { SimplexNoise } from '/libs/SimplexNoise.js'

const noise = new SimplexNoise()

export function createHillyTerrain(
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

  for (let i = 0, l = position.count; i < l; i++) {
    vertex.fromBufferAttribute(position, i)
    const dist = noise.noise(vertex.x / segments / factorX, vertex.y / segments / factorY)
    vertex.z = (dist - .25) * factorZ
    position.setXYZ(i, vertex.x, vertex.y, vertex.z)
  }

  const colors = []
  for (let i = 0, l = position.count; i < l; i++) {
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