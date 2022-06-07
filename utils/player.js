import * as THREE from '/node_modules/three127/build/three.module.js'
import keyboard from '/classes/Keyboard.js'
import { RIGHT_ANGLE } from '/utils/constants.js'

let velocityY = 0.0
const gravity = -0.9
let onGround = false
const jumpImpulse = 20
const minJumpImpulse = 2

function startJump() {
  if (!onGround) return
  velocityY = jumpImpulse
  onGround = false
}

function endJump() {
  if (velocityY > minJumpImpulse)
    velocityY = minJumpImpulse
}

const checkGround = mesh => {
  if (mesh.position.y < 0.0) {
    mesh.position.y = 0.0
    velocityY = 0.0
    onGround = true
  }
}

const updateJump = (mesh, delta) => {
  velocityY += gravity
  mesh.position.y += velocityY * delta
  checkGround(mesh)
}

export function handleInput(mesh, delta, speed = 4) {
  const speedDelta = speed * delta // pixels per second
  const rotateDelta = RIGHT_ANGLE * delta // 90 degrees per second

  updateJump(mesh, delta)

  if (keyboard.up)
    mesh.translateZ(-speedDelta)
  if (keyboard.down)
    mesh.translateZ(speedDelta)
  if (keyboard.pressed.KeyQ)
    mesh.translateX(-speedDelta)
  if (keyboard.pressed.KeyE)
    mesh.translateX(speedDelta)

  if (keyboard.left)
    mesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateDelta)
  if (keyboard.right)
    mesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), -rotateDelta)
}

/* EVENTS */

window.addEventListener('keydown', e => {
  if (e.code == 'Space') startJump()
})
window.addEventListener('keyup', e => {
  if (e.code == 'Space') endJump()
})