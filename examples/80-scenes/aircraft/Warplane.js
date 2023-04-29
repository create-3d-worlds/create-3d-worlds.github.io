import input from '/utils/io/Input.js'
import { loadModel } from '/utils/loaders.js'

const mesh = await loadModel({ file: '/aircraft/messerschmitt-bf-109/scene.gltf', size: 20 })

export default class Warplane {
  constructor() {
    this.mesh = mesh
    mesh.position.y = 100
    this.speed = 100
    this.rotationSpeed = .5
    this.minHeight = 50
    this.maxRoll = Math.PI / 3
  }

  handleInput(delta) {
    const { mesh } = this

    if (input.left) {
      mesh.position.x += this.speed * delta
      if (mesh.rotation.z > -this.maxRoll) mesh.rotation.z -= this.rotationSpeed * delta
    }

    if (input.right) {
      mesh.position.x -= this.speed * delta
      if (mesh.rotation.z < this.maxRoll) mesh.rotation.z += this.rotationSpeed * delta
    }

    if (input.up)
      mesh.position.y += this.speed * 0.5 * delta

    if (input.down)
      if (mesh.position.y > this.minHeight) mesh.position.y -= this.speed * 0.5 * delta
  }

  normalizePlane(delta) {
    if (input.keyPressed) return
    const { mesh } = this

    const roll = Math.abs(mesh.rotation.z)
    if (mesh.rotation.z > 0) mesh.rotation.z -= roll * delta * 2
    if (mesh.rotation.z < 0) mesh.rotation.z += roll * delta * 2
  }

  update(delta) {
    this.handleInput(delta)
    this.normalizePlane(delta)
  }
}
