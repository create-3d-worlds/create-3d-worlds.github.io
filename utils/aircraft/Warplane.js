import { keyboard } from '/utils/io/Keyboard.js'
import GameObject from '/utils/objects/GameObject.js'
import Missile from './Missile.js'
import { Explosion } from '/utils/Particles.js'
import ChaseCamera from '/utils/actor/ChaseCamera.js'

export default class Warplane extends GameObject {
  constructor({ camera, limit, speed = 40, y = 29, ...rest } = {}) {
    super({ name: 'player', energy: 500, ...rest })
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

  /* GETTERS AND SETTERS */

  get timeToShoot() {
    return Date.now() - this.last >= this.interval
  }

  set propeller(propeller) {
    propeller.position.set(0, .63, -this.depth * .5)
    this.mesh.add(propeller)
    this.propellers.push(propeller)
  }

  get inAir() {
    return this.position.y > this.height * 2 / 3
  }

  /* METHODS */

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
    if (this.landing) return
    const { mesh } = this

    if (keyboard.right) {
      if (mesh.position.x < this.limit) mesh.position.x += this.speed * delta
      if (mesh.rotation.z > -this.maxRoll) mesh.rotation.z -= this.rotationSpeed * delta
    }

    if (keyboard.left) {
      if (mesh.position.x > -this.limit) mesh.position.x -= this.speed * delta
      if (mesh.rotation.z < this.maxRoll) mesh.rotation.z += this.rotationSpeed * delta
    }

    if (keyboard.up)
      if (mesh.position.y < this.maxHeight) mesh.position.y += this.speed * 0.5 * delta

    if (keyboard.down)
      if (mesh.position.y > this.minHeight) mesh.position.y -= this.speed * 0.5 * delta

    if (keyboard.attack && this.timeToShoot) {
      this.addMissile()
      this.last = Date.now()
    }
  }

  normalizePlane(delta) {
    if (this.dead || keyboard.controlsPressed) return
    const { mesh } = this

    const roll = Math.abs(mesh.rotation.z)
    if (mesh.rotation.z > 0) mesh.rotation.z -= roll * delta * 2
    if (mesh.rotation.z < 0) mesh.rotation.z += roll * delta * 2

    if (this.inAir) this.mesh.rotateZ(Math.sin(this.time) * .001)
  }

  addSmoke() {
    const promise = import('/utils/Particles.js')
    promise.then(obj => {
      const { Smoke } = obj
      this.smoke = new Smoke()
      this.add(this.smoke.mesh)
      this.smoke.mesh.position.y += this.height * .4
      this.smoke.mesh.position.z += this.depth * .4
    })
  }

  checkHit() {
    if (!this.hitAmount) return

    this.applyDamage()

    if (!this.smoke) this.addSmoke()
  }

  land(delta, broken = false) {
    this.landing = true
    if (this.inAir) {
      this.position.y -= this.speed * 0.5 * delta
      if (broken) this.mesh.rotation.z -= this.rotationSpeed * .5 * delta
    } else {
      this.chaseCamera.offset[1] = this.height * 1.5
      this.chaseCamera.offset[2] = this.depth * 1.5
      if (this.speed > 0) this.speed -= .1
    }
  }

  die(delta) {
    this.land(delta, true)
  }

  update(delta) {
    this.chaseCamera?.update(delta)

    this.missiles.forEach(missile => {
      if (missile.dead) this.removeMissile(missile)
      missile.update(delta)
    })

    this.smoke?.update({ delta, min: (this.energy / 100) - 5 })
    this.explosion.expand({ velocity: 1.1, maxRounds: 30 })
    this.propellers.forEach(propeller => propeller.rotateZ(delta * -this.speed))

    if (this.dead) this.die(delta)

    this.normalizePlane(delta)
    this.checkHit()
    this.handleInput(delta)

    this.time += delta * 15
  }
}
