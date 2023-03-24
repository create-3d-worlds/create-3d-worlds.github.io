import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { createTexturedBuilding, createGraffitiBuilding, createArtBuilding } from '/utils/city.js'
import { createSun } from '/utils/light.js'
import { createFloor } from '/utils/ground.js'

const controls = createOrbitControls()
camera.position.set(0, 25, 50)

scene.add(createSun({ position: [50, 100, 50] }))
scene.add(createFloor())

const building = createGraffitiBuilding()
building.translateX(20)

const building2 = createArtBuilding()
building2.translateX(-20)

const building3 = createTexturedBuilding()
building3.translateZ(10)

scene.add(building, building2, building3)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  controls.update()
  renderer.render(scene, camera)
}()
