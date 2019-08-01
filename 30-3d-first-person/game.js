import {createTree} from '../utils/3d-helpers.js'
import {scene, renderer, camera, clock} from '../utils/3d-scene.js'
import keyboard from '../classes/Keyboard.js'
const {pressed} = keyboard

const container = new THREE.Object3D()
scene.add(container)

camera.position.z = 500
container.add(camera)

const tekstura = new THREE.MeshNormalMaterial()
const telo = new THREE.SphereGeometry(100)
const avatar = new THREE.Mesh(telo, tekstura)
container.add(avatar)

const ud = new THREE.SphereGeometry(50)
const desna_ruka = new THREE.Mesh(ud, tekstura)
desna_ruka.position.set(-150, 0, 0)
avatar.add(desna_ruka)

const leva_ruka = new THREE.Mesh(ud, tekstura)
leva_ruka.position.set(150, 0, 0)
avatar.add(leva_ruka)

const desna_noga = new THREE.Mesh(ud, tekstura)
desna_noga.position.set(70, -120, 0)
avatar.add(desna_noga)

const leva_noga = new THREE.Mesh(ud, tekstura)
leva_noga.position.set(-70, -120, 0)
avatar.add(leva_noga)

/* FUNCTIONS */

function isMoving() {
  return pressed.ArrowRight || pressed.ArrowLeft || pressed.ArrowDown || pressed.ArrowUp
}

function updateWalk() {
  if (!isMoving()) return
  const elapsed = Math.sin(clock.getElapsedTime() * 5) * 100
  leva_ruka.position.z = -elapsed
  desna_ruka.position.z = elapsed
  leva_noga.position.z = -elapsed
  desna_noga.position.z = elapsed
}

function updateAngle() {
  let angle = Math.PI
  if (pressed.ArrowUp) angle = Math.PI
  if (pressed.ArrowDown) angle = 0
  if (pressed.ArrowRight) angle = Math.PI / 2
  if (pressed.ArrowLeft) angle = -Math.PI / 2
  avatar.rotation.y = angle
}

function updatePosition() {
  if (pressed.ArrowLeft) container.position.x -= 10
  if (pressed.ArrowRight) container.position.x += 10
  if (pressed.ArrowUp) container.position.z -= 10
  if (pressed.ArrowDown) container.position.z += 10

  if (pressed.KeyA) camera.position.x += 10
  if (pressed.KeyD) camera.position.x -= 10
}

/* INIT */

[[500, 0], [-500, 0], [300, -200], [-200, -800], [-750, -1000], [500, -1000]]
  .map(pos => scene.add(createTree(...pos)))

void function animate() {
  requestAnimationFrame(animate)
  updatePosition()
  updateAngle()
  updateWalk()
  renderer.render(scene, camera)
}()
