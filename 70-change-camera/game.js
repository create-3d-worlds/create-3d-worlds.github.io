import { scene, renderer, clock, camera } from '../utils/three-scene.js'
import { createTrees, createFloor } from '../utils/three-helpers.js'
import keyboard from '../classes/Keyboard.js'
import Avatar from '../classes/Avatar.js'

const avatar = new Avatar()
scene.add(avatar.mesh)
scene.add(createFloor(500, 500, 'ground.jpg'))
scene.add(createTrees())

camera.position.set(0, 200, 350)
camera.lookAt(scene.position)

const chaseCamera = camera.clone()
let currentCamera = camera
scene.add(currentCamera)

const light = new THREE.PointLight(0xffffff)
scene.add(light)

const chooseCamera = () => {
  if (keyboard.pressed.Digit1) currentCamera = camera
  if (keyboard.pressed.Digit2) currentCamera = chaseCamera
}

/* FUNCTIONS */

function updateChaseCamera() {
  const distance = new THREE.Vector3(0, 50, 200)
  const {x, y, z} = distance.applyMatrix4(avatar.mesh.matrixWorld)

  chaseCamera.position.x = x
  chaseCamera.position.y = y
  chaseCamera.position.z = z
}

/* INIT */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  avatar.update(delta)
  updateChaseCamera()
  chooseCamera()
  renderer.render(scene, currentCamera)
}()
