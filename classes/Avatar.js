import TWEEN from '../libs/Tween.js'
import {clock} from '../utils/scene.js'
import keyboard from '../classes/Keyboard.js'

const {pressed} = keyboard
const size = 40

export default class Avatar {
  constructor(x = 0, z = 0, scale = 0.2, stoneSkin = true) {
    this.speed = size * 4
    this.createMesh(stoneSkin)
    // this.mesh.scale.set(scale, scale, scale)
    // this.position.set(x, y, z)
    this.jumping = false
  }

  createMesh(stoneSkin) {
    const Material = stoneSkin ? THREE.MeshStandardMaterial : THREE.MeshNormalMaterial
    const material = new Material()
    if (stoneSkin) material.map = new THREE.TextureLoader().load('../assets/textures/snow-512.jpg')
    const body = new THREE.DodecahedronGeometry(size * 2 / 3)
    this.mesh = new THREE.Mesh(body, material)
    this.mesh.translateY(size * 1.1)

    const ud = body.clone().scale(.6, .6, .6)
    this.rightHand = new THREE.Mesh(ud, material)
    this.rightHand.position.set(-size, 0, 0)
    this.add(this.rightHand)

    this.leftHand = new THREE.Mesh(ud, material)
    this.leftHand.position.set(size, 0, 0)
    this.add(this.leftHand)

    this.rightLeg = new THREE.Mesh(ud, material)
    this.rightLeg.position.set(size / 2, -size * 4 / 5, 0)
    this.add(this.rightLeg)

    this.leftLeg = new THREE.Mesh(ud, material)
    this.leftLeg.position.set(-size / 2, -size * 4 / 5, 0)
    this.add(this.leftLeg)
  }

  checkKeys(delta, solids) {
    if (!keyboard.totalPressed) return

    const angle = Math.PI / 2 * delta
    if (pressed.ArrowLeft) this.mesh.rotateY(angle)
    if (pressed.ArrowRight) this.mesh.rotateY(-angle)

    if (solids && this.isCollide(solids)) return

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

  isCollide(solids) {
    const vector = this.chooseRaycastVector()
    if (!vector) return false
    const direction = vector.applyQuaternion(this.mesh.quaternion)
    const raycaster = new THREE.Raycaster(this.position, direction, 0, size)
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
    const elapsed = Math.sin(clock.getElapsedTime() * 6) * size * 3 / 4
    this.leftHand.position.z = -elapsed
    this.rightHand.position.z = elapsed
    this.leftLeg.position.z = -elapsed
    this.rightLeg.position.z = elapsed
  }

  checkGround(terrain) {
    const raycaster = new THREE.Raycaster()
    raycaster.set(this.position, new THREE.Vector3(0, -1, 0))
    const intersects = raycaster.intersectObjects(terrain)
    if (intersects[0]) this.position.y = intersects[0].point.y + size
  }

  jump(distance) {
    if (this.jumping) return
    const time = 600
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

  /* both solids and terrain are optional */
  update(delta, solids, terrain) {
    this.checkKeys(delta, solids)
    const ground = []
    if (terrain) ground.push(terrain)
    if (solids && solids.length) ground.push(...solids)
    if (ground.length) this.checkGround(ground)
    this.animate()
    TWEEN.update()
  }
}
