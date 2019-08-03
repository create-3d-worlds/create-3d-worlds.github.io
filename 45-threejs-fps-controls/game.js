import { PointerLockControls } from '../node_modules/three/examples/jsm/controls/PointerLockControls.js'
import { askPointerLock } from './askPointerLock.js'
import { scene, camera, renderer } from '../utils/3d-scene.js'
import {createTerrain, createRandomCubes} from '../utils/3d-helpers.js'
import keyboard from '../classes/Keyboard.js'

let moveForward = false
let moveBackward = false
let moveLeft = false
let moveRight = false
let canJump = false
let prevTime = performance.now()

const velocity = new THREE.Vector3()

const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75)
light.position.set(0.5, 1, 0.75)
scene.add(light)

const controls = new PointerLockControls(camera)
askPointerLock(controls)
scene.add(controls.getObject())

const cubes = createRandomCubes()
scene.add(cubes)

const raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, - 1, 0), 0, 10)

scene.add(createTerrain())

void function animate() {
  requestAnimationFrame(animate)
  if (controls.enabled) {
    raycaster.ray.origin.copy(controls.getObject().position)
    raycaster.ray.origin.y -= 10
    const intersections = raycaster.intersectObjects(cubes.children)
    const isOnObject = intersections.length > 0
    const time = performance.now()
    const delta = (time - prevTime) / 1000
    velocity.x -= velocity.x * 10.0 * delta
    velocity.z -= velocity.z * 10.0 * delta
    velocity.y -= 9.8 * 100.0 * delta // 100.0 = mass
    if (moveForward) velocity.z -= 400.0 * delta
    if (moveBackward) velocity.z += 400.0 * delta
    if (moveLeft) velocity.x -= 400.0 * delta
    if (moveRight) velocity.x += 400.0 * delta
    if (isOnObject === true) {
      velocity.y = Math.max(0, velocity.y)
      canJump = true
    }
    controls.getObject().translateX(velocity.x * delta)
    controls.getObject().translateY(velocity.y * delta)
    controls.getObject().translateZ(velocity.z * delta)
    if (controls.getObject().position.y < 10) {
      velocity.y = 0
      controls.getObject().position.y = 10
      canJump = true
    }
    prevTime = time
  }
  renderer.render(scene, camera)
}()

/* EVENTS */

function handleResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

const handleKeyDown = function(event) {
  switch (event.keyCode) {
    case 87: // w
      moveForward = true
      break
    case 65: // a
      moveLeft = true; break
    case 83: // s
      moveBackward = true
      break
    case 68: // d
      moveRight = true
      break
    case 32: // space
      if (canJump === true) velocity.y += 350
      canJump = false
      break
  }
}
const handleKeyUp = function(event) {
  switch (event.keyCode) {
    case 87: // w
      moveForward = false
      break
    case 65: // a
      moveLeft = false
      break
    case 83: // s
      moveBackward = false
      break
    case 68: // d
      moveRight = false
      break
  }
}

window.addEventListener('resize', handleResize)
document.addEventListener('keydown', handleKeyDown)
document.addEventListener('keyup', handleKeyUp)