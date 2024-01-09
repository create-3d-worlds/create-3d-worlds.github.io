import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { createFloor } from '/utils/ground.js'
import { createNightCity, createLampposts } from '/utils/city.js'
import { getEmptyCoords } from '/utils/helpers.js'
import { createMoon } from '/utils/light.js'

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