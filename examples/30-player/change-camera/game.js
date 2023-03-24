import * as THREE from 'three'
import { scene, renderer, clock, camera, addUIControls } from '/utils/scene.js'
import { createGround } from '/utils/ground.js'
import { hemLight } from '/utils/light.js'
import { createFirTrees } from '/utils/geometry/trees.js'
import input from '/utils/classes/Input.js'
import Avatar from '/utils/player/Avatar.js'

hemLight({ intensity: 1.25 })

camera.position.z = 30
camera.position.y = 15

const fpsCamera = camera.clone()
let currentCamera = camera

const avatar = new Avatar({ size: 2, autoCamera: false })
scene.add(avatar.mesh, createGround({ file: 'terrain/ground.jpg' }), createFirTrees())

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
  if (input.pressed.Digit1) currentCamera = camera
  if (input.pressed.Digit2) currentCamera = fpsCamera
  if (currentCamera == fpsCamera) followPlayer()
  currentCamera.lookAt(avatar.position)
}

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()
  avatar.update(delta)
  updateCamera()
  renderer.render(scene, currentCamera)
}()
