import * as THREE from '/node_modules/three127/build/three.module.js'
import { Octree } from '/node_modules/three127/examples/jsm/math/Octree.js'
import { scene, clock, camera, renderer } from '/utils/scene.js'
import { hemLight } from '/utils/light.js'

import { loadModel } from '/utils/loaders.js'
import { player, createBullet, handleInput, addBulletVelocity } from './utils.js'

camera.rotation.order = 'YXZ'
renderer.toneMapping = THREE.ACESFilmicToneMapping

hemLight({ intensity: 0.5, groundColor: 0x002244 })

const GRAVITY = 30
const NUM_SPHERES = 100
const STEPS_PER_FRAME = 5

let bulletIdx = 0

const bullets = Array(NUM_SPHERES).fill().map(() => {
  const bullet = createBullet()
  scene.add(bullet.mesh)
  return bullet
})

const world = new Octree()

let holdTime = 0

const vector1 = new THREE.Vector3()
const vector2 = new THREE.Vector3()
const vector3 = new THREE.Vector3()

const { mesh } = await loadModel({ file: 'collision-world.glb' })
world.fromGraphNode(mesh)
scene.add(mesh)

/* FUNCTIONS */

function fireBullet() {
  addBulletVelocity(bullets[bulletIdx], holdTime)
  bulletIdx = (bulletIdx + 1) % bullets.length
}

function playerCollisions() {
  player.onFloor = false
  const result = world.capsuleIntersect(player.collider)
  if (!result) return
  player.onFloor = result.normal.y > 0
  if (!player.onFloor)
    player.velocity.addScaledVector(result.normal, - result.normal.dot(player.velocity))
  player.collider.translate(result.normal.multiplyScalar(result.depth))

}

function updatePlayer(deltaTime) {
  let damping = Math.exp(- 4 * deltaTime) - 1
  if (!player.onFloor) {
    player.velocity.y -= GRAVITY * deltaTime
    damping *= 0.1 // small air resistance
  }

  player.velocity.addScaledVector(player.velocity, damping)
  const deltaPosition = player.velocity.clone().multiplyScalar(deltaTime)
  player.collider.translate(deltaPosition)
  playerCollisions()
  camera.position.copy(player.collider.end) // camera follows player
}

function playerSphereCollision(bullet) {
  const center = vector1.addVectors(player.collider.start, player.collider.end).multiplyScalar(0.5)
  const sphere_center = bullet.collider.center

  const r = player.collider.radius + bullet.collider.radius
  const r2 = r * r

  // approximation: player = 3 bullets
  for (const point of [player.collider.start, player.collider.end, center]) {
    const d2 = point.distanceToSquared(sphere_center)

    if (d2 < r2) {
      const normal = vector1.subVectors(point, sphere_center).normalize()
      const v1 = vector2.copy(normal).multiplyScalar(normal.dot(player.velocity))
      const v2 = vector3.copy(normal).multiplyScalar(normal.dot(bullet.velocity))

      player.velocity.add(v2).sub(v1)
      bullet.velocity.add(v1).sub(v2)

      const d = (r - Math.sqrt(d2)) / 2
      sphere_center.addScaledVector(normal, - d)
    }
  }
}

function spheresCollisions() {
  for (let i = 0, { length } = bullets; i < length; i ++) {
    const s1 = bullets[i]

    for (let j = i + 1; j < length; j ++) {
      const s2 = bullets[j]

      const d2 = s1.collider.center.distanceToSquared(s2.collider.center)
      const r = s1.collider.radius + s2.collider.radius
      const r2 = r * r

      if (d2 < r2) {
        const normal = vector1.subVectors(s1.collider.center, s2.collider.center).normalize()
        const v1 = vector2.copy(normal).multiplyScalar(normal.dot(s1.velocity))
        const v2 = vector3.copy(normal).multiplyScalar(normal.dot(s2.velocity))

        s1.velocity.add(v2).sub(v1)
        s2.velocity.add(v1).sub(v2)

        const d = (r - Math.sqrt(d2)) / 2

        s1.collider.center.addScaledVector(normal, d)
        s2.collider.center.addScaledVector(normal, - d)
      }
    }
  }
}

function updateSpheres(deltaTime) {
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
    playerSphereCollision(bullet)
  })

  spheresCollisions()
  for (const bullet of bullets)
    bullet.mesh.position.copy(bullet.collider.center)
}


// function teleportPlayerIfOob() {
//   if (camera.position.y <= - 25) {
//     console.log('teleport')
//     player.collider.start.set(0, 0.35, 0)
//     player.collider.end.set(0, 1, 0)
//     player.collider.radius = 0.35
//     camera.position.copy(player.collider.end)
//     camera.rotation.set(0, 0, 0)
//   }
// }


/* LOOP */

void function gameLoop() {
  const deltaTime = Math.min(0.05, clock.getDelta()) / STEPS_PER_FRAME

  // check collisions in substeps to mitigate the risk of objects collide too quickly for detection
  for (let i = 0; i < STEPS_PER_FRAME; i ++) {
    handleInput(deltaTime)
    updatePlayer(deltaTime)
    updateSpheres(deltaTime)
    // teleportPlayerIfOob()
  }

  renderer.render(scene, camera)
  requestAnimationFrame(gameLoop)
}()

/* EVENTS */

document.addEventListener('mousedown', () => {
  document.body.requestPointerLock()
  holdTime = performance.now()
})

document.addEventListener('mouseup', () => {
  if (document.pointerLockElement !== null) fireBullet()
})

document.body.addEventListener('mousemove', event => {
  if (document.pointerLockElement === document.body) {
    camera.rotation.y -= event.movementX / 500
    camera.rotation.x -= event.movementY / 500
  }
})
