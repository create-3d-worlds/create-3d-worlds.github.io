import * as THREE from '/node_modules/three127/build/three.module.js'
import Physijs from '/libs/physi-ecma.js'
import { renderer, camera } from '/utils/scene.js'
import { initLights } from '/utils/light.js'
import { scene } from '/utils/physics.js'

camera.position.set(0, 30, 80)
scene.setGravity(new THREE.Vector3(0, -100, 20))

initLights({ scene })

const flip_material = Physijs.createMaterial(new THREE.MeshStandardMaterial({ color: 0x44ff44 }), 0, 0)
const slider_material = Physijs.createMaterial(new THREE.MeshStandardMaterial({ color: 0x4444ff }), 0, 0)

const flipperLeftConstraint = createLeftFlipper(flip_material)
const flipperRightConstraint = createRightFlipper(flip_material)
createSliderBottom(slider_material)
createSliderTop(slider_material)
createGroundAndWalls()

const velocity = 10
const acceleration = 20

/* FUNCTIONS */

function addBall() {
  const rangeXMin = -10
  const rangeXMax = 10
  const rangeZMin = -30
  const rangeZMax = 10
  const sphere = new THREE.SphereGeometry(2)
  const sphereMesh = new Physijs.SphereMesh(sphere, Physijs.createMaterial(new THREE.MeshStandardMaterial({ color: 0xff4444 }, 0, 0), 0.001))
  sphereMesh.position.set(Math.random() * (-rangeXMin + rangeXMax) + rangeXMin, 10, Math.random() * (-rangeZMin + rangeZMax) + rangeZMin)
  scene.add(sphereMesh)
}

function flipUp() {
  flipperLeftConstraint.enableAngularMotor(velocity * 1000, acceleration * 1000)
  flipperRightConstraint.enableAngularMotor(-1 * velocity * 1000, acceleration * 1000)
}

function flipDown() {
  flipperLeftConstraint.enableAngularMotor(-1 * velocity * 1000, acceleration * 1000)
  flipperRightConstraint.enableAngularMotor(velocity * 1000, acceleration * 1000)
}

function createGroundAndWalls() {
  const ground_material = Physijs.createMaterial(new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture('/assets/textures/wood_1024.png') }), 0.9, 0.7)
  const ground = new Physijs.BoxMesh(new THREE.BoxGeometry(50, 1, 80), ground_material, 0)
  scene.add(ground)
  const wall_material = Physijs.createMaterial(new THREE.MeshBasicMaterial({ color: 0x000000 }), 0.9, 0.7)
  const wall1 = new Physijs.BoxMesh(new THREE.BoxGeometry(1, 10, 80), wall_material, 0)
  wall1.position.x = -25
  wall1.position.y = 5
  scene.add(wall1)
  const wall2 = new Physijs.BoxMesh(new THREE.BoxGeometry(1, 10, 80), wall_material, 0)
  wall2.position.x = 25
  wall2.position.y = 5
  scene.add(wall2)
  const wall3 = new Physijs.BoxMesh(new THREE.BoxGeometry(50, 10, 1), wall_material, 0)
  wall3.position.y = 5
  wall3.position.z = -40
  scene.add(wall3)
}

function createSliderBottom(mat) {
  const sliderCube = new THREE.BoxGeometry(12, 2, 2)
  const sliderMesh = new Physijs.BoxMesh(sliderCube, mat, 1000)
  sliderMesh.position.x = 0
  sliderMesh.position.y = 2
  sliderMesh.position.z = 5
  scene.add(sliderMesh)
  const constraint = new Physijs.SliderConstraint(sliderMesh, new THREE.Vector3(0, 1, 5), new THREE.Vector3(0, 1, 0))
  scene.addConstraint(constraint)
  constraint.setLimits(-18, 18, 0, 0)
  constraint.setRestitution(0.1, 0.1)
}

function createSliderTop(mat) {
  const sliderSphere = new THREE.BoxGeometry(7, 2, 7)
  const sliderMesh = new Physijs.BoxMesh(sliderSphere, mat, 100)
  sliderMesh.position.z = -15
  sliderMesh.position.x = 2
  sliderMesh.position.y = 1.5
  scene.add(sliderMesh)
  // position is the position of the axis, relative to the ref, based on the current position
  const constraint = new Physijs.SliderConstraint(sliderMesh, new THREE.Vector3(-15, 2, 1.5), new THREE.Vector3(Math.PI / 2, 0, 0))
  scene.addConstraint(constraint)
  constraint.setLimits(-18, 18, 0.5, -0, 5)
  constraint.setRestitution(0.1, 0.1)
}

function createLeftFlipper(mat) {
  const flipperLeft = new Physijs.BoxMesh(new THREE.BoxGeometry(13, 2, 2), mat, 10)
  flipperLeft.position.x = -8
  flipperLeft.position.y = 2
  flipperLeft.position.z = 30
  scene.add(flipperLeft)

  const flipperLeftPivot = new Physijs.SphereMesh(new THREE.BoxGeometry(1, 1, 1), mat, 0)
  flipperLeftPivot.position.y = 2
  flipperLeftPivot.position.x = -15
  flipperLeftPivot.position.z = 30
  flipperLeftPivot.rotation.y = 1.4
  scene.add(flipperLeftPivot)

  const constraint = new Physijs.HingeConstraint(flipperLeft, flipperLeftPivot, flipperLeftPivot.position, new THREE.Vector3(0, 1, 0))
  scene.addConstraint(constraint)
  constraint.setLimits(
    -2.2, // minimum angle of motion, in radians, from the point object 1 starts (going back)
    -0.6, // maximum angle of motion, in radians, from the point object 1 starts (going forward)
    0.3, // applied as a factor to constraint error, how big the kantelpunt is moved when a constraint is hit
    0.5 // controls bounce at limit (0.0 == no bounce)
  )
  return constraint
}

function createRightFlipper(mat) {
  const flipperright = new Physijs.BoxMesh(new THREE.BoxGeometry(13, 2, 2), mat, 10)
  flipperright.position.x = 8
  flipperright.position.y = 2
  flipperright.position.z = 30
  scene.add(flipperright)
  const flipperRightPivot = new Physijs.SphereMesh(new THREE.BoxGeometry(1, 1, 1), mat, 0)

  flipperRightPivot.position.y = 2
  flipperRightPivot.position.x = 15
  flipperRightPivot.position.z = 30
  flipperRightPivot.rotation.y = 1.4
  scene.add(flipperRightPivot)

  // when looking at the axis, the axis of object two are used.
  // rotation and axis are relative to object2.
  const constraint = new Physijs.HingeConstraint(flipperright, flipperRightPivot, flipperRightPivot.position, new THREE.Vector3(0, 1, 0))
  scene.addConstraint(constraint)
  constraint.setLimits(
    -2.2, // minimum angle of motion, in radians, from the point object 1 starts (going back)
    -0.6, // maximum angle of motion, in radians, from the point object 1 starts (going forward)
    0.3, // applied as a factor to constraint error, how big the kantelpunt is moved when a constraint is hit
    0.5 // controls bounce at limit (0.0 == no bounce)
  )
  return constraint
}

/* LOOP */

void function render() {
  requestAnimationFrame(render)
  renderer.render(scene, camera)
  scene.simulate(undefined, 1)
}()

/* EVENTS */

document.addEventListener('keydown', flipUp)
document.addEventListener('keyup', flipDown)
document.addEventListener('click', addBall)
