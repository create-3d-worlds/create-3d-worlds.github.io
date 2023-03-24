import { scene, camera, renderer, setBackground, createOrbitControls } from '/utils/scene.js'
import { createFloor } from '/utils/ground.js'
import { createNightCity } from '/utils/city.js'
import { createMoon } from '/utils/light.js'

setBackground(0x070b34)

const mapSize = 400

camera.position.set(0, mapSize * .3, mapSize * .4)
createOrbitControls()

const floor = createFloor({ size: mapSize * 1.1, color: 0x101018 })

const city = createNightCity({ mapSize, numTrees: 50 })

scene.add(floor, city)

scene.add(createMoon())

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  renderer.render(scene, camera)
}()