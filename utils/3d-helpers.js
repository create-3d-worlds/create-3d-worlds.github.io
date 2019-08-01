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

export function createBox(z = 0, x = 0, file = textures[0], height = 1) {
  height = height < 0.5 ? 0.5 : height // eslint-disable-line
  const texture = loader.load(`../assets/textures/${file}`)
  const geometry = new THREE.BoxGeometry(1, height, 1)
  const material = new THREE.MeshBasicMaterial({ map: texture })
  const cube = new THREE.Mesh(geometry, material)
  cube.position.y = height / 2
  cube.position.z = z
  cube.position.x = x
  return cube
}

export function createSphere(z = 0, x = 0, radius = 0.5) {
  const geometry = new THREE.SphereGeometry(radius, 32, 32)
  const material = new THREE.MeshBasicMaterial({color: 0xff0000})
  const sphere = new THREE.Mesh(geometry, material)
  sphere.position.y = radius / 2
  sphere.position.z = z
  sphere.position.x = x
  return sphere
}

export function createMap(matrix) {
  const group = new THREE.Group()
  matrix.forEach((row, z) => row.forEach((val, x) => {
    if (val) group.add(createBox(z, x, textures[val - 1], textures.length - val))
  }))
  return group
}
