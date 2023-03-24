import { camera, scene, renderer, createOrbitControls } from '/utils/scene.js'
import { createGround } from '/utils/ground.js'
import { createTexturedBuilding } from '/utils/city.js'
import { createSun } from '/utils/light.js'

camera.position.set(0, 5, 30)

createOrbitControls()

scene.add(createSun())

const floor = createGround()
scene.add(floor)

const building = createTexturedBuilding({ width: 20, height: 10, depth: 10, defaultFile: 'buildings/building-back.png', files: [0, 0, 0, 'buildings/building-front.png'], halfOnSides: true, color: 0xC2B99D })
scene.add(building)
building.translateX(-30)

const greenBlue = createTexturedBuilding({ width: 20, height: 10, depth: 10, defaultFile: 'buildings/building-blue-back.png', files: [0, 0, 0, 'buildings/building-blue-front.png'], halfOnSides: true })
scene.add(greenBlue)

const greenBuilding = createTexturedBuilding({ width: 20, height: 10, depth: 10, defaultFile: 'buildings/building-green-back.png', files: [0, 0, 0, 'buildings/building-green-front.png'], halfOnSides: true, color: 0xB1AFAB })
scene.add(greenBuilding)
greenBuilding.translateX(30)

/* UPDATE */

void function update() {
  requestAnimationFrame(update)
  renderer.render(scene, camera)
}()
