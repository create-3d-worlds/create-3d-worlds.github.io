import * as THREE from '/node_modules/three/build/three.module.js'
import {randomInRange, randomColor} from './helpers.js'

const loader = new THREE.TextureLoader()

/* helpers */

function createOutline(size) {
  const outlineSize = size * 0.05
  const geometry = new THREE.BoxGeometry(size + outlineSize, size + outlineSize, size + outlineSize)
  const material = new THREE.MeshBasicMaterial({ color: 0x0000000, side: THREE.BackSide })
  return new THREE.Mesh(geometry, material)
}

/* creators */

export function createBox(x = 0, y = 0, z = 0, size = 20, file, color = randomColor(0.1, 0.01, .75), zModifier = 1, yModifier = 1) {
  const ySize = size * yModifier
  const zSize = size * zModifier
  const geometry = new THREE.BoxGeometry(size, ySize, zSize)
  const options = {}
  if (file) options.map = loader.load(`/assets/textures/${file}`)
  else options.color = color
  const material = new THREE.MeshPhongMaterial(options)
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(x, y, z)
  mesh.translateY(ySize / 2)
  return mesh
}

export const createCrate = (x, y, z, size, file = 'crate.gif') => createBox(x, y, z, size, file)

export const createBlock = (x, y, z, size, color) => createBox(x, y, z, size, null, color, false)

export const createStair = (x, y, z, size) => createBox(x, y, z, size, null, null, 2)

export const createWallBlock = (x, z, size, file, yModifier = 0.5) => createBox(x, 0, z, size, file, null, 1, yModifier)

export function createSketchBox(x = 0, y = 0, z = 0, size) {
  const box = createBlock(x, y, z, size, 0x22dd88)
  const outline = createOutline(size)
  box.add(outline)
  return box
}

export function createPlayerBox(x = 0, y = 0, z = 0, size, transparent) {
  const box = createBlock(0, 0, 0, size, null, transparent)
  box.material.opacity = transparent ? 0 : 1
  box.material.transparent = transparent
  const group = new THREE.Group()
  group.add(box)
  group.position.set(x, y, z)
  return group
}

/* factories */

export function createRandomBoxes(n = 100, size = 20, texture) {
  const group = new THREE.Group()
  for (let i = 0; i < n; i++) {
    const color = randomColor(0.1, 0.01, .75)
    const x = randomInRange(-200, 200), y = randomInRange(-5, 100), z = randomInRange(-200, 200)
    const box = createBox(x, y, z, size, texture, color)
    group.add(box)
  }
  return group
}

export function createSpiralStairs(floors, stairsInCirle = 20, yDistance = 80) {
  const radius = 100
  const stairs = new THREE.Group
  const CIRCLE = Math.PI * 2
  const step = CIRCLE / stairsInCirle

  for (let i = 0; i <= CIRCLE * floors; i += step) {
    const x = Math.cos(i) * radius
    const z = Math.sin(i) * radius
    const block = createStair(x, i * yDistance, z)
    block.rotateY(Math.PI / 2 - i)
    stairs.add(block)
  }
  return stairs
}

export function createMap(matrix, size = 5, yModifier) {
  const textures = ['concrete.jpg', 'crate.gif', 'brick.png']
  const group = new THREE.Group()
  matrix.forEach((row, rowIndex) => row.forEach((val, columnIndex) => {
    if (!val) return
    const x = columnIndex * size
    const z = rowIndex * size
    group.add(createWallBlock(x, z, size, textures[val - 1], yModifier))
  }))
  return group
}
