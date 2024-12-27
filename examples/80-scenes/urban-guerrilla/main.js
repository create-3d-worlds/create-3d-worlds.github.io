import { scene, camera, renderer, clock } from '/core/scene.js'
import { createGraffitiCity } from '/core/city.js'
import { createSun } from '/core/light.js'
import { getEmptyCoords } from '/core/helpers.js'

let player

const mapSize = 200
const coords = getEmptyCoords({ mapSize })

camera.position.set(0, mapSize * .33, mapSize * .9)
camera.lookAt(scene.position)

scene.add(createSun({ pos: [50, 100, 50], intensity: 2 * Math.PI }))

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

const { ResistanceFighterPlayer } = await import('/core/actor/derived/ww2/ResistanceFighter.js')
player = new ResistanceFighterPlayer({ camera, solids: city, pos: coords.pop(), showHealthBar: false })

scene.add(player.mesh)
