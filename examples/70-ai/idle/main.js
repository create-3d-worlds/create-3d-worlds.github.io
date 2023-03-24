import { camera, scene, renderer, clock, createOrbitControls } from '/utils/scene.js'
import { createFloor } from '/utils/ground.js'
import { ambLight } from '/utils/light.js'
import { SorceressPlayer } from '/utils/actors/fantasy/Sorceress.js'
import { GolemAI } from '/utils/actors/fantasy/Golem.js'

const mapSize = 100
const npcs = []

ambLight()
camera.position.set(0, 10, 15)
createOrbitControls()

scene.add(createFloor({ size: mapSize }))

const player = new SorceressPlayer()
scene.add(player.mesh)

for (let i = 0; i < 10; i++) {
  const ai = new GolemAI({ mapSize, baseState: 'idle' })
  npcs.push(ai)
  scene.add(ai.mesh)
}

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()

  npcs.forEach(ai => ai.update(delta))

  player.update(delta)
  renderer.render(scene, camera)
}()
