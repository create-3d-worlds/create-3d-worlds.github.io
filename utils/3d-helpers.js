const loader = new THREE.TextureLoader()

export function createBox(z, x, file) {
  const texture = loader.load(`../assets/textures/${file}`)
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial({ map: texture })
  const cube = new THREE.Mesh(geometry, material)
  cube.position.y = 0.5
  cube.position.z = z
  cube.position.x = x
  return cube
}

export function createFloor(width = 100, height = 100, file) {
  const texture = loader.load(`../assets/textures/${file}`)
  const material = new THREE.MeshBasicMaterial({ map: texture })
  const geometry = new THREE.PlaneGeometry(width, height)
  const floor = new THREE.Mesh(geometry, material)
  floor.rotation.x = 0 + Math.PI / 2 + Math.PI / 2 + Math.PI / 2
  return floor
}
