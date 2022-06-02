import * as THREE from '/node_modules/three127/build/three.module.js'
import { ImprovedNoise } from '/node_modules/three127/examples/jsm/math/ImprovedNoise.js'

const perlin = new ImprovedNoise()

function generateHeightData(worldSize) {
  const size = worldSize * worldSize
  const data = new Uint8Array(size)
  const z = Math.random() * 100
  let quality = 1
  for (let j = 0; j < 4; j ++) {
    for (let i = 0; i < size; i ++) {
      const x = i % worldSize
      const y = ~~ (i / worldSize)
      data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75)
    }
    quality *= 5
  }
  return data
}

export function createPerlinTerrain({ planeSize = 5000, worldSize = 128, file = 'ground.jpg' } = {}) {
  const data = generateHeightData(worldSize)
  const geometry = new THREE.PlaneBufferGeometry(planeSize, planeSize, worldSize - 1, worldSize - 1)
  geometry.rotateX(- Math.PI / 2)
  const { length } = geometry.attributes.position.array

  for (let i = 0, j = 0; i < length; i ++, j += 3)
    geometry.attributes.position.array[j + 1] = data[i] * 10

  const texture = new THREE.TextureLoader().load(`/assets/textures/${file}`)
  const material = new THREE.MeshBasicMaterial({ map: texture })
  const mesh = new THREE.Mesh(geometry, material)
  return mesh
}
