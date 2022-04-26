import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { createFloor } from '/utils/helpers.js'
import { createCityLights } from '/utils/streetlights.js'
import { createCity } from '/utils/city.js'

const size = 200
const numBuildings = 200

const controls = createOrbitControls()
camera.position.set(0, size * .6, size * 1.1)

const floor = createFloor({ size, color: 0x606060 })
const streetLights = createCityLights({ size, numLights: 12 })

const city = createCity({ numBuildings, size, rotateEvery: 2 })

scene.add(floor, streetLights, city)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}()
