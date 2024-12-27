import { camera, scene, renderer, clock, createOrbitControls } from '/core/scene.js'
import { createFloor } from '/core/ground.js'
import { ambLight } from '/core/light.js'
import { SorceressPlayer } from '/core/actor/derived/fantasy/Sorceress.js'
import { GolemAI } from '/core/actor/derived/fantasy/Golem.js'
import { getEmptyCoords } from '/core/helpers.js'

const mapSize = 100
const coords = getEmptyCoords({ mapSize })

ambLight()
camera.position.set(0, 10, 15)
createOrbitControls()

scene.add(createFloor({ size: mapSize }))

const player = new SorceressPlayer()
scene.add(player.mesh)

const npcs = []
for (let i = 0; i < 4; i++) {
  const ai = new GolemAI({ mapSize, pos: coords.pop(), baseState: 'patrol', target: player.mesh })
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
