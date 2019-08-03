import { PointerLockControls } from '../node_modules/three/examples/jsm/controls/PointerLockControls.js'
import { askPointerLock } from './askPointerLock.js'
import { scene, camera, renderer } from '../utils/3d-scene.js'
import {createTerrain, createRandomCubes} from '../utils/3d-helpers.js'
import keyboard from '../classes/Keyboard.js'

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

  if (controls.enabled) { // after browser ask
    raycaster.ray.origin.copy(controls.getObject().position)
    raycaster.ray.origin.y -= 10
    const intersections = raycaster.intersectObjects(cubes.children)
    const isOnObject = intersections.length > 0
    const time = performance.now()
    const delta = (time - prevTime) / 1000
    velocity.x -= velocity.x * 10.0 * delta
    velocity.z -= velocity.z * 10.0 * delta
    velocity.y -= 9.8 * 100.0 * delta // 100.0 = mass
    if (keyboard.pressed.KeyW) velocity.z -= 400.0 * delta
    if (keyboard.pressed.KeyS) velocity.z += 400.0 * delta
    if (keyboard.pressed.KeyA) velocity.x -= 400.0 * delta
    if (keyboard.pressed.KeyD) velocity.x += 400.0 * delta
    if (keyboard.pressed.Space) {
      if (canJump === true) velocity.y += 350
      canJump = false
    }
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

window.addEventListener('resize', handleResize)
