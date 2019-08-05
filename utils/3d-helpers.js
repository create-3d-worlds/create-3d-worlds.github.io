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

  const collider = new THREE.Mesh(
    new THREE.CircleGeometry(200),
    new THREE.MeshBasicMaterial({color: 0x228b22})
  )
  collider.position.y = -height / 2
  collider.rotation.x = -Math.PI / 2
  collider.name = 'collider'
  tree.add(collider)
  return tree
}

export function createTrees(num = 20, min = -250, max = 250, height = 50) {
  const group = new THREE.Group()
  const coords = Array(num).fill().map(() => [randomInRange(min, max), randomInRange(min, max)])
  coords.map(coord => group.add(createTree(...coord, height)))
  return group
}

export function createTerrain() {    
  const geometry = new THREE.PlaneGeometry(2000, 2000, 100, 100)
  geometry.rotateX(- Math.PI / 2)

  for (let i = 0, l = geometry.vertices.length; i < l; i++) {
    const vertex = geometry.vertices[i]
    vertex.x += Math.random() * 20 - 10
    vertex.y += Math.random() * 2
    vertex.z += Math.random() * 20 - 10
  }

  for (let i = 0, l = geometry.faces.length; i < l; i++) {
    const face = geometry.faces[i]
    face.vertexColors[0] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75)
    face.vertexColors[1] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75)
    face.vertexColors[2] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75)
  }

  const material = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors })
  return new THREE.Mesh(geometry, material)
}

export function createRandomCubes() {
  const group = new THREE.Group()
  const geometry = new THREE.BoxGeometry(20, 20, 20)
  for (let i = 0, l = geometry.faces.length; i < l; i++) {
    const face = geometry.faces[i]
    face.vertexColors[0] = new THREE.Color().setHSL(
      Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75
    )
    face.vertexColors[1] = new THREE.Color().setHSL(
      Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75
    )
    face.vertexColors[2] = new THREE.Color().setHSL(
      Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75
    )
  }
  for (let i = 0; i < 500; i++) {
    const material = new THREE.MeshPhongMaterial({
      specular: 0xffffff,
      shading: THREE.FlatShading,
      vertexColors: THREE.VertexColors
    })
    material.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75)
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.x = Math.floor(Math.random() * 20 - 10) * 20
    mesh.position.y = Math.floor(Math.random() * 20) * 20 + 10
    mesh.position.z = Math.floor(Math.random() * 20 - 10) * 20
    group.add(mesh)
  }
  return group
}