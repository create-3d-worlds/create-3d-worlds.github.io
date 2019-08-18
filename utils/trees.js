import {randomInRange, similarColor, randomColor} from './helpers.js'

const sketchSize = 0.04
const groundOffset = 20
const browns = [0x3d2817, 0x664422, 0xA0522D]
const greens = [0x228b22, 0x2d4c1e, 0x3EA055, 0x44aa44]

/* HELPERS */

function createTrunk(size, color, sketch = false) {
  const geometry = new THREE.CylinderGeometry(size / 3.5, size / 3, size, 8)
  const material = new THREE.MeshToonMaterial({
    color: color || randomColor(1.045, 0.5)
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
    color: color || randomColor()
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

const findGround = function(terrain, x, z) {
  const direction = new THREE.Vector3(0, -1, 0)
  const origin = { x, y: 1000, z }
  const raycaster = new THREE.Raycaster()
  raycaster.set(origin, direction)
  const intersects = raycaster.intersectObject(terrain, true)
  if (intersects.length > 0 && intersects[0].point.y > -groundOffset / 2)
    return intersects[0].point
  return null
}

function findGroundRecursive(terrain, mapSize, counter = 0) {
  const min = -mapSize, max = mapSize
  const x = randomInRange(min, max), z = randomInRange(min, max)
  const ground = findGround(terrain, x, z)
  if (ground) return ground
  if (counter > 5) return null
  return findGroundRecursive(terrain, mapSize, counter + 1)
}

/* CREATORS */

export function createTree(x = 0, y = 0, z = 0, size = 50, trunkColor, crownColor, sketch = false) {
  size = size * randomInRange(0.6, 1.8) // eslint-disable-line
  const trunk = createTrunk(size, trunkColor, sketch)
  trunk.position.set(x, y, z)
  trunk.translateY(size / 2)

  const crown = createCrown(size, crownColor, sketch)
  crown.position.y = size + size / 4
  trunk.add(crown)
  return trunk
}

export const createSimpleTree = (x, y, z, size, trunkColor = browns[2], crownColor = greens[0]) =>
  createTree(x, y, z, size, trunkColor, crownColor)

export const createColorfulTree = (x, y, z, size, sketch = false) => createTree(x, y, z, size, false, false, sketch)

export const createSketchTree = (x, y, z, size, sketch = true) => createTree(x, y, z, size, false, false, sketch)

export function createFirTree(x = 0, y = 0, z = 0, size = 50) {
  const material = [
    new THREE.MeshLambertMaterial({ color: similarColor(browns[1]) }),
    new THREE.MeshLambertMaterial({ color: randomColor() }),
  ]
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 12, 6, 1, true))
  trunk.position.y = 6
  const c1 = new THREE.Mesh(new THREE.CylinderGeometry(0, 10, 14, 8))
  c1.position.y = 18
  const c2 = new THREE.Mesh(new THREE.CylinderGeometry(0, 9, 13, 8))
  c2.position.y = 25
  const c3 = new THREE.Mesh(new THREE.CylinderGeometry(0, 8, 12, 8))
  c3.position.y = 32

  const geometry = new THREE.Geometry()
  trunk.updateMatrix()
  c1.updateMatrix()
  c2.updateMatrix()
  c3.updateMatrix()
  geometry.merge(trunk.geometry, trunk.matrix)
  geometry.merge(c1.geometry, c1.matrix)
  geometry.merge(c2.geometry, c2.matrix)
  geometry.merge(c3.geometry, c3.matrix)

  const b = trunk.geometry.faces.length
  for (let i = 0; i < geometry.faces.length; i++)
    geometry.faces[i].materialIndex = i < b ? 0 : 1

  const mesh = new THREE.Mesh(geometry, material)
  const scale = size / 10 // scale acording to size
  mesh.scale.set(scale, randomInRange(scale / 2, scale), scale)
  mesh.position.set(x, y, z)
  return mesh
}

/* FACTORIES */

export function createTrees(n = 20, mapSize = 500, size = 50, create = createSimpleTree) {
  const min = -mapSize, max = mapSize
  const group = new THREE.Group()
  const coords = Array(n).fill().map(() => [randomInRange(min, max), randomInRange(min, max)])
  coords.forEach(([x, y]) => group.add(create(x, 0, y, size)))
  return group
}

export const createFirTrees = (n, mapSize, size) =>
  createTrees(n, mapSize, size, createFirTree)

export const createSketchTrees = (n, mapSize, size) =>
  createTrees(n, mapSize, size, createSketchTree)

export const createTreesOnTerrain = function(terrain, n = 50, mapSize = 500, size) {
  const group = new THREE.Group()
  for (let i = 0; i < n; i++) {
    const pos = findGroundRecursive(terrain, mapSize)
    if (pos) group.add(createFirTree(pos.x, pos.y + groundOffset, pos.z, size))
  }
  return group
}
