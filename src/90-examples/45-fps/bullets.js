import * as THREE from '/node_modules/three127/build/three.module.js'
import { camera } from '/utils/scene.js'
import { createSphere } from '/utils/geometry.js'
import { player, GRAVITY } from './player.js'

const SPHERE_RADIUS = 0.2
const NUM_SPHERES = 100
const IMPULSE = 50

let bulletIdx = 0
let holdTime = 0

export const bullets = Array(NUM_SPHERES).fill().map(() => createBullet())

function createBullet() {
  const mesh = createSphere({ r: SPHERE_RADIUS, widthSegments: 10, color: 0x333333 })
  return {
    mesh,
    collider: new THREE.Sphere(new THREE.Vector3(0, - 100, 0), SPHERE_RADIUS),
    velocity: new THREE.Vector3()
  }
}

function addBulletVelocity(bullet, holdTime) {
  camera.getWorldDirection(player.direction)
  bullet.collider.center.copy(player.collider.end).addScaledVector(player.direction, player.collider.radius * 1.5)

  // throw the ball with more force if we hold the button longer, and if we move forward
  const impulse = IMPULSE * .5 + IMPULSE * (1 - Math.exp((holdTime - performance.now()) * 0.001))

  bullet.velocity.copy(player.direction).multiplyScalar(impulse)
  bullet.velocity.addScaledVector(player.velocity, 2)
}

export function fireBullet() {
  addBulletVelocity(bullets[bulletIdx], holdTime)
  bulletIdx = (bulletIdx + 1) % bullets.length
}

function checkBulletsCollisions(bullets) {
  for (let i = 0, { length } = bullets; i < length; i++) {
    const bullet = bullets[i]

    for (let j = i + 1; j < length; j++) {
      const bullet2 = bullets[j]

      const d2 = bullet.collider.center.distanceToSquared(bullet2.collider.center)
      const r = bullet.collider.radius + bullet2.collider.radius
      const r2 = r * r

      if (d2 < r2) {
        const normal = new THREE.Vector3().subVectors(bullet.collider.center, bullet2.collider.center).normalize()
        const v1 = new THREE.Vector3().copy(normal).multiplyScalar(normal.dot(bullet.velocity))
        const v2 = new THREE.Vector3().copy(normal).multiplyScalar(normal.dot(bullet2.velocity))

        bullet.velocity.add(v2).sub(v1)
        bullet2.velocity.add(v1).sub(v2)

        const d = (r - Math.sqrt(d2)) / 2

        bullet.collider.center.addScaledVector(normal, d)
        bullet2.collider.center.addScaledVector(normal, - d)
      }
    }
  }
}

export function updateBullets(deltaTime, world) {
  bullets.forEach(bullet => {
    bullet.collider.center.addScaledVector(bullet.velocity, deltaTime)
    const result = world.sphereIntersect(bullet.collider)

    if (result) {
      bullet.velocity.addScaledVector(result.normal, - result.normal.dot(bullet.velocity) * 1.5)
      bullet.collider.center.add(result.normal.multiplyScalar(result.depth))
    } else
      bullet.velocity.y -= GRAVITY * deltaTime

    const damping = Math.exp(- 1.5 * deltaTime) - 1
    bullet.velocity.addScaledVector(bullet.velocity, damping)
    bullet.mesh.position.copy(bullet.collider.center)
  })

  checkBulletsCollisions(bullets)
}

/* EVENTS */

document.addEventListener('mousedown', () => {
  holdTime = performance.now()
})

document.addEventListener('mouseup', fireBullet)
