import * as THREE from '/node_modules/three127/build/three.module.js'
import { Capsule } from '/node_modules/three127/examples/jsm/math/Capsule.js'
import { camera } from '/utils/scene.js'
import { createSphere } from '/utils/balls.js'
import keyboard from '/classes/Keyboard.js'

const SPHERE_RADIUS = 0.2

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
  const speedDelta = deltaTime * (player.onFloor ? 25 : 8)

  if (keyboard.up)
    player.velocity.add(getForwardVector().multiplyScalar(speedDelta))

  if (keyboard.down)
    player.velocity.add(getForwardVector().multiplyScalar(-speedDelta))

  if (keyboard.left)
    player.velocity.add(getSideVector().multiplyScalar(-speedDelta))

  if (keyboard.right)
    player.velocity.add(getSideVector().multiplyScalar(speedDelta))

  if (player.onFloor && keyboard.pressed.Space)
    player.velocity.y = 15
}

/* BULLET */

export function createBullet() {
  const mesh = createSphere({ r: SPHERE_RADIUS, widthSegments: 10, color: 0xbbbb44 })
  return {
    mesh,
    collider: new THREE.Sphere(new THREE.Vector3(0, - 100, 0), SPHERE_RADIUS),
    velocity: new THREE.Vector3()
  }
}

export function addBulletVelocity(bullet, holdTime) {
  camera.getWorldDirection(player.direction)
  bullet.collider.center.copy(player.collider.end).addScaledVector(player.direction, player.collider.radius * 1.5)

  // throw the ball with more force if we hold the button longer, and if we move forward
  const impulse = 15 + 30 * (1 - Math.exp((holdTime - performance.now()) * 0.001))

  bullet.velocity.copy(player.direction).multiplyScalar(impulse)
  bullet.velocity.addScaledVector(player.velocity, 2)
}
