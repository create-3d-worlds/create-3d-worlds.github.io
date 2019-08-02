import {randomInRange} from './helpers.js'

const loader = new THREE.TextureLoader()
const textures = ['concrete.jpg', 'crate.gif', 'brick.png']

export function createFloor(width = 100, height = 100, file = 'ground.jpg') {
  const texture = loader.load(`../assets/textures/${file}`)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(width / 10, height / 10)
  const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
  const geometry = new THREE.CircleGeometry(width, height)
  const floor = new THREE.Mesh(geometry, material)
  floor.rotation.x = -Math.PI / 2
  return floor
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

export function createPlayerBox(z = 0, x = 0, size = 1) {
  const mesh = createBox(z, x, size)
  mesh.geometry.faces[0].color.set('black')
  mesh.geometry.faces[1].color.set('black')
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
  const crown = new THREE.Mesh(
    new THREE.SphereGeometry(height * 2 / 3),
    new THREE.MeshBasicMaterial({color: 0x228b22})
  )
  crown.position.y = height + height / 10
  tree.add(crown)
  return tree
}

export function createTrees(num = 20) {
  const group = new THREE.Group()
  const coords = Array(num).fill().map(() => [randomInRange(-250, 250), randomInRange(-250, 250)])
  coords.map(coord => group.add(createTree(...coord)))
  return group
}
