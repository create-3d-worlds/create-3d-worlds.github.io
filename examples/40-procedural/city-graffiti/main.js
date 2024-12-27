import { scene, camera, renderer, createOrbitControls } from '/core/scene.js'
import { createGraffitiCity } from '/core/city.js'
import { createSun } from '/core/light.js'

createOrbitControls()

const mapSize = 200

camera.position.set(0, mapSize * .33, mapSize * .9)
camera.lookAt(scene.position)

scene.add(createSun({ pos: [50, 100, 50] }))

const city = createGraffitiCity({ scene, mapSize })
scene.add(city)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  renderer.render(scene, camera)
}()
