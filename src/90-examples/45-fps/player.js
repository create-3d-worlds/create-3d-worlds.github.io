import * as THREE from '/node_modules/three127/build/three.module.js'
import { Capsule } from '/node_modules/three127/examples/jsm/math/Capsule.js'
import { camera } from '/utils/scene.js'
import keyboard from '/classes/Keyboard.js'
import { GRAVITY } from './bullets.js'

/* PLAYER */

export const player = {
  collider: new Capsule(new THREE.Vector3(0, 0.35, 0), new THREE.Vector3(0, 1, 0), 0.35),
  velocity: new THREE.Vector3(),
  direction: new THREE.Vector3(),
  onGround: false,
}

function getForwardVector() {
  return camera.getWorldDirection(player.direction)
}

function getSideVector() {
  return getForwardVector().cross(camera.up)
}

export function handleInput(deltaTime) {
  const speed = 25
  const speedDelta = deltaTime * speed
  const speedLogic = deltaTime * (player.onGround ? speed : speed * .33)

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

  if (player.onGround && keyboard.pressed.Space)
    player.velocity.y = 15
}

function playerCollidesWorld(world) {
  player.onGround = false
  const result = world.capsuleIntersect(player.collider)
  if (!result) return
  player.onGround = result.normal.y > 0
  if (!player.onGround)
    player.velocity.addScaledVector(result.normal, - result.normal.dot(player.velocity))
  player.collider.translate(result.normal.multiplyScalar(result.depth))
}

export function updatePlayer(deltaTime, world) {
  let damping = Math.exp(- 4 * deltaTime) - 1
  if (!player.onGround) {
    player.velocity.y -= GRAVITY * deltaTime
    damping *= 0.1 // small air resistance
  }

  player.velocity.addScaledVector(player.velocity, damping)
  const deltaPosition = player.velocity.clone().multiplyScalar(deltaTime)
  player.collider.translate(deltaPosition)
  playerCollidesWorld(world)
  camera.position.copy(player.collider.end) // camera follows player
}
