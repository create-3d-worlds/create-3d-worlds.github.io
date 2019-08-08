import { scene, renderer } from '../utils/three-scene.js'
import { createTrees, createFloor } from '../utils/three-helpers.js'
import keyboard from '../classes/Keyboard.js'

scene.add(createFloor(500, 500, 'ground.jpg'))
scene.add(createTrees())

const VIEW_ANGLE = 45,
  ASPECT = window.innerWidth / window.innerHeight,
  NEAR = 0.1,
  FAR = 20000

const topCamera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)
scene.add(topCamera)
topCamera.position.set(0, 200, 550)
topCamera.lookAt(scene.position)

const chaseCamera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)
scene.add(chaseCamera)

let camera = topCamera

const light = new THREE.PointLight(0xffffff)
scene.add(light)

const geometry = new THREE.CubeGeometry(10, 10, 10)
const material = new THREE.MeshBasicMaterial()
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

const chooseCamera = () => {
  if (keyboard.pressed.Digit1) return topCamera
  if (keyboard.pressed.Digit2) return chaseCamera
  return camera
}

/* FUNCTIONS */

function updateChaseCamera() {
  const relativeCameraOffset = new THREE.Vector3(0, 50, 200)
  const cameraOffset = relativeCameraOffset.applyMatrix4(cube.matrixWorld)

  chaseCamera.position.x = cameraOffset.x
  chaseCamera.position.y = cameraOffset.y
  chaseCamera.position.z = cameraOffset.z
}

/* INIT */

void function animate() {
  requestAnimationFrame(animate)
  updateChaseCamera()
  camera = chooseCamera()
  renderer.render(scene, camera)
}()
