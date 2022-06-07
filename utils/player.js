import * as THREE from '/node_modules/three127/build/three.module.js'
import keyboard from '/classes/Keyboard.js'
import { RIGHT_ANGLE } from '/utils/constants.js'

const gravity = -.9

let velocityY = 0
let jumpImpulse = 0
let onGround = false

function startJump(maxJumpImpulse = 20) {
  if (!onGround) return
  if (jumpImpulse < maxJumpImpulse) jumpImpulse += maxJumpImpulse * .1
  onGround = false
}

function endJump() {
  velocityY = jumpImpulse
  jumpImpulse = 0
}

const checkGround = mesh => {
  if (mesh.position.y < 0) {
    mesh.position.y = 0
    velocityY = 0
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

  if (keyboard.pressed.Space) startJump(speed * 5)

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

window.addEventListener('keyup', e => {
  if (e.code == 'Space') endJump()
})