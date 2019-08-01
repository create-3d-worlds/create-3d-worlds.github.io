const loader = new THREE.TextureLoader()

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

export function createBox(z, x, file, height = 1) {
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

export function createMap(matrix) {
  const textures = ['concrete.jpg', 'crate.gif', 'brick.png']
  const group = new THREE.Group()
  matrix.forEach((row, z) => row.forEach((val, x) => {
    if (val) group.add(createBox(z, x, textures[val - 1], textures.length - val))
  }))
  return group
}
