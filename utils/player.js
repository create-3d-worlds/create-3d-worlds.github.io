import * as THREE from '/node_modules/three127/build/three.module.js'
import keyboard from '/classes/Keyboard.js'
import { RIGHT_ANGLE } from '/utils/constants.js'

const GRAVITY = .9
const velocity = new THREE.Vector3()

let jumpImpulse = 0
let onGround = false

function startJump(maxJumpImpulse) {
  if (!onGround) return
  if (jumpImpulse < maxJumpImpulse) jumpImpulse += maxJumpImpulse * .1
  onGround = false
}

function endJump() {
  velocity.y = jumpImpulse
  jumpImpulse = 0
}

const checkGround = mesh => {
  if (mesh.position.y < 0) {
    mesh.position.y = 0
    velocity.y = 0
    onGround = true
  }
}

const updateJump = (mesh, delta) => {
  velocity.y -= GRAVITY
  mesh.position.y += velocity.y * delta
  checkGround(mesh)
}

export function handleInput(mesh, delta, speed = 4, maxJumpImpulse = speed * 5) {
  const speedDelta = speed * delta // pixels per second
  const rotateDelta = RIGHT_ANGLE * delta // 90 degrees per second

  updateJump(mesh, delta)

  if (keyboard.pressed.Space) startJump(maxJumpImpulse)

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