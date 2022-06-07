import * as THREE from '/node_modules/three127/build/three.module.js'
import { Octree } from '/node_modules/three127/examples/jsm/math/Octree.js'
import { scene, clock, camera, renderer } from '/utils/scene.js'
import { hemLight } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'
import FPSRenderer from '/classes/2d/FPSRenderer.js'
import { player, handleInput } from './player.js'
import { bullets, GRAVITY, updateBullets } from './bullets.js'

camera.rotation.order = 'YXZ'
renderer.toneMapping = THREE.ACESFilmicToneMapping

hemLight({ intensity: 0.5, groundColor: 0x002244 })

bullets.forEach(bullet => scene.add(bullet.mesh))

const fpsRenderer = new FPSRenderer()

const world = new Octree()

const { mesh } = await loadModel({ file: 'collision-world.glb' })
world.fromGraphNode(mesh)
scene.add(mesh)

/* FUNCTIONS */

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

/* LOOP */

void function gameLoop() {
  const deltaTime = clock.getDelta()
  handleInput(deltaTime)
  updatePlayer(deltaTime)
  updateBullets(deltaTime, world)
  renderer.render(scene, camera)
  fpsRenderer.render(clock.getElapsedTime())
  requestAnimationFrame(gameLoop)
}()
