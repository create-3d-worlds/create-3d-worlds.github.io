import TWEEN from '../libs/Tween.js'
import {clock} from '../utils/scene.js'
import keyboard from '../classes/Keyboard.js'

const {pressed} = keyboard

export default class Avatar {
  constructor(x = 0, y = 0, z = 0, size = 35, stoneSkin = true) {
    this.size = size
    this.speed = size * 4
    this.ground = []
    this.surrounding = []
    this.jumping = false
    this.createMesh(stoneSkin)
    this.position.set(x, y, z)
  }

  createMesh(stoneSkin) {
    const group = new THREE.Group()
    const Material = stoneSkin ? THREE.MeshStandardMaterial : THREE.MeshNormalMaterial
    const material = new Material()
    if (stoneSkin) material.map = new THREE.TextureLoader().load('../assets/textures/snow-512.jpg')
    const bodyGeo = new THREE.DodecahedronGeometry(this.size * .66)
    const body = new THREE.Mesh(bodyGeo, material)
    body.position.set(0, this.size, 0)
    group.add(body)

    const limbGeo = bodyGeo.clone().scale(.6, .6, .6)
    this.rightHand = new THREE.Mesh(limbGeo, material)
    this.rightHand.position.set(-this.size, this.size, 0)
    group.add(this.rightHand)

    this.leftHand = new THREE.Mesh(limbGeo, material)
    this.leftHand.position.set(this.size, this.size, 0)
    group.add(this.leftHand)

    this.rightLeg = new THREE.Mesh(limbGeo, material)
    this.rightLeg.position.set(this.size / 2, this.size * .3, 0)
    group.add(this.rightLeg)

    this.leftLeg = new THREE.Mesh(limbGeo, material)
    this.leftLeg.position.set(-this.size / 2, this.size * .3, 0)
    group.add(this.leftLeg)
    this.mesh = group
  }

  checkKeys(delta) {
    if (!keyboard.totalPressed) return

    const angle = Math.PI / 2 * delta
    if (pressed.ArrowLeft) this.mesh.rotateY(angle)
    if (pressed.ArrowRight) this.mesh.rotateY(-angle)

    if (this.surrounding.length && this.isCollide(this.surrounding)) return

    const distance = this.speed * delta // speed (in pixels) per second
    if (pressed.KeyW || pressed.ArrowUp) this.mesh.translateZ(-distance)
    if (pressed.KeyS || pressed.ArrowDown) this.mesh.translateZ(distance)
    if (pressed.KeyA) this.mesh.translateX(-distance)
    if (pressed.KeyD) this.mesh.translateX(distance)
    if (pressed.Space) this.jump(distance * 20)
  }

  chooseRaycastVector() {
    // TODO: dodati zrak za medjuuglove, kada su pritisnute dve tipke
    if (pressed.KeyW || pressed.ArrowUp) return new THREE.Vector3(0, 0, -1)
    if (pressed.KeyS || pressed.ArrowDown) return new THREE.Vector3(0, 0, 1)
    if (pressed.KeyA) return new THREE.Vector3(-1, 0, 0)
    if (pressed.KeyD) return new THREE.Vector3(1, 0, 0)
    if (pressed.Space) return new THREE.Vector3(0, 1, 0)
    return null
  }

  // TODO: separate helper
  isCollide(solids) {
    const vector = this.chooseRaycastVector()
    if (!vector) return false
    const direction = vector.applyQuaternion(this.mesh.quaternion)
    const pos = this.position.clone()
    pos.y += this.size
    const raycaster = new THREE.Raycaster(pos, direction, 0, this.size)
    const intersections = raycaster.intersectObjects(solids, true)
    return intersections.length > 0
  }

  add(child) {
    this.mesh.add(child)
  }

  get position() {
    return this.mesh.position
  }

  get rotation() {
    return this.mesh.rotation
  }

  animate() {
    if (!keyboard.totalPressed) return
    const elapsed = Math.sin(clock.getElapsedTime() * 6) * this.size * 3 / 4
    this.leftHand.position.z = -elapsed
    this.rightHand.position.z = elapsed
    this.leftLeg.position.z = -elapsed
    this.rightLeg.position.z = elapsed
  }

  checkGround() {
    if (!this.ground.length) return
    const pos = this.position.clone()
    pos.y += this.size
    const raycaster = new THREE.Raycaster(pos, new THREE.Vector3(0, -1, 0))
    const intersects = raycaster.intersectObjects(this.ground)
    if (intersects[0]) this.position.y = intersects[0].point.y // TODO: falling transition
  }

  // TODO: remove TWEEN, fix jump (vidi skakanje po kockama)
  jump(distance) {
    if (this.jumping) return
    const time = 500
    const up = { y: this.position.y + distance * 2}
    const down = { y: this.position.y }
    const current = { y: this.position.y }
    this.jumping = true

    const jumpUp = new TWEEN.Tween(current)
      .to(up, time)
      .onUpdate(() => {
        this.position.y = current.y
      })

    const jumpDown = new TWEEN.Tween(current)
      .to(down, time)
      .onUpdate(() => {
        this.position.y = current.y
      })
      .onComplete(() => {
        this.jumping = false
      })

    jumpUp.chain(jumpDown)
    jumpUp.start()
  }

  addSolid(prop, ...solids) {
    solids.forEach(solid => {
      if (solid.children.length) this[prop].push(...solid.children)
      else if (solid.length) this[prop].push(...solid)
      else this[prop].push(solid)
    })
  }

  addGround(...grounds) {
    this.addSolid('ground', ...grounds)
  }

  addSurrounding(...surroundings) {
    this.addSolid('surrounding', ...surroundings)
  }

  update(delta) {
    this.checkKeys(delta)
    this.checkGround()
    this.animate()
    TWEEN.update()
  }
}
