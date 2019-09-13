import * as THREE from '/node_modules/three/build/three.module.js'
import { scene, renderer, clock, camera } from '/utils/scene.js'
import { createFloor } from '/utils/floor.js'
import {createFirTrees} from '/utils/trees.js'
import {keyboard, Player} from '/classes/index.js'

camera.position.z = 500
camera.position.y = 250
const chaseCamera = camera.clone()
let currentCamera = camera

const avatar = new Player()

scene.add(avatar.mesh, createFloor(), createFirTrees(), currentCamera)

/* FUNCTIONS */

function followPlayer() {
  const distance = new THREE.Vector3(0, 50, 100)
  const {x, y, z} = distance.applyMatrix4(avatar.mesh.matrixWorld)
  chaseCamera.position.set(x, y, z)
}

const updateCamera = () => {
  if (keyboard.pressed.Digit1) currentCamera = camera
  if (keyboard.pressed.Digit2) currentCamera = chaseCamera
  if (currentCamera == chaseCamera) followPlayer()
  currentCamera.lookAt(avatar.position)
}

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  avatar.update(delta)
  updateCamera()
  renderer.render(scene, currentCamera)
}()
