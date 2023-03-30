import { camera, scene, renderer, clock, createOrbitControls } from '/utils/scene.js'
import { createFloor } from '/utils/ground.js'
import { ambLight } from '/utils/light.js'
import { SorceressPlayer } from '/utils/actor/fantasy/Sorceress.js'
import { GolemAI } from '/utils/actor/fantasy/Golem.js'
import { getAllCoords } from '/utils/helpers.js'

const mapSize = 100
const coords = getAllCoords({ mapSize })

ambLight()
camera.position.set(0, 10, 15)
createOrbitControls()

scene.add(createFloor({ size: mapSize }))

const player = new SorceressPlayer()
scene.add(player.mesh)

const npcs = []
for (let i = 0; i < 4; i++) {
  const ai = new GolemAI({ mapSize, coords, baseState: 'patrol', target: player.mesh })
  npcs.push(ai)
  scene.add(ai.mesh)
}

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()

  player.update(delta)
  npcs.forEach(ai => ai.update(delta))

  renderer.render(scene, camera)
}()
