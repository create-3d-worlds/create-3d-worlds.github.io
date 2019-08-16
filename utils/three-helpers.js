import {randomInRange, randomColor, createBounds, findGround} from './helpers.js'
import { SimplexNoise } from '../libs/SimplexNoise.js'
const {PI, random, floor} = Math

export const loader = new THREE.TextureLoader()

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

/* LAND */

export function createFloor(r = 500, file = 'ground.jpg', color = 0x60bf63) {
  const options = {}
  if (file) {
    const texture = loader.load(`../assets/textures/${file}`)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(r / 10, r / 10)
    options.map = texture
  } else
    options.color = color
  const material = new THREE.MeshBasicMaterial(options)
  const geometry = new THREE.CircleGeometry(r, 32)
  geometry.rotateX(- PI / 2)
  return new THREE.Mesh(geometry, material)
}

export function createTerrain() {
  const geometry = new THREE.PlaneGeometry(1000, 1000, 50, 50)
  geometry.rotateX(- PI / 2)
  geometry.vertices.forEach(vertex => {
    vertex.x += randomInRange(-10, 10)
    vertex.y += randomInRange(-5, 15)
    vertex.z += randomInRange(-10, 10)
  })
  geometry.faces.forEach(face => {
    face.vertexColors.push(randomColor(), randomColor(), randomColor())
  })
  const material = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors })
  return new THREE.Mesh(geometry, material)
}

export function createWater(size = 1000, useTexture = false, opacity = 0.75) {
  const geometry = new THREE.PlaneGeometry(size, size, 1, 1)
  geometry.rotateX(-Math.PI / 2)
  const material = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity
  })
  if (useTexture) {
    const texture = loader.load('../assets/textures/water512.jpg')
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(5, 5)
    material.map = texture
  } else
    material.color.setHex(0x6699ff)

  return new THREE.Mesh(geometry, material)
}

export const createHillyTerrain = (size, avgHeight = 30) => {
  const resolution = 20
  const material = new THREE.MeshLambertMaterial({
    color: 0x33aa33,
    vertexColors: THREE.FaceColors,
  })
  const geometry = new THREE.PlaneGeometry(size, size, resolution, resolution)
  geometry.rotateX(-Math.PI / 2)

  const noise = new SimplexNoise()
  const factorX = 50
  const factorZ = 25
  const factorY = 60
  geometry.vertices.forEach(vertex => {
    vertex.x += randomInRange(-factorX, factorX)
    vertex.z += randomInRange(-factorZ, factorZ)
    const dist = noise.noise(vertex.x / resolution / factorX, vertex.z / resolution / factorZ)
    vertex.y = (dist - 0.2) * factorY
  })
  geometry.faces.forEach(face => {
    const { color } = face
    const rand = Math.random() / 5
    face.color.setRGB(color.r + rand, color.g + rand, color.b + rand)
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.y = avgHeight
  return mesh
}

/* TREES */

export function createTree(x, z, height = 50) {
  const y = height / 2
  const tree = new THREE.Mesh(
    new THREE.CylinderGeometry(height / 4, height / 4, height),
    new THREE.MeshBasicMaterial({color: 0xA0522D})
  )
  tree.position.set(x, y, z)
  tree.name = 'solid'
  const crown = new THREE.Mesh(
    new THREE.SphereGeometry(height * 2 / 3),
    new THREE.MeshBasicMaterial({color: 0x228b22})
  )
  crown.position.y = height + height / 10
  tree.add(crown)
  return tree
}

export function createTrees(n = 20, min = -250, max = 250, height = 50) {
  const group = new THREE.Group()
  const coords = Array(n).fill().map(() => [randomInRange(min, max), randomInRange(min, max)])
  coords.forEach(coord => group.add(createTree(...coord, height)))
  return group
}

export const createFir = (x = 0, y = 0, z = 0, leavesHeight = 60) => {
  const fir = new THREE.Object3D()
  const leaves = new THREE.Mesh(
    new THREE.CylinderGeometry(0, 25, leavesHeight, 4, 1),
    new THREE.MeshLambertMaterial({ color: 0x3EA055})
  )
  const trunkHeight = leavesHeight / 3 // 20
  const trunk = new THREE.Mesh(
    new THREE.BoxGeometry(5, trunkHeight, 5),
    new THREE.MeshLambertMaterial({ color: 0x966F33})
  )
  trunk.position.y = trunkHeight / 2
  leaves.position.y = trunkHeight * 2
  // leaves.castShadow = true
  // trunk.castShadow = true
  // fir.castShadow = true
  fir.add(leaves)
  fir.add(trunk)
  fir.position.set(x, y + leavesHeight / 2, z)
  return fir
}

export const createFirs = function(terrain, numTrees = 50, mapSize = 1000) {
  const group = new THREE.Group()
  for (let i = 0; i < numTrees; i++) {
    const min = -mapSize / 2, max = mapSize / 2
    const {x, z} = new THREE.Vector3(randomInRange(min, max), 100, randomInRange(min, max))
    if (terrain) {
      const ground = findGround(terrain, x, z)
      if (ground && ground.y > 0) { // eslint-disable-line
        // console.log(ground.y)
        group.add(createFir(x, ground.y, z))
      }
    } else group.add(createFir(x, 0, z))
  }
  return group
}

// TODO: merge with createTree?
export function createSketchTree(posX, posZ, size) {
  const outlineSize = size * 0.05
  const randomScale = Math.random() + .8
  const randomRotateY = PI / (floor((random() * 32) + 1))

  let geometry = new THREE.CylinderGeometry(size / 3.5, size / 2.5, size * 1.3, 8)
  let material = new THREE.MeshToonMaterial({ color: 0x664422 })
  const trunk = new THREE.Mesh(geometry, material)
  trunk.position.set(posX, ((size * randomScale) / 2), posZ)
  trunk.scale.x = trunk.scale.y = trunk.scale.z = randomScale
  const bounds = createBounds(trunk) // bounds of trunk, without treeTop

  let outlineGeo = new THREE.CylinderGeometry(size / 3.5 + outlineSize, size / 2.5 + outlineSize, size * 1.3 + outlineSize, 8)
  let outlineMat = new THREE.MeshBasicMaterial({
    color: 0x0000000,
    side: THREE.BackSide
  })
  const outlineTrunk = new THREE.Mesh(outlineGeo, outlineMat)
  trunk.add(outlineTrunk)

  geometry = new THREE.DodecahedronGeometry(size)
  material = new THREE.MeshToonMaterial({ color: 0x44aa44 })
  const treeTop = new THREE.Mesh(geometry, material)
  treeTop.position.y = size * randomScale + randomScale
  treeTop.scale.x = treeTop.scale.y = treeTop.scale.z = randomScale
  treeTop.rotation.y = randomRotateY
  trunk.add(treeTop)

  outlineGeo = new THREE.DodecahedronGeometry(size + outlineSize)
  outlineMat = new THREE.MeshBasicMaterial({
    color: 0x0000000,
    side: THREE.BackSide
  })
  const outlineTreeTop = new THREE.Mesh(outlineGeo, outlineMat)
  treeTop.add(outlineTreeTop)
  return {trunk, bounds}
}

// TODO: merge with createTrees?
export function createSketchTrees(n = 5, min = -500, max = 500, size = 50) {
  const group = new THREE.Group()
  const solids = []
  const coords = Array(n).fill().map(() => [randomInRange(min, max), randomInRange(min, max)])
  coords.forEach(coord => {
    const tree = createSketchTree(...coord, size)
    group.add(tree.trunk)
    solids.push(tree.bounds)
  })
  return {group, solids}
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
