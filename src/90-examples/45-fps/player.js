import * as THREE from '/node_modules/three127/build/three.module.js'
import { Capsule } from '/node_modules/three127/examples/jsm/math/Capsule.js'
import { camera } from '/utils/scene.js'
import keyboard from '/classes/Keyboard.js'

/* PLAYER */

export const player = {
  collider: new Capsule(new THREE.Vector3(0, 0.35, 0), new THREE.Vector3(0, 1, 0), 0.35),
  velocity: new THREE.Vector3(),
  direction: new THREE.Vector3(),
  onFloor: false,
}

function getForwardVector() {
  camera.getWorldDirection(player.direction)
  player.direction.y = 0
  player.direction.normalize()
  return player.direction
}

function getSideVector() {
  return getForwardVector().cross(camera.up)
}

export function handleInput(deltaTime) {
  const speed = 25
  const speedDelta = deltaTime * speed
  const speedLogic = deltaTime * (player.onFloor ? speed : speed * .33)

  if (keyboard.up)
    player.velocity.add(getForwardVector().multiplyScalar(speedLogic))

  if (keyboard.down)
    player.velocity.add(getForwardVector().multiplyScalar(-speedLogic))

  if (keyboard.pressed.KeyQ)
    player.velocity.add(getSideVector().multiplyScalar(-speedLogic))

  if (keyboard.pressed.KeyE)
    player.velocity.add(getSideVector().multiplyScalar(speedLogic))

  if (keyboard.left)
    camera.rotation.y += speedDelta * .07

  if (keyboard.right)
    camera.rotation.y -= speedDelta * .07

  if (keyboard.SwipeX)
    camera.rotation.y -= keyboard.SwipeX * speedDelta * .0003

  if (keyboard.SwipeY)
    camera.rotation.x -= keyboard.SwipeY * speedDelta * .0003

  if (player.onFloor && keyboard.pressed.Space)
    player.velocity.y = 15
}
