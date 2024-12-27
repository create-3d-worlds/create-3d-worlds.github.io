import { camera, scene, renderer, clock, createOrbitControls } from '/core/scene.js'
import { createFloor } from '/core/ground.js'
import { ambLight } from '/core/light.js'
import { GolemAI } from '/core/actor/derived/fantasy/Golem.js'
import { SorceressPlayer } from '/core/actor/derived/fantasy/Sorceress.js'
import { getEmptyCoords } from '/core/helpers.js'

const mapSize = 100
const npcs = []
const coords = getEmptyCoords({ mapSize })

ambLight()
camera.position.set(0, 10, 15)
createOrbitControls()

scene.add(createFloor({ size: mapSize }))

const player = new SorceressPlayer()
scene.add(player.mesh)

for (let i = 0; i < 10; i++) {
  const ai = new GolemAI({ mapSize, pos: coords.pop(), baseState: 'flee', target: player.mesh })
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
