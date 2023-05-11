import input from '/utils/io/Input.js'
import { loadModel } from '/utils/loaders.js'
import GameObject from '/utils/objects/GameObject.js'
import Missile from './Missile.js'
import { Explosion } from '/utils/classes/Particles.js'
import ChaseCamera from '/utils/actor/ChaseCamera.js'

const mesh = await loadModel({ file: '/aircraft/airplane/messerschmitt-bf-109/scene.gltf', size: 3, angle: Math.PI })

export default class Warplane extends GameObject {
  constructor({ camera, speed = 30 } = {}) {
    super({ mesh })
    this.name = 'player'
    this.speed = speed
    this.rotationSpeed = .5
    this.position.y = 40
    this.minHeight = this.position.y / 2
    this.maxHeight = this.position.y * 2
    this.maxRoll = Math.PI / 3
    this.missiles = []
    this.last = Date.now()
    this.interval = 500
    this.explosion = new Explosion({ size: 4 })
    this.blows = 0

    if (camera) {
      this.chaseCamera = new ChaseCamera({
        camera, mesh: this.mesh, speed: 5, rotate: false,
        offset: [0, this.height * .25, this.height * 5.5],
        lookAt: [0, -this.height * 1.75, 0],
        birdsEyeOffset: [0, this.height * 12, 0],
        birdsEyeLookAt: [0, 0, -this.height * 5],
      })
      this.chaseCamera.alignCamera()
    }
  }

  get timeToShoot() {
    return Date.now() - this.last >= this.interval
  }

  addMissile() {
    const pos = this.position.clone()
    pos.y -= this.height * .5
    const missile = new Missile({ pos, explosion: this.explosion })
    this.scene.add(missile.mesh)
    this.missiles.push(missile)
    this.scene.add(this.explosion.mesh)
  }

  removeMissile(missile) {
    this.scene.remove(missile.mesh)
    this.missiles.splice(this.missiles.indexOf(missile), 1)
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
      if (mesh.position.y < this.maxHeight) mesh.position.y += this.speed * 0.5 * delta

    if (input.down)
      if (mesh.position.y > this.minHeight) mesh.position.y -= this.speed * 0.5 * delta

    if (input.attack && this.timeToShoot) {
      this.addMissile()
      this.last = Date.now()
    }
  }

  normalizePlane(delta) {
    if (input.controlsPressed) return
    const { mesh } = this

    const roll = Math.abs(mesh.rotation.z)
    if (mesh.rotation.z > 0) mesh.rotation.z -= roll * delta * 2
    if (mesh.rotation.z < 0) mesh.rotation.z += roll * delta * 2
  }

  checkHit() {
    if (!this.mesh.userData.hitAmount) return
    this.mesh.userData.hitAmount = 0
    this.blows ++

    if (this.smoke) return

    const promise = import('/utils/classes/Particles.js')
    promise.then(obj => {
      const { Smoke } = obj
      this.smoke = new Smoke()
      this.add(this.smoke.mesh)
      this.smoke.mesh.position.z += 7
    })
  }

  update(delta) {
    this.handleInput(delta)
    this.normalizePlane(delta)

    this.checkHit()
    this.smoke?.update({ delta, min: -this.blows, })

    this.missiles.forEach(missile => {
      if (missile.dead) this.removeMissile(missile)
      missile.update(delta)
    })

    this.chaseCamera?.update(delta)
    this.explosion.expand({ velocity: 1.1, maxRounds: 30 })
  }
}
