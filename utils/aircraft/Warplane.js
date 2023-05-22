import input from '/utils/io/Input.js'
import GameObject from '/utils/objects/GameObject.js'
import Missile from './Missile.js'
import { Explosion } from '/utils/classes/Particles.js'
import ChaseCamera from '/utils/actor/ChaseCamera.js'

export default class Warplane extends GameObject {
  constructor({ mesh, camera, limit, speed = 45, y = 29 } = {}) {
    super({ mesh, name: 'player' })
    this.speed = speed
    this.limit = limit
    this.rotationSpeed = .75
    this.position.y = y
    this.minHeight = y / 2
    this.maxHeight = y * 2
    this.maxRoll = Math.PI * .4
    this.missiles = []
    this.last = Date.now()
    this.interval = 500
    this.explosion = new Explosion({ size: 4 })
    this.blows = 0
    this.time = 0
    this.propellers = []

    if (camera) {
      this.chaseCamera = new ChaseCamera({
        camera, mesh: this.mesh, rotate: false,
        speed: this.speed * .75,
        offset: [0, 0, this.depth],
        lookAt: [0, 0, 0],
        birdsEyeOffset: [0, this.height * 12, 0],
        birdsEyeLookAt: [0, 0, -this.depth],
      })
      this.chaseCamera.alignCamera()
      this.chaseCamera.far = limit * 2
    }
  }

  get timeToShoot() {
    return Date.now() - this.last >= this.interval
  }

  set propeller(propeller) {
    propeller.position.set(0, .63, -this.depth * .5)
    this.mesh.add(propeller)
    this.propellers.push(propeller)
  }

  addMissile() {
    const pos = this.position.clone()
    pos.y -= this.height * .33
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
      if (mesh.position.x < this.limit) mesh.position.x += this.speed * delta
      if (mesh.rotation.z > -this.maxRoll) mesh.rotation.z -= this.rotationSpeed * delta
    }

    if (input.left) {
      if (mesh.position.x > -this.limit) mesh.position.x -= this.speed * delta
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

    this.mesh.rotateZ(Math.sin(this.time) * .001)
  }

  checkHit() {
    if (!this.hitAmount) return
    this.hitAmount = 0
    this.blows++
    if (this.blows >= 5) this.dead = true

    if (this.smoke) return
    const promise = import('/utils/classes/Particles.js')
    promise.then(obj => {
      const { Smoke } = obj
      this.smoke = new Smoke()
      this.add(this.smoke.mesh)
      this.smoke.mesh.position.y += this.height * .4
      this.smoke.mesh.position.z += this.depth * .4
    })
  }

  die(delta) {
    const { mesh } = this
    if (mesh.position.y > 2) {
      mesh.position.y -= this.speed * 0.5 * delta
      mesh.rotation.z -= this.rotationSpeed * .5 * delta
    } else if (this.speed > 0)
      this.speed -= .1

    this.chaseCamera.offset[1] = this.height * 2
  }

  update(delta) {
    this.chaseCamera?.update(delta)

    this.missiles.forEach(missile => {
      if (missile.dead) this.removeMissile(missile)
      missile.update(delta)
    })

    this.smoke?.update({ delta, min: -this.blows, })
    this.explosion.expand({ velocity: 1.1, maxRounds: 30 })
    this.propellers.forEach(propeller => propeller.rotateZ(delta * -this.speed))

    if (this.dead)
      return this.die(delta)

    this.handleInput(delta)
    this.normalizePlane(delta)

    this.checkHit()

    this.time += delta * 15
  }
}
