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

export function playerCollides(bullet) {
  const vector1 = new THREE.Vector3()
  const center = vector1.addVectors(player.collider.start, player.collider.end).multiplyScalar(0.5)
  const bulletCenter = bullet.collider.center

  const r = player.collider.radius + bullet.collider.radius
  const r2 = r * r

  // approximation: player = 3 bullets
  for (const point of [player.collider.start, player.collider.end, center]) {
    const d2 = point.distanceToSquared(bulletCenter)

    if (d2 < r2) {
      const normal = vector1.subVectors(point, bulletCenter).normalize()
      const v1 = new THREE.Vector3().copy(normal).multiplyScalar(normal.dot(player.velocity))
      const v2 = new THREE.Vector3().copy(normal).multiplyScalar(normal.dot(bullet.velocity))

      player.velocity.add(v2).sub(v1)
      bullet.velocity.add(v1).sub(v2)

      const d = (r - Math.sqrt(d2)) / 2
      bulletCenter.addScaledVector(normal, - d)
    }
  }
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

export function checkBulletsCollisions(bullets) {
  for (let i = 0, { length } = bullets; i < length; i ++) {
    const s1 = bullets[i]

    for (let j = i + 1; j < length; j ++) {
      const s2 = bullets[j]

      const d2 = s1.collider.center.distanceToSquared(s2.collider.center)
      const r = s1.collider.radius + s2.collider.radius
      const r2 = r * r

      if (d2 < r2) {
        const normal = new THREE.Vector3().subVectors(s1.collider.center, s2.collider.center).normalize()
        const v1 = new THREE.Vector3().copy(normal).multiplyScalar(normal.dot(s1.velocity))
        const v2 = new THREE.Vector3().copy(normal).multiplyScalar(normal.dot(s2.velocity))

        s1.velocity.add(v2).sub(v1)
        s2.velocity.add(v1).sub(v2)

        const d = (r - Math.sqrt(d2)) / 2

        s1.collider.center.addScaledVector(normal, d)
        s2.collider.center.addScaledVector(normal, - d)
      }
    }
  }
}
