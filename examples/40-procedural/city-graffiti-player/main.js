import { scene, camera, renderer, clock, createOrbitControls } from '/utils/scene.js'
import { createGraffitiCity } from '/utils/city.js'
import { createSun } from '/utils/light.js'

createOrbitControls()

const mapSize = 200
let player

camera.position.set(0, mapSize * .33, mapSize * .9)
camera.lookAt(scene.position)

scene.add(createSun({ pos: [50, 100, 50] }))

const city = createGraffitiCity({ scene, mapSize })
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
player = new ResistanceFighterPlayer({ camera, solids: city })
scene.add(player.mesh)
