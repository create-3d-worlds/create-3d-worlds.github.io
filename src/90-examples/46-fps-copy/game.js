import * as THREE from '/node_modules/three127/build/three.module.js'
import { Octree } from '/node_modules/three127/examples/jsm/math/Octree.js'
import { scene, clock, camera, renderer } from '/utils/scene.js'
import { hemLight } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'
import FPSRenderer from '/classes/2d/FPSRenderer.js'
import { createCrate } from '/utils/boxes.js'
import { handleInput } from '/utils/player.js'

const player = createCrate({ size: 1 })
scene.add(player)

camera.rotation.order = 'YXZ'
renderer.toneMapping = THREE.ACESFilmicToneMapping

hemLight({ intensity: 0.5, groundColor: 0x002244 })

const fpsRenderer = new FPSRenderer()

const world = new Octree()

const { mesh } = await loadModel({ file: 'collision-world.glb' })
world.fromGraphNode(mesh)
scene.add(mesh)

camera.position.set(0, 1, 0)
player.add(camera)

/* LOOP */

void function gameLoop() {
  const deltaTime = clock.getDelta()
  handleInput(player, deltaTime)
  renderer.render(scene, camera)
  fpsRenderer.render(clock.getElapsedTime())
  requestAnimationFrame(gameLoop)
}()
