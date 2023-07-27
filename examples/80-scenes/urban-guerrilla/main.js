import { scene, camera, renderer, clock } from '/utils/scene.js'
import { createGraffitiCity } from '/utils/city.js'
import { createSun } from '/utils/light.js'
import { getEmptyCoords } from '/utils/helpers.js'

let player

const mapSize = 200
const coords = getEmptyCoords({ mapSize })

camera.position.set(0, mapSize * .33, mapSize * .9)
camera.lookAt(scene.position)

scene.add(createSun({ pos: [50, 100, 50] }))

const city = createGraffitiCity({ scene, mapSize, coords })
scene.add(city)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()
  player?.update(delta)
  renderer.render(scene, camera)
}()

/* LAZY LOAD */

const { ResistanceFighterPlayer } = await import('/utils/actor/derived/ww2/ResistanceFighter.js')
player = new ResistanceFighterPlayer({ camera, solids: city, pos: coords.pop(), showHealthBar: false })

scene.add(player.mesh)
