import * as THREE from 'three'
import { similarColor, findGroundRecursive, getAllCoords, maxItems } from '/utils/helpers.js'

const { randFloat } = THREE.MathUtils

const sketchSize = 0.04
const browns = [0x3d2817, 0x664422, 0xA0522D, 0x886633, 0x966F33]
const greens = [0x2d4c1e, 0x228b22, 0x3EA055, 0x44aa44, 0x33ff33]

const randomBrown = () => browns[Math.floor(Math.random() * browns.length)]

const randomNuance = ({ h = .25, s = 0.5, l = 0.2 } = {}) =>
  new THREE.Color().setHSL(Math.random() * 0.1 + h, s, Math.random() * 0.25 + l)

/* SIMPLE TREE */

function createTrunk(size, color) {
  const geometry = new THREE.CylinderGeometry(size / 5, size / 4, size * 2, 8)
  const material = new THREE.MeshToonMaterial({
    color: color || randomNuance({ h: 1.045, s: 0.5 })
  })
  const mesh = new THREE.Mesh(geometry, material)
  return mesh
}

function createCrown(size, color, sketch = false) {
  const Shape = Math.random() > .2 ? THREE.DodecahedronGeometry : THREE.SphereGeometry
  const geometry = new Shape(size)
  const material = new THREE.MeshToonMaterial({
    color: color || randomNuance()
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.rotation.y = randFloat(0, Math.PI)
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

export function createTree({ x = 0, y = 0, z = 0, size = 5, trunkColor, crownColor } = {}) {
  size = size * randFloat(0.6, 1.4) // eslint-disable-line
  const trunk = createTrunk(size, trunkColor)
  trunk.position.set(x, y, z)
  trunk.translateY(size)

  const crown = createCrown(size, crownColor)
  crown.position.y = 2 * size - size / 4
  trunk.add(crown)
  return trunk
}

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
  group.scale.set(scale, randFloat(scale / 2, scale), scale)
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
  mesh.castShadow = true
  mesh.receiveShadow = false
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
  size = size * randFloat(0.6, 1.4) // eslint-disable-line
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

export function createTrees({ mapSize = 100, size = 4, n = maxItems(mapSize, size) / 4, nFirTrees = 0, coords = getAllCoords({ mapSize, fieldSize: size }) } = {}) {
  const group = new THREE.Group()
  for (let i = 0; i < n; i++) {
    const { x, z } = coords.pop()
    group.add(createTree({ x, y: 0, z, size }))
  }
  for (let i = 0; i < nFirTrees; i++) {
    const { x, z } = coords.pop()
    group.add(createFirTree({ x, y: 0, z, size }))
  }
  return group
}

export const createFirTrees = ({ mapSize = 100, size = 5, n = maxItems(mapSize, size) / 4, ...params } = {}) => createTrees({ mapSize, size, nFirTrees: n, n: 0, ...params })

export const createTreesOnTerrain = ({ terrain, n = 100, mapSize = 400, size } = {}) => {
  const group = new THREE.Group()
  for (let i = 0; i < n; i++) {
    const pos = findGroundRecursive(terrain, mapSize)
    if (pos) group.add(createFirTree({ x: pos.x, y: pos.y, z: pos.z, size }))
  }
  return group
}
