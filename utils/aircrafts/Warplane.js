import * as THREE from 'three'
import input from '/utils/io/Input.js'
import { loadModel } from '/utils/loaders.js'
import GameObject from '/utils/objects/GameObject.js'

const material = new THREE.MeshBasicMaterial({ color: 0x333333 })
const geometry = new THREE.CylinderGeometry(.5, .5, 2)
const cylinder = new THREE.Mesh(geometry, material)
cylinder.rotateX(Math.PI * .5)

class Missile extends GameObject {
  constructor({ pos } = {}) {
    super({ mesh: cylinder, pos })
    this.speed = .2
    this.maxRange = 300
    this.initPosition = pos.clone()
  }

  get target() {
    const position = new THREE.Vector3().addVectors(this.position, { x: 0, y: -50, z: -100 })
    const direction = new THREE.Vector3().subVectors(position, this.position).normalize()
    return new THREE.Vector3().addVectors(this.position, direction.multiplyScalar(this.maxRange))
  }

  update(delta) {
    this.position.lerp(this.target, this.speed * delta)

    if (this.position.y < 0) this.dispose()
  }
}

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

  addBullet() {
    const pos = this.position.clone()
    const bullet = new Missile({ pos })
    this.scene.add(bullet.mesh)
    this.bullets.push(bullet)
  }

  removeBullet(bullet) {
    this.bullets.splice(this.bullets.indexOf(bullet), 1)
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
      this.addBullet()
      this.last = Date.now()
    }

    this.bullets.forEach(bullet => {
      if (!bullet.mesh.parent) this.removeBullet(bullet)
      bullet.update(delta)
    })
  }
}
