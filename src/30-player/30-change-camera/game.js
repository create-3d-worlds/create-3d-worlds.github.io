import * as THREE from '/node_modules/three127/build/three.module.js'
import { scene, renderer, clock, camera, hemLight, addUIControls } from '/utils/scene.js'
import { createGround } from '/utils/ground.js'
import { createFirTrees } from '/utils/trees.js'
import keyboard from '/classes/Keyboard.js'
import Avatar from '/classes/Avatar.js'

hemLight({ intensity: 1.25 })

camera.position.z = 30
camera.position.y = 15

const fpsCamera = camera.clone()
let currentCamera = camera

const avatar = new Avatar({ size: 2, autoCamera: false })
scene.add(avatar.mesh, createGround({ file: 'ground.jpg' }), createFirTrees())

const commands = {
  '1': 'Distant camera',
  '2': 'FPS camera',
}
addUIControls({ commands, title: 'CONTROLS' })

/* FUNCTIONS */

function followPlayer() {
  const distance = new THREE.Vector3(0, 4, 8)
  const { x, y, z } = distance.applyMatrix4(avatar.mesh.matrixWorld)
  fpsCamera.position.set(x, y, z)
}

const updateCamera = () => {
  if (keyboard.pressed.Digit1) currentCamera = camera
  if (keyboard.pressed.Digit2) currentCamera = fpsCamera
  if (currentCamera == fpsCamera) followPlayer()
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
