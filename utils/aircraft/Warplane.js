import * as THREE from 'three'
import input from '/utils/io/Input.js'
import { loadModel } from '/utils/loaders.js'
import GameObject from '/utils/objects/GameObject.js'
import Missile from './Missile.js'
import { Explosion } from '/utils/classes/Particles.js'
import ChaseCamera from '/utils/actor/ChaseCamera.js'
// aircraft/airplane/messerschmitt-bf-109/scene.gltf
// aircraft/airplane/triplane-sopwith/triplane.fbx
// aircraft/airplane/spitfire-animated/model.fbx

/**
 * aircraft/airplane/av-8/CK2QVW083JBVUYZDHDQJNSVGF.obj
 * aircraft/airplane/av-8/CK2QVW083JBVUYZDHDQJNSVGF.mtl
 *
 * aircraft/airplane/biplane-bristol-f2b/model.fbx
 * aircraft/airplane/biplane-sopwith/model.fbx
 * aircraft/airplane/bomber-lancaster/scene.gltf
 *
 * aircraft/airplane/dornier-do-217/WXSUTGFGGAETK9J6AYCJWA8OO.obj
 * aircraft/airplane/dornier-do-217/WXSUTGFGGAETK9J6AYCJWA8OO.mtl
 *
 * aircraft/airplane/f5/scene.gltf
 * aircraft/airplane/f18/scene.gltf
 * aircraft/airplane/heinkel-he-111/model.fbx
 *
 * aircraft/airplane/junkers-ju-87-stuka/B6L6UIB83ZKUE6YOCT94DAHM3.obj
 * aircraft/airplane/junkers-ju-87-stuka/B6L6UIB83ZKUE6YOCT94DAHM3.mtl
 *
 * aircraft/airplane/messerschmitt-bf-109-pilot/scene.gltf
 * aircraft/airplane/messerschmitt-me-262_10/scene.gltf
 *
 * aircraft/airplane/scifi/NOJ3DF0LP5BRJL8Y6THRU64OT.obj
 * aircraft/airplane/scifi/NOJ3DF0LP5BRJL8Y6THRU64OT.mtl
 */
const mesh = await loadModel({ file: 'aircraft/airplane/spitfire-animated/model.fbx', size: 3, angle: Math.PI })

mesh.traverse(x => console.log(x.name))

export default class Warplane extends GameObject {
  constructor({ camera, speed = 30 } = {}) {
    super({ mesh, shouldClone: false })
    this.name = 'player'
    this.speed = speed
    this.rotationSpeed = .5
    this.position.y = 36
    this.minHeight = this.position.y / 2
    this.maxHeight = this.position.y * 2
    this.maxRoll = Math.PI / 3
    this.missiles = []
    this.last = Date.now()
    this.interval = 500
    this.explosion = new Explosion({ size: 4 })
    this.blows = 0
    this.dead = false

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

    if (mesh.userData.animations) {
      this.mixer = new THREE.AnimationMixer(mesh)
      const action = this.mixer.clipAction(mesh.userData.animations[0])
      action.play()
    }
  }

  get timeToShoot() {
    return Date.now() - this.last >= this.interval
  }

  get dead() {
    return this.mesh.userData.dead
  }

  set dead(bool) {
    this.mesh.userData.dead = bool
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
    this.blows++
    if (this.blows >= 5) this.dead = true

    if (this.smoke) return
    const promise = import('/utils/classes/Particles.js')
    promise.then(obj => {
      const { Smoke } = obj
      this.smoke = new Smoke()
      this.add(this.smoke.mesh)
      this.smoke.mesh.position.z += 7
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
    this.mixer?.update(delta)
    this.smoke?.update({ delta, min: -this.blows, })

    this.chaseCamera?.update(delta)

    this.missiles.forEach(missile => {
      if (missile.dead) this.removeMissile(missile)
      missile.update(delta)
    })

    this.explosion.expand({ velocity: 1.1, maxRounds: 30 })

    if (this.dead) return this.die(delta)

    this.handleInput(delta)
    this.normalizePlane(delta)

    this.checkHit()
  }
}
