import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { createFloor } from '/utils/helpers.js'
import { createLampposts, createCityLights } from '/utils/streetlights.js'
import { createCity } from '/utils/city.js'

const numLampposts = 12 // max num of spotlights is 16
const numCityLights = 16 - numLampposts

const size = 400
const numBuildings = 200

camera.position.set(0, size * .3, size * .4)
createOrbitControls()
renderer.setClearColor(0x070b34)

const floor = createFloor({ size: size * 1.1, circle: false, color: 0x101018 })
const lampposts = createLampposts({ size, numLampposts, circle: false })
const streetLights = createCityLights({ size, numLights: numCityLights })

const city = createCity({ numBuildings, size, circle: false, colorParams: null, rotateEvery: 9 })

scene.add(floor, lampposts, streetLights, city)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()