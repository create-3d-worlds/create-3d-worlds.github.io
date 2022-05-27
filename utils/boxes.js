import * as THREE from '/node_modules/three119/build/three.module.js'
import { randomInRange, randomNuance } from './helpers.js'

const loader = new THREE.TextureLoader()

export function createBox({ x = 0, y = 0, z = 0, size = 20, file, color = randomNuance({ h: 0.1, s: 0.01, l: .75 }), zModifier = 1, yModifier = 1, xModifier = 1 } = {}) {
  const xSize = size * xModifier
  const ySize = size * yModifier
  const zSize = size * zModifier
  const geometry = new THREE.BoxGeometry(xSize, ySize, zSize)
  const options = {}
  if (file) options.map = loader.load(`/assets/textures/${file}`)
  else options.color = color
  const material = new THREE.MeshPhongMaterial(options)
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(x, y, z)
  mesh.translateY(ySize / 2)
  return mesh
}

export const createCrate = ({ x, y, z, size, file = 'crate.gif' } = {}) => createBox({ x, y, z, size, file })

export function createPlayerBox({ x = 0, y = 0, z = 0, size = 2, transparent = false } = {}) {
  const box = createBox({ size })
  box.material.opacity = transparent ? 0 : 1
  box.material.transparent = transparent
  const group = new THREE.Group()
  group.add(box)
  group.position.set(x, y, z)
  return group
}

/* factories */

export function createRandomBoxes({ n = 100, size = 5, mapSize = 50 } = {}) {
  const group = new THREE.Group()
  for (let i = 0; i < n; i++) {
    const color = randomNuance({ h: 0.1, s: 0.01, l: .75 })
    const x = randomInRange(-mapSize, mapSize), y = randomInRange(-5, mapSize * .5), z = randomInRange(-mapSize, mapSize)
    const box = createBox({ x, y, z, size, color })
    group.add(box)
  }
  return group
}
