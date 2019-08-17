import {randomInRange, randomColor} from './helpers.js'

const loader = new THREE.TextureLoader()

/* SHAPES */

export function createBox(x = 0, y = 0, z = 0, size = 20, file, color = randomColor(0.1, 0.01, .75)) {
  const geometry = new THREE.BoxGeometry(size, size, size)
  const options = {}
  if (file) options.map = loader.load(`../assets/textures/${file}`)
  else options.color = color
  const material = new THREE.MeshPhongMaterial(options)
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(x, y, z)
  mesh.translateY(size / 2)
  return mesh
}

export const createCrate = (x, y, z, size, file = 'crate.gif') => createBox(x, y, z, size, file)

export const createBlock = (x, y, z, size, color) => createBox(x, y, z, size, null, color)

function createOutline(size) {
  const outlineSize = size * 0.05
  const geometry = new THREE.BoxGeometry(size + outlineSize, size + outlineSize, size + outlineSize)
  const material = new THREE.MeshBasicMaterial({ color: 0x0000000, side: THREE.BackSide })
  return new THREE.Mesh(geometry, material)
}

export function createSketchBox(size) {
  const box = createBlock(0, 0, 0, size, 0x22dd88)
  const outline = createOutline(size)
  box.add(outline)
  return box
}

export function createSphere(x = 0, y = 0, z = 0, radius = 5, color = 0x000000) {
  const geometry = new THREE.SphereGeometry(radius, 32, 32)
  const material = new THREE.MeshBasicMaterial({color})
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(x, y, z)
  mesh.translateY(radius / 2)
  return mesh
}

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

/* MAP */

export function createMap(matrix, size = 5) {
  const textures = ['concrete.jpg', 'crate.gif', 'brick.png']
  const group = new THREE.Group()
  matrix.forEach((row, z) => row.forEach((val, x) => {
    if (val) group.add(createBox(x * size, 0, z * size, size, textures[val - 1]))
  }))
  return group
}
