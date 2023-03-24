import { camera, scene, renderer, createOrbitControls } from '/utils/scene.js'
import { createGround } from '/utils/ground.js'
import { createTexturedBuilding } from '/utils/city.js'
import { createSun } from '/utils/light.js'

camera.position.set(0, 15, 35)
createOrbitControls()

scene.add(createSun())

const floor = createGround()
scene.add(floor)

const warehouse = createTexturedBuilding({ width: 20, height: 10, depth: 10, defaultFile: 'buildings/warehouse.jpg', files: [null, null, 'terrain/concrete.jpg'], halfOnSides: true })

scene.add(warehouse)
warehouse.translateX(-20)

const warehouse2 = createTexturedBuilding({ width: 20, height: 10, depth: 20, defaultFile: 'buildings/warehouse.jpg', files: [null, null, 'terrain/concrete.jpg'] })
scene.add(warehouse2)
warehouse2.translateZ(20)

const warRuin = createTexturedBuilding({ width: 12, height: 10, depth: 10, defaultFile: 'buildings/ruin-01.jpg', files: [null, null, 'terrain/beton-krater.jpg'], halfOnSides: true })
scene.add(warRuin)

const airport = createTexturedBuilding({ width: 20, height: 10, depth: 10, defaultFile: 'buildings/airport.png', files: [null, null, 'terrain/beton.gif'], halfOnSides: true })
scene.add(airport)
airport.translateZ(-15)

const ruin = createTexturedBuilding({ width: 15, height: 10, depth: 10, defaultFile: 'buildings/ruin-front.jpg', halfOnSides: true })
scene.add(ruin)
ruin.translateX(20)

/* UPDATE */

void function update() {
  requestAnimationFrame(update)
  renderer.render(scene, camera)
}()
