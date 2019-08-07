export default class PlayerBox {

  constructor(size) {
    this.createMesh(size)
  }

  createMesh(size) {
    const outlineSize = size * 0.05
    const geometry = new THREE.BoxBufferGeometry(size, size, size)
    const material = new THREE.MeshPhongMaterial({ color: 0x22dd88 })
    this.mesh = new THREE.Mesh(geometry, material)
    this.mesh.position.y = size / 2

    const outline_geo = new THREE.BoxGeometry(size + outlineSize, size + outlineSize, size + outlineSize)
    const outline_mat = new THREE.MeshBasicMaterial({ color: 0x0000000, side: THREE.BackSide })
    const outline = new THREE.Mesh(outline_geo, outline_mat)
    this.mesh.add(outline)
  }
}
