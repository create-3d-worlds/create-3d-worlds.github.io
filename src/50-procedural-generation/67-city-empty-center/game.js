import { scene, camera, renderer, createOrbitControls, hemLight } from '/utils/scene.js'
import { createFloor } from '/utils/ground.js'
import { createLampposts, createCityLights } from '/utils/city.js'
import { createCity } from '/utils/city.js'

hemLight({ intensity: 1.25 })

const numLampposts = 12 // max num of spotlights is 16
const numCityLights = 16 - numLampposts

const size = 400
const numBuildings = 400

camera.position.set(0, size * .3, size * .4)
createOrbitControls()
renderer.setClearColor(0x070b34)

const floor = createFloor({ size: size * 1.1, color: 0x101018 })
const lampposts = createLampposts({ size, numLampposts, circle: false })
const streetLights = createCityLights({ size, numLights: numCityLights })

const city = createCity({ numBuildings, size, circle: false, colorParams: null, rotateEvery: 9, emptyCenter: 50 })

scene.add(floor, lampposts, streetLights, city)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()