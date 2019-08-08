import {randomInRange} from './helpers.js'
const {PI, random, floor} = Math

const loader = new THREE.TextureLoader()
const textures = ['concrete.jpg', 'crate.gif', 'brick.png']

const randomColor = (h = 0.05, s = 0.75, l = 0.5) =>
  new THREE.Color().setHSL(random() * 0.3 + h, s, random() * 0.25 + l)

export function createBounds(mesh) {
  const bbox = new THREE.Box3().setFromObject(mesh)
  const bounds = {
    xMin: bbox.min.x,
    xMax: bbox.max.x,
    yMin: bbox.min.y,
    yMax: bbox.max.y,
    zMin: bbox.min.z,
    zMax: bbox.max.z,
  }
  return bounds
}

export function createFloor(width = 100, height = 100, file = 'ground.jpg') {
  const texture = loader.load(`../assets/textures/${file}`)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(width / 10, height / 10)
  const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
  const geometry = new THREE.CircleGeometry(width, height)
  const floor = new THREE.Mesh(geometry, material)
  floor.rotation.x = -PI / 2
  return floor
}

export function createPlane() {
  const geometry = new THREE.PlaneBufferGeometry(100000, 100000)
  const material = new THREE.MeshToonMaterial({ color: 0x336633 })
  const plane = new THREE.Mesh(geometry, material)
  plane.rotation.x = -1 * PI / 2
  plane.position.y = 0
  return plane
}

export function createBox(z = 0, x = 0, size = 1, file, color = 0xff0000) {
  size = size < 0.5 ? 0.5 : size // eslint-disable-line
  const geometry = new THREE.BoxGeometry(size, size, size)
  const options = file ? {map: loader.load(`../assets/textures/${file}`)} : {color, vertexColors: THREE.FaceColors}
  const material = new THREE.MeshBasicMaterial(options)
  const cube = new THREE.Mesh(geometry, material)
  cube.position.y = size / 2
  cube.position.z = z
  cube.position.x = x
  return cube
}

export function createSketchBox(size) {
  const outlineSize = size * 0.05
  const geometry = new THREE.BoxBufferGeometry(size, size, size)
  const material = new THREE.MeshPhongMaterial({ color: 0x22dd88 })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.y = size / 2

  const outline_geo = new THREE.BoxGeometry(size + outlineSize, size + outlineSize, size + outlineSize)
  const outline_mat = new THREE.MeshBasicMaterial({ color: 0x0000000, side: THREE.BackSide })
  const outline = new THREE.Mesh(outline_geo, outline_mat)
  mesh.add(outline)
  return mesh
}

export function createSphere(z = 0, x = 0, radius = 0.5, color = 0xff0000) {
  const geometry = new THREE.SphereGeometry(radius, 32, 32)
  const material = new THREE.MeshBasicMaterial({color})
  const sphere = new THREE.Mesh(geometry, material)
  sphere.position.y = radius / 2
  sphere.position.z = z
  sphere.position.x = x
  return sphere
}

export function createMap(matrix, size = 1) {
  const group = new THREE.Group()
  matrix.forEach((row, z) => row.forEach((val, x) => {
    if (val) group.add(createBox(z * size, x * size, size, textures[val - 1]))
  }))
  return group
}

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

export function createTrees(num = 20, min = -250, max = 250, height = 50) {
  const group = new THREE.Group()
  const coords = Array(num).fill().map(() => [randomInRange(min, max), randomInRange(min, max)])
  coords.forEach(coord => group.add(createTree(...coord, height)))
  return group
}

export function createSketchTree(posX, posZ, size) {
  const outlineSize = size * 0.05
  const randomScale = randomInRange(0.8, 1.6, false)
  const randomRotateY = PI / (floor((random() * 32) + 1))

  let geometry = new THREE.CylinderGeometry(size / 3.5, size / 2.5, size * 1.3, 8)
  let material = new THREE.MeshToonMaterial({ color: 0x664422 })
  const trunk = new THREE.Mesh(geometry, material)
  trunk.position.set(posX, ((size * 1.3 * randomScale) / 2), posZ)
  trunk.scale.x = trunk.scale.y = trunk.scale.z = randomScale
  const bounds = createBounds(trunk) // bounds of trunk, without treeTop

  let outline_geo = new THREE.CylinderGeometry(size / 3.5 + outlineSize, size / 2.5 + outlineSize, size * 1.3 + outlineSize, 8)
  let outline_mat = new THREE.MeshBasicMaterial({
    color: 0x0000000,
    side: THREE.BackSide
  })
  const outlineTrunk = new THREE.Mesh(outline_geo, outline_mat)
  trunk.add(outlineTrunk)

  geometry = new THREE.DodecahedronGeometry(size)
  material = new THREE.MeshToonMaterial({ color: 0x44aa44 })
  const treeTop = new THREE.Mesh(geometry, material)
  treeTop.position.y = size * randomScale + randomScale
  treeTop.scale.x = treeTop.scale.y = treeTop.scale.z = randomScale
  treeTop.rotation.y = randomRotateY
  trunk.add(treeTop)

  outline_geo = new THREE.DodecahedronGeometry(size + outlineSize)
  outline_mat = new THREE.MeshBasicMaterial({
    color: 0x0000000,
    side: THREE.BackSide
  })
  const outlineTreeTop = new THREE.Mesh(outline_geo, outline_mat)
  treeTop.add(outlineTreeTop)
  return {trunk, bounds}
}

export function createSketchTrees(num = 10, min = -800, max = 800, size = 50) {
  const group = new THREE.Group()
  const solids = []
  const coords = Array(num).fill().map(() => [randomInRange(min, max), randomInRange(min, max)])
  coords.forEach(coord => {
    const tree = createSketchTree(...coord, size)
    group.add(tree.trunk)
    solids.push(tree.bounds)
  })
  return {group, solids}
}

export function createTerrain() {
  const geometry = new THREE.PlaneGeometry(1000, 1000, 100, 100)
  geometry.rotateX(- PI / 2)
  geometry.vertices.forEach(vertex => {
    vertex.x += randomInRange(-10, 10)
    vertex.y += randomInRange(-5, 5)
    vertex.z += randomInRange(-10, 10)
  })
  geometry.faces.forEach(face => {
    face.vertexColors.push(randomColor(), randomColor(), randomColor())
  })
  const material = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors })
  return new THREE.Mesh(geometry, material)
}

export function createRandomBoxes(boxNum = 100, size = 20) {
  const group = new THREE.Group()
  const geometry = new THREE.BoxGeometry(size, size, size)
  for (let i = 0; i < boxNum; i++) {
    const material = new THREE.MeshPhongMaterial({flatShading: true})
    material.color = randomColor(0.1, 0.01, .75)
    const box = new THREE.Mesh(geometry, material)
    box.position.x = randomInRange(-200, 200)
    box.position.y = randomInRange(-5, 100)
    box.position.z = randomInRange(-200, 200)
    group.add(box)
  }
  return group
}
