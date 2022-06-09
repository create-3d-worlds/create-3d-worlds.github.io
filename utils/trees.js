import * as THREE from '/node_modules/three127/build/three.module.js'
import { randomInRange, similarColor, randomNuance, randomInSquare, findGroundRecursive } from './helpers.js'

const sketchSize = 0.04
const browns = [0x3d2817, 0x664422, 0xA0522D, 0x886633, 0x966F33]
const greens = [0x2d4c1e, 0x228b22, 0x3EA055, 0x44aa44, 0x33ff33]

const randomBrown = () => browns[Math.floor(Math.random() * browns.length)]

/* SIMPLE TREE */

function createTrunk(size, color, sketch = false) {
  const geometry = new THREE.CylinderGeometry(size / 3.5, size / 3, size, 8)
  const material = new THREE.MeshToonMaterial({
    color: color || randomNuance({ h: 1.045, s: 0.5 })
  })
  const mesh = new THREE.Mesh(geometry, material)
  if (sketch) {
    const outlineSize = size * sketchSize
    const outlineGeo = new THREE.CylinderGeometry(size / 3.5 + outlineSize, size / 3 + outlineSize, size + outlineSize, 8)
    const outlineMat = new THREE.MeshBasicMaterial({
      color: 0x0000000,
      side: THREE.BackSide
    })
    const outline = new THREE.Mesh(outlineGeo, outlineMat)
    mesh.add(outline)
  }
  return mesh
}

function createCrown(size, color, sketch = false) {
  const Shape = Math.random() > .2 ? THREE.DodecahedronGeometry : THREE.SphereGeometry
  const geometry = new Shape(size)
  const material = new THREE.MeshToonMaterial({
    color: color || randomNuance()
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.rotation.y = randomInRange(0, Math.PI)
  if (sketch) {
    const outlineSize = size * sketchSize
    const outlineGeo = new Shape(size + outlineSize)
    const outlineMat = new THREE.MeshBasicMaterial({
      color: 0x0000000,
      side: THREE.BackSide
    })
    const outline = new THREE.Mesh(outlineGeo, outlineMat)
    mesh.add(outline)
  }
  return mesh
}

export function createTree({ x = 0, y = 0, z = 0, size = 5, trunkColor, crownColor, sketch = false } = {}) {
  size = size * randomInRange(0.6, 1.4) // eslint-disable-line
  const trunk = createTrunk(size, trunkColor, sketch)
  trunk.position.set(x, y, z)
  trunk.translateY(size / 2)

  const crown = createCrown(size, crownColor, sketch)
  crown.position.y = size + size / 4
  trunk.add(crown)
  return trunk
}

export const createSketchTree = ({ x, y, z, size, sketch = true } = {}) => createTree({ x, y, z, size, trunkColor: false, crownColor: false, sketch })

/* FIR TREE */

export function createFirTree({ x = 0, y = 0, z = 0, size = 5 } = {}) {
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(2, 2, 12, 6, 1, true),
    new THREE.MeshLambertMaterial({ color: similarColor(browns[1]) })
  )
  const greenMaterial = new THREE.MeshLambertMaterial({ color: randomNuance() })
  trunk.position.y = 6
  const c1 = new THREE.Mesh(new THREE.CylinderGeometry(0, 10, 14, 8), greenMaterial)
  c1.position.y = 18
  const c2 = new THREE.Mesh(new THREE.CylinderGeometry(0, 9, 13, 8), greenMaterial)
  c2.position.y = 25
  const c3 = new THREE.Mesh(new THREE.CylinderGeometry(0, 8, 12, 8), greenMaterial)
  c3.position.y = 32

  const group = new THREE.Group()
  group.add(trunk)
  group.add(c1)
  group.add(c2)
  group.add(c3)

  const scale = size / 10
  group.scale.set(scale, randomInRange(scale / 2, scale), scale)
  group.position.set(x, y, z)
  return group
}

/* SIMPLE FIR TREE */

function createFirTop({ radius = .5, height = 1, radialSegments = 8, heightSegments = 6 } = {}) {
  const geometry = new THREE.ConeGeometry(radius, height, radialSegments, heightSegments)
  const material = new THREE.MeshStandardMaterial({
    color: similarColor(greens[3]),
    flatShading: true
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.castShadow = mesh.receiveShadow = false
  mesh.position.y = 0.9
  mesh.rotation.y = (Math.random() * (Math.PI))
  return mesh
}

function createFirTrunk({ radiusTop = .1, radiusBottom = .1, height = .5 } = {}) {
  const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height)
  const material = new THREE.MeshStandardMaterial({
    color: randomBrown(),
    flatShading: true
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.y = height * .5
  return mesh
}

export function createFir({ x = 0, y = 0, z = 0, size = 5 } = {}) {
  const mesh = new THREE.Object3D()
  mesh.add(createFirTrunk())
  mesh.add(createFirTop())
  mesh.position.set(x, y, z)
  mesh.scale.set(size * 2, size * 2, size * 2) // other fir parts are much smaller
  return mesh
}

// size = full height
export function createSimpleFir({ size = 12, x = 0, y = 0, z = 0 } = {}) {
  size = size * randomInRange(0.6, 1.4) // eslint-disable-line
  const treeData = {
    geom: {
      leaves: new THREE.CylinderGeometry(0, .31 * size, .75 * size, 4, 1),
      trunk: new THREE.BoxGeometry(.06 * size, .25 * size, .06 * size)
    },
    materials: {
      leaves: new THREE.MeshLambertMaterial({ color: similarColor(greens[3]) }),
      trunk: new THREE.MeshLambertMaterial({ color: randomBrown() })
    }
  }
  const group = new THREE.Object3D()
  const leaves = new THREE.Mesh(treeData.geom.leaves, treeData.materials.leaves)
  const trunk = new THREE.Mesh(treeData.geom.trunk, treeData.materials.trunk)
  leaves.name = 'leaves'
  trunk.name = 'trunk'
  leaves.castShadow = true
  trunk.castShadow = true
  leaves.position.y += size * .5
  group.add(leaves)
  group.add(trunk)
  group.castShadow = true
  group.position.set(x, y, z)
  return group
}

/* FACTORIES */

export function createTrees(n = 50, mapSize = 100, size = 5, create = createTree) {
  const min = -mapSize, max = mapSize
  const group = new THREE.Group()
  const coords = Array(n).fill().map(() => [randomInRange(min, max), randomInRange(min, max)])
  coords.forEach(([x, z]) => group.add(create({ x, y: 0, z, size })))
  return group
}

export const createFirTrees = ({ n, mapSize, size } = {}) =>
  createTrees(n, mapSize, size, createFirTree)

export const createSketchTrees = (n, mapSize, size) =>
  createTrees(n, mapSize, size, createSketchTree)

export const createTreesOnTerrain = ({ terrain, n = 100, mapSize = 400, size } = {}) => {
  const group = new THREE.Group()
  for (let i = 0; i < n; i++) {
    const pos = findGroundRecursive(terrain, mapSize)
    if (pos) group.add(createFirTree({ x: pos.x, y: pos.y, z: pos.z, size }))
  }
  return group
}
