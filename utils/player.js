import * as THREE from '/node_modules/three127/build/three.module.js'
import keyboard from '/classes/Keyboard.js'
import { RIGHT_ANGLE } from '/utils/constants.js'

const GRAVITY = .9
const FRICTION = .5
const velocity = new THREE.Vector3()

let jumpImpulse = 0
let onGround = false

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

const updateMove = (mesh, deltaTime) => {
  velocity.y -= GRAVITY
  mesh.translateY(velocity.y * deltaTime)
  velocity.x *= FRICTION
  velocity.z *= FRICTION
  mesh.translateX(velocity.x * deltaTime)
  mesh.translateZ(velocity.z * deltaTime)
  checkGround(mesh)
}

export function handleInput(mesh, deltaTime, speed = 4, maxJumpImpulse = speed * 4) {
  const rotateDelta = RIGHT_ANGLE * deltaTime // 90 degrees per second

  updateMove(mesh, deltaTime)

  if (keyboard.pressed.Space) {
    if (!onGround) return
    if (jumpImpulse < maxJumpImpulse) jumpImpulse += maxJumpImpulse * .1
    onGround = false
  }

  if (keyboard.up)
    velocity.z -= speed
  if (keyboard.down)
    velocity.z += speed
  if (keyboard.pressed.KeyQ)
    velocity.x -= speed
  if (keyboard.pressed.KeyE)
    velocity.x += speed

  if (keyboard.left)
    mesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateDelta)
  if (keyboard.right)
    mesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), -rotateDelta)

}

/* EVENTS */

window.addEventListener('keyup', e => {
  if (e.code == 'Space') endJump()
})