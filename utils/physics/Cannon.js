import * as THREE from 'three'
import { Ammo } from '/utils/physics/index.js'
import { loadModel } from '/utils/loaders.js'
import Vehicle from '/utils/physics/Vehicle.js'
import { createSphere } from '/utils/geometry/index.js'

const mesh = await loadModel({ file: 'weapon/cannon/mortar/mortar.obj', mtl: 'weapon/cannon/mortar/mortar.mtl', size: 1, angle: Math.PI * .5 })

function createInputRange() {
  const impulse = document.createElement('input')
  impulse.type = 'range'
  impulse.min = 15
  impulse.max = 25
  impulse.step = 0.2
  impulse.style.position = 'absolute'
  document.body.prepend(impulse)
  return impulse
}

export default class Cannon extends Vehicle {
  constructor({ world, ...rest } = {}) {
    super({ mesh, physicsWorld: world.physicsWorld, defaultRadius: .18, wheelFront: { x: .3, y: .12, z: .32 }, wheelBack: { x: .3, y: .18, z: -.56 }, maxEngineForce: 20, mass: 100, ...rest })
    this.world = world
    this.chaseCamera.offset = [0, 1, -2.5]
    this.chaseCamera.lookAt = [0, 1, 0]

    this.impulse = createInputRange()
    this.minImpulse = this.impulse.value = 15
    this.maxImpulse = 25

    document.addEventListener('mouseup', this.shoot)
  }

  shoot = () => {
    const angle = this.mesh.rotation.y
    const x = this.impulse.value * Math.sin(angle)
    const z = this.impulse.value * Math.cos(angle)

    const distance = .7
    const cannonTop = new THREE.Vector3(distance * Math.sin(angle), 0, distance * Math.cos(angle))

    const pos = this.mesh.position.clone()
    pos.y += 0.5
    pos.add(cannonTop)

    const ball = createSphere({ r: .2, color: 0x202020 })
    ball.position.copy(pos)
    this.world.add(ball, 4)

    ball.userData.body.setLinearVelocity(new Ammo.btVector3(x, this.impulse.value * .2, z))
    this.backward(this.impulse.value)
    this.impulse.value = this.minImpulse
  }

  update(dt) {
    super.update(dt)
    if (this.input.pressed.mouse && this.impulse.value < this.maxImpulse)
      this.impulse.value = parseFloat(this.impulse.value) + .2
  }
}