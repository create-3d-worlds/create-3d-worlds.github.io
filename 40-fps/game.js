/* global THREEx */
import { scene, camera, renderer, clock } from '../utils/3d-scene.js'
import { createFloor } from '../utils/3d-helpers.js'

const keyboard = new THREEx.KeyboardState()

scene.add(createFloor(1000, 1000))

// //////////
// CUSTOM //
// //////////

// create an array with six textures for a cool cube
const materialArray = []
materialArray.push(new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('images/xpos.png') }))
materialArray.push(new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('images/xneg.png') }))
materialArray.push(new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('images/ypos.png') }))
materialArray.push(new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('images/yneg.png') }))
materialArray.push(new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('images/zpos.png') }))
materialArray.push(new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('images/zneg.png') }))
const cubeMat = new THREE.MeshFaceMaterial(materialArray)
const cubeGeom = new THREE.CubeGeometry(50, 50, 50, 1, 1, 1, materialArray)
const cube = new THREE.Mesh(cubeGeom, cubeMat)
cube.position.set(0, 25.1, 0)
scene.add(cube)

function update() {
  const delta = clock.getDelta() // seconds.
  const moveDistance = 200 * delta // 200 pixels per second
  const rotateAngle = Math.PI / 2 * delta   // pi/2 radians (90 degrees) per second

  // local transformations

  // move forwards/backwards/left/right
  if (keyboard.pressed('W'))
    cube.translateZ(-moveDistance)
  if (keyboard.pressed('S'))
    cube.translateZ(moveDistance)
  if (keyboard.pressed('Q'))
    cube.translateX(-moveDistance)
  if (keyboard.pressed('E'))
    cube.translateX(moveDistance)

  // rotate left/right/up/down
  if (keyboard.pressed('A'))
    cube.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateAngle)
  if (keyboard.pressed('D'))
    cube.rotateOnAxis(new THREE.Vector3(0, 1, 0), -rotateAngle)
  if (keyboard.pressed('R'))
    cube.rotateOnAxis(new THREE.Vector3(1, 0, 0), rotateAngle)
  if (keyboard.pressed('F'))
    cube.rotateOnAxis(new THREE.Vector3(1, 0, 0), -rotateAngle)

  if (keyboard.pressed('Z')) {
    cube.position.set(0, 25.1, 0)
    cube.rotation.set(0, 0, 0)
  }

  const relativeCameraOffset = new THREE.Vector3(0, 50, 200)
  const cameraOffset = relativeCameraOffset.applyMatrix4(cube.matrixWorld)

  camera.position.x = cameraOffset.x
  camera.position.y = cameraOffset.y
  camera.position.z = cameraOffset.z
  camera.lookAt(cube.position)
}

function render() {
  renderer.render(scene, camera)
}

/* INIT */

void function animate() {
  requestAnimationFrame(animate)
  render()
  update()
}()
