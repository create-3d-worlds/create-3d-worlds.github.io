import { scene, camera, renderer, createOrbitControls, hemLight } from '/utils/scene.js'
import { createGround } from '/utils/ground.js'
import { createCityLights } from '/utils/city.js'
import { createCity } from '/utils/city.js'

hemLight({ intensity: 1.25 })
renderer.setClearColor(0x000000)

const size = 200
const numBuildings = 200

const controls = createOrbitControls()
camera.position.set(0, size * .6, size * 1.1)

const floor = createGround({ size, color: 0x606060 })
const streetLights = createCityLights({ size, numLights: 12 })

const city = createCity({ numBuildings, size, rotateEvery: 2 })

scene.add(floor, streetLights, city)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}()
