import {randomInRange, randomColor, findGround} from './helpers.js'

function createTrunk(size, color) { // 0x664422, 0xA0522D
  const geometry = new THREE.CylinderGeometry(size / 3.5, size / 3, size, 8)
  const material = new THREE.MeshToonMaterial({
    color: color || randomColor(1.045, 0.5)
  })
  return new THREE.Mesh(geometry, material)
}

function createCrown(size, color) { // 0x44aa44, 0x228b22
  const Shape = Math.random() > .2 ? THREE.DodecahedronGeometry : THREE.SphereGeometry
  const geometry = new Shape(size)
  const material = new THREE.MeshToonMaterial({
    color: color || randomColor()
  })
  const crown = new THREE.Mesh(geometry, material)
  return crown
}

export function createTree(x = 0, y = 0, z = 0, size = 50) {
  const trunk = createTrunk(size, 0xA0522D)
  trunk.position.set(x, y, z)
  trunk.translateY(size / 2)

  const crown = createCrown(size, 0x228b22)
  crown.position.y = size + size / 4
  trunk.add(crown)
  return trunk
}

// TODO: merge with createTree?
export function createSketchTree(x = 0, y = 0, z = 0, size = 50) {
  const randScale = Math.random() * 0.5 + 1
  const trunk = createTrunk(size)
  trunk.position.set(x, y, z)
  trunk.translateY(size / 2)
  trunk.scale.set(randScale, randScale, randScale)

  const crown = createCrown(size)
  crown.position.y = size * randScale + randScale
  crown.scale.set(randScale, randScale, randScale)
  crown.rotation.y = randomInRange(0, Math.PI, false)
  trunk.add(crown)

  // const outlineSize = size * 0.05
  // let outlineGeo = new THREE.CylinderGeometry(size / 3.5 + outlineSize, size / 2.5 + outlineSize, size * 1.3 + outlineSize, 8)
  // let outlineMat = new THREE.MeshBasicMaterial({
  //   color: 0x0000000,
  //   side: THREE.BackSide
  // })
  // const outlineTrunk = new THREE.Mesh(outlineGeo, outlineMat)
  // trunk.add(outlineTrunk)
  // outlineGeo = new THREE.DodecahedronGeometry(size + outlineSize)
  // outlineMat = new THREE.MeshBasicMaterial({
  //   color: 0x0000000,
  //   side: THREE.BackSide
  // })
  // const outlineTreeTop = new THREE.Mesh(outlineGeo, outlineMat)
  // crown.add(outlineTreeTop)
  return trunk
}

export function createFirTree(x = 0, y = 0, z = 0, size = 50, color = 0x3EA055) {
  const scale = size / 10
  const material = [
    new THREE.MeshLambertMaterial({ color: 0x3d2817 }), // brown
    new THREE.MeshLambertMaterial({ color }), // green 0x2d4c1e or 0x3EA055
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
  for (let i = 0, l = geometry.faces.length; i < l; i++)
    geometry.faces[i].materialIndex = i < b ? 0 : 1

  const mesh = new THREE.Mesh(geometry, material)
  mesh.scale.set(scale, randomInRange(scale / 2, scale, false), scale)
  mesh.position.set(x, y, z)
  return mesh
}

export function createTrees(n = 20, mapSize = 1000, size = 50, create = createTree) {
  const min = -mapSize / 2, max = mapSize / 2
  const group = new THREE.Group()
  const coords = Array(n).fill().map(() => [randomInRange(min, max), randomInRange(min, max)])
  coords.forEach(([x, y]) => group.add(create(x, 0, y, size, 0x2d4c1e)))
  return group
}

export const createFirTrees = (n, range, size) =>
  createTrees(n, range, size, createFirTree)

export const createSketchTrees = (n, range, size) =>
  createTrees(n, range, size, createSketchTree)

export const createTreesOnTerrain = function(terrain, n = 50, range = 500) {
  const group = new THREE.Group()
  for (let i = 0; i < n; i++) {
    const min = -range, max = range
    const x = randomInRange(min, max), z = randomInRange(min, max)
    const ground = findGround(terrain, x, z)
    const yOffset = 20
    if (ground && ground.y > 0)
      group.add(createFirTree(x, ground.y + yOffset, z))
  }
  return group
}
