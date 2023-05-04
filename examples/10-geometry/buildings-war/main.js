import { camera, scene, renderer, createOrbitControls } from '/utils/scene.js'
import { createGround } from '/utils/ground.js'
import { createWarehouse, createWarehouse2, createWarRuin, createRuin, createAirport } from '/utils/city.js'
import { createSun } from '/utils/light.js'

camera.position.set(0, 15, 35)
createOrbitControls()

scene.add(createSun())

const floor = createGround()
scene.add(floor)

const warehouse = createWarehouse()

scene.add(warehouse)
warehouse.translateX(-20)

const warehouse2 = createWarehouse2()
scene.add(warehouse2)
warehouse2.translateZ(20)

const warRuin = createWarRuin()
scene.add(warRuin)

const airport = createAirport()
scene.add(airport)
airport.translateZ(-15)

const ruin = createRuin()
scene.add(ruin)
ruin.translateX(20)

/* UPDATE */

void function update() {
  requestAnimationFrame(update)
  renderer.render(scene, camera)
}()
