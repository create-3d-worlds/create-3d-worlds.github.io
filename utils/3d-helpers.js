const loader = new THREE.TextureLoader()
const textures = ['concrete.jpg', 'crate.gif', 'brick.png']

export function createFloor(width = 100, height = 100, file) {
  const texture = loader.load(`../assets/textures/${file}`)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(width / 10, height / 10)
  const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
  const geometry = new THREE.PlaneGeometry(width, height)
  const floor = new THREE.Mesh(geometry, material)
  floor.rotation.x = -Math.PI / 2
  return floor
}

export function createBox(z = 0, x = 0, height = 1, file, color = 0xff0000) {
  height = height < 0.5 ? 0.5 : height // eslint-disable-line
  const geometry = new THREE.BoxGeometry(1, height, 1)
  const options = file ? {map: loader.load(`../assets/textures/${file}`)} : {color, vertexColors: THREE.FaceColors}
  const material = new THREE.MeshBasicMaterial(options)
  const cube = new THREE.Mesh(geometry, material)
  cube.position.y = height / 2
  cube.position.z = z
  cube.position.x = x
  return cube
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

export function createMap(matrix) {
  const group = new THREE.Group()
  matrix.forEach((row, z) => row.forEach((val, x) => {
    if (val) group.add(createBox(z, x, textures.length - val, textures[val - 1]))
  }))
  return group
}

export function createTree(x, z) {
  const tree = new THREE.Mesh(
    new THREE.CylinderGeometry(50, 50, 200),
    new THREE.MeshBasicMaterial({color: 0xA0522D})
  )
  tree.position.set(x, -75, z)
  const crown = new THREE.Mesh(
    new THREE.SphereGeometry(150),
    new THREE.MeshBasicMaterial({color: 0x228b22})
  )
  crown.position.y = 175
  tree.add(crown)
  return tree
}
