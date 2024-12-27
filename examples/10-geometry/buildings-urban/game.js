import { scene, camera, renderer, createOrbitControls } from '/core/scene.js'
import { createTexturedBuilding, createGraffitiBuilding, createArtBuilding } from '/core/city.js'
import { createSun } from '/core/light.js'
import { createFloor } from '/core/ground.js'

const controls = await createOrbitControls()
camera.position.set(0, 25, 50)

scene.add(createSun({ pos: [50, 100, 50] }))
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
