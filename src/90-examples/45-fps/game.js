import * as THREE from '/node_modules/three127/build/three.module.js'
import { Octree } from '/node_modules/three127/examples/jsm/math/Octree.js'
import { Capsule } from '/node_modules/three127/examples/jsm/math/Capsule.js'
import { scene, clock, camera, renderer } from '/utils/scene.js'
import { hemLight } from '/utils/light.js'
import keyboard from '/classes/Keyboard.js'
import { loadModel } from '/utils/loaders.js'
import { createSphere } from '/utils/balls.js'

camera.rotation.order = 'YXZ'
renderer.toneMapping = THREE.ACESFilmicToneMapping

hemLight({ intensity: 0.5, groundColor: 0x002244 })

const GRAVITY = 30
const NUM_SPHERES = 100
const SPHERE_RADIUS = 0.2
const STEPS_PER_FRAME = 5

const player = {
  collider: new Capsule(new THREE.Vector3(0, 0.35, 0), new THREE.Vector3(0, 1, 0), 0.35),
  velocity: new THREE.Vector3(),
  direction: new THREE.Vector3(),
  onFloor: false,
}

const spheres = []
let sphereIdx = 0

for (let i = 0; i < NUM_SPHERES; i ++) {
  const mesh = createSphere({ r: SPHERE_RADIUS, widthSegments: 10, color: 0xbbbb44 })
  scene.add(mesh)
  spheres.push({
    mesh,
    collider: new THREE.Sphere(new THREE.Vector3(0, - 100, 0), SPHERE_RADIUS),
    velocity: new THREE.Vector3()
  })
}

const worldOctree = new Octree()

let mouseTime = 0

const vector1 = new THREE.Vector3()
const vector2 = new THREE.Vector3()
const vector3 = new THREE.Vector3()

const { mesh } = await loadModel({ file: 'collision-world.glb' })
scene.add(mesh)

worldOctree.fromGraphNode(mesh)

/* FUNCTIONS */

function throwBall() {
  const sphere = spheres[sphereIdx]
  camera.getWorldDirection(player.direction)
  sphere.collider.center.copy(player.collider.end).addScaledVector(player.direction, player.collider.radius * 1.5)

  // throw the ball with more force if we hold the button longer, and if we move forward
  const impulse = 15 + 30 * (1 - Math.exp((mouseTime - performance.now()) * 0.001))

  sphere.velocity.copy(player.direction).multiplyScalar(impulse)
  sphere.velocity.addScaledVector(player.velocity, 2)

  sphereIdx = (sphereIdx + 1) % spheres.length
}

function playerCollisions() {
  const result = worldOctree.capsuleIntersect(player.collider)
  player.onFloor = false
  if (result) {
    player.onFloor = result.normal.y > 0
    if (! player.onFloor)
      player.velocity.addScaledVector(result.normal, - result.normal.dot(player.velocity))
    player.collider.translate(result.normal.multiplyScalar(result.depth))
  }
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

function playerSphereCollision(sphere) {
  const center = vector1.addVectors(player.collider.start, player.collider.end).multiplyScalar(0.5)
  const sphere_center = sphere.collider.center

  const r = player.collider.radius + sphere.collider.radius
  const r2 = r * r

  // approximation: player = 3 spheres
  for (const point of [player.collider.start, player.collider.end, center]) {
    const d2 = point.distanceToSquared(sphere_center)

    if (d2 < r2) {
      const normal = vector1.subVectors(point, sphere_center).normalize()
      const v1 = vector2.copy(normal).multiplyScalar(normal.dot(player.velocity))
      const v2 = vector3.copy(normal).multiplyScalar(normal.dot(sphere.velocity))

      player.velocity.add(v2).sub(v1)
      sphere.velocity.add(v1).sub(v2)

      const d = (r - Math.sqrt(d2)) / 2
      sphere_center.addScaledVector(normal, - d)
    }
  }
}

function spheresCollisions() {
  for (let i = 0, { length } = spheres; i < length; i ++) {
    const s1 = spheres[i]

    for (let j = i + 1; j < length; j ++) {
      const s2 = spheres[j]

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
  spheres.forEach(sphere => {
    sphere.collider.center.addScaledVector(sphere.velocity, deltaTime)
    const result = worldOctree.sphereIntersect(sphere.collider)

    if (result) {
      sphere.velocity.addScaledVector(result.normal, - result.normal.dot(sphere.velocity) * 1.5)
      sphere.collider.center.add(result.normal.multiplyScalar(result.depth))
    } else
      sphere.velocity.y -= GRAVITY * deltaTime

    const damping = Math.exp(- 1.5 * deltaTime) - 1
    sphere.velocity.addScaledVector(sphere.velocity, damping)
    playerSphereCollision(sphere)
  })

  spheresCollisions()
  for (const sphere of spheres)
    sphere.mesh.position.copy(sphere.collider.center)
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

function handleInput(deltaTime) {
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
  mouseTime = performance.now()
})

document.addEventListener('mouseup', () => {
  if (document.pointerLockElement !== null) throwBall()
})

document.body.addEventListener('mousemove', event => {
  if (document.pointerLockElement === document.body) {
    camera.rotation.y -= event.movementX / 500
    camera.rotation.x -= event.movementY / 500
  }
})
