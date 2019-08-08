import { scene, renderer, camera } from '../utils/three-scene.js'
import keyboard from '../classes/Keyboard.js'

let chaseCameraActive = false

const VIEW_ANGLE = 45,
  ASPECT = window.innerWidth / window.innerHeight,
  NEAR = 0.1,
  FAR = 20000

// camera 1
const topCamera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)
scene.add(topCamera)
topCamera.position.set(0, 200, 550)
topCamera.lookAt(scene.position)
// camera 2
const chaseCamera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)
scene.add(chaseCamera)

const light = new THREE.PointLight(0xffffff)
scene.add(light)

const floorMaterial = new THREE.MeshBasicMaterial({
  side: THREE.DoubleSide
})
const floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10)
const floor = new THREE.Mesh(floorGeometry, floorMaterial)
floor.rotation.x = Math.PI / 2
scene.add(floor)

// create cube
const geometry = new THREE.CubeGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial()
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

// torus knot
let colorMaterial = new THREE.MeshPhongMaterial({
  color: 0xff3333
})
let shape = THREE.SceneUtils.createMultiMaterialObject(
  new THREE.TorusKnotGeometry(30, 6, 160, 10, 2, 5), [colorMaterial, material])
shape.position.set(-200, 50, -200)
scene.add(shape)
// torus knot
colorMaterial = new THREE.MeshPhongMaterial({
  color: 0x33ff33
})
shape = THREE.SceneUtils.createMultiMaterialObject(
  new THREE.TorusKnotGeometry(30, 6, 160, 10, 3, 2), [colorMaterial, material])
shape.position.set(200, 50, -200)
scene.add(shape)

/* FUNCTIONS */

function updateCamera() {
  const relativeCameraOffset = new THREE.Vector3(0, 50, 200)
  const cameraOffset = relativeCameraOffset.applyMatrix4(cube.matrixWorld)

  chaseCamera.position.x = cameraOffset.x
  chaseCamera.position.y = cameraOffset.y
  chaseCamera.position.z = cameraOffset.z

  if (keyboard.pressed.Digit1) chaseCameraActive = true
  if (keyboard.pressed.Digit2) chaseCameraActive = false
}

/* INIT */

void function animate() {
  requestAnimationFrame(animate)
  updateCamera()
  if (chaseCameraActive)
    renderer.render(scene, chaseCamera)
  else
    renderer.render(scene, topCamera)
}()
