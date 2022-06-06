import * as THREE from '/node_modules/three127/build/three.module.js'
import keyboard from '/classes/Keyboard.js'
import { RIGHT_ANGLE } from '/utils/constants.js'

export function handleInput(mesh, delta) {
  const moveDistance = 20 * delta // pixels per second
  const rotateAngle = RIGHT_ANGLE * delta // 90 degrees per second

  if (keyboard.pressed.KeyW)
    mesh.translateZ(-moveDistance)
  if (keyboard.pressed.KeyS)
    mesh.translateZ(moveDistance)
  if (keyboard.pressed.KeyQ)
    mesh.translateX(-moveDistance)
  if (keyboard.pressed.KeyE)
    mesh.translateX(moveDistance)

  if (keyboard.pressed.KeyA)
    mesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateAngle)
  if (keyboard.pressed.KeyD)
    mesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), -rotateAngle)
  if (keyboard.pressed.KeyR)
    mesh.rotateOnAxis(new THREE.Vector3(1, 0, 0), rotateAngle)
  if (keyboard.pressed.KeyF)
    mesh.rotateOnAxis(new THREE.Vector3(1, 0, 0), -rotateAngle)

  if (keyboard.pressed.ArrowLeft)
    mesh.position.x -= moveDistance
  if (keyboard.pressed.ArrowRight)
    mesh.position.x += moveDistance
  if (keyboard.pressed.ArrowUp)
    mesh.position.z -= moveDistance
  if (keyboard.pressed.ArrowDown)
    mesh.position.z += moveDistance
}
