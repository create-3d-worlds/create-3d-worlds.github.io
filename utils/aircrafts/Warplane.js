import input from '/utils/io/Input.js'
import { loadModel } from '/utils/loaders.js'
import GameObject from '/utils/objects/GameObject.js'
import Missile from './Missile.js'

const mesh = await loadModel({ file: '/aircraft/airplane/messerschmitt-bf-109/scene.gltf', size: 3, angle: Math.PI })

export default class Warplane extends GameObject {
  constructor() {
    super({ mesh })
    this.name = 'player'
    this.position.y = 50
    this.speed = 16
    this.rotationSpeed = .5
    this.minHeight = this.position.y / 2
    this.maxRoll = Math.PI / 3

    this.range = 200
    this.bullets = []
    this.last = Date.now()
    this.interval = 500
  }

  get timeToShoot() {
    return Date.now() - this.last >= this.interval
  }

  addMissile() {
    const pos = this.position.clone()
    pos.y -= this.height * .5
    const missile = new Missile({ pos })
    this.scene.add(missile.mesh)
    this.bullets.push(missile)
  }

  removeMissile(missile) {
    this.bullets.splice(this.bullets.indexOf(missile), 1)
  }

  handleInput(delta) {
    const { mesh } = this

    if (input.right) {
      mesh.position.x += this.speed * delta
      if (mesh.rotation.z > -this.maxRoll) mesh.rotation.z -= this.rotationSpeed * delta
    }

    if (input.left) {
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

    if (input.attack && this.timeToShoot) {
      this.addMissile()
      this.last = Date.now()
    }

    this.bullets.forEach(missile => {
      if (!missile.mesh.parent) this.removeMissile(missile)
      missile.update(delta)
    })
  }
}
