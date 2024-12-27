import { scene, camera, renderer, createOrbitControls } from '/core/scene.js'
import { createFloor } from '/core/ground.js'
import { createNightCity, createLampposts } from '/core/city.js'
import { getEmptyCoords } from '/core/helpers.js'
import { createMoon } from '/core/light.js'

const mapSize = 400
const center = 50
const numBuildings = 300

scene.add(createMoon())

camera.position.set(0, mapSize * .3, mapSize * .4)
createOrbitControls()
renderer.setClearColor(0x070b34)

const floor = createFloor({ size: mapSize * 1.1 })
scene.add(floor)

const city = createNightCity({ mapSize, numBuildings, emptyCenter: center, numLampposts: 4 })
scene.add(city)

const coords = getEmptyCoords({ mapSize: center * 1.25, fieldSize: 10 })
scene.add(createLampposts({ coords, numLampposts: 4 }))

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  renderer.render(scene, camera)
}()