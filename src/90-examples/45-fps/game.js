import * as THREE from '/node_modules/three127/build/three.module.js'
import { Octree } from '/node_modules/three127/examples/jsm/math/Octree.js'
import { scene, clock, camera, renderer } from '/utils/scene.js'
import { hemLight } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'
import { player, createBullet, handleInput, addBulletVelocity, playerCollides, checkBulletsCollisions } from './utils.js'
import FPSRenderer from '/classes/2d/FPSRenderer.js'
import keyboard from '/classes/Keyboard.js'

camera.rotation.order = 'YXZ'
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.domElement.style.cursor = 'none'

hemLight({ intensity: 0.5, groundColor: 0x002244 })

const GRAVITY = 30
const NUM_SPHERES = 100

let bulletIdx = 0

const fpsRenderer = new FPSRenderer()

const bullets = Array(NUM_SPHERES).fill().map(() => {
  const bullet = createBullet()
  scene.add(bullet.mesh)
  return bullet
})

const world = new Octree()

let holdTime = 0

const { mesh } = await loadModel({ file: 'collision-world.glb' })
world.fromGraphNode(mesh)
scene.add(mesh)

/* FUNCTIONS */

function fireBullet() {
  addBulletVelocity(bullets[bulletIdx], holdTime)
  bulletIdx = (bulletIdx + 1) % bullets.length
}

function playerCollidesWorld() {
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
  playerCollidesWorld()
  camera.position.copy(player.collider.end) // camera follows player
}

function updateBullets(deltaTime) {
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
    playerCollides(bullet)
  })

  checkBulletsCollisions(bullets)
  for (const bullet of bullets)
    bullet.mesh.position.copy(bullet.collider.center)
}

/* LOOP */

void function gameLoop() {
  const deltaTime = clock.getDelta()
  handleInput(deltaTime)
  updatePlayer(deltaTime)
  updateBullets(deltaTime)
  renderer.render(scene, camera)
  fpsRenderer.render(clock.getElapsedTime())
  requestAnimationFrame(gameLoop)
}()

/* EVENTS */

document.addEventListener('mousedown', () => {
  holdTime = performance.now()
})

document.addEventListener('mouseup', fireBullet)

document.body.addEventListener('mousemove', e => {
  if (!keyboard.pressed.mouse) return
  // TODO: ne mrdati levo/desno kada ide gore/dole
  // camera.rotation.x -= e.movementY / 500
})
