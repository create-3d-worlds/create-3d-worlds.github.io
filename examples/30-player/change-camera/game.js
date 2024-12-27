import * as THREE from 'three'
import { scene, renderer, clock, camera } from '/core/scene.js'
import { createGround } from '/core/ground.js'
import { hemLight } from '/core/light.js'
import { createFirTrees } from '/core/geometry/trees.js'
import { keyboard } from '/core/io/Keyboard.js'
import Avatar from '/core/actor/Avatar.js'
import GUI from '/core/io/GUI.js'

hemLight({ intensity: Math.PI * 1.25 })

camera.position.z = 30
camera.position.y = 15

const fpsCamera = camera.clone()
let currentCamera = camera

const avatar = new Avatar({ size: 2, autoCamera: false })
scene.add(avatar.mesh, createGround({ file: 'terrain/ground.jpg' }), createFirTrees())

const controls = { 1: 'Surveillance camera', 2: 'Follow-up camera' }
new GUI({ controls, controlsTitle: 'CAMERA CONTROLS', scoreTitle: '', controlsOpen: true })

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

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()
  avatar.update(delta)
  updateCamera()
  renderer.render(scene, currentCamera)
}()
