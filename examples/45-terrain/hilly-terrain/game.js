import { scene, renderer, camera, createOrbitControls } from '/core/scene.js'
import { createWater, createHillyTerrain } from '/core/ground.js'
import { createTreesOnTerrain } from '/core/geometry/trees.js'
import { hemLight } from '/core/light.js'

hemLight()
renderer.setClearColor(0x7ec0ee)

const controls = await createOrbitControls()
camera.position.y = 75
camera.position.z = 50

scene.add(createWater({ size: 400 }))
const terrain = await createHillyTerrain()
scene.add(terrain)

scene.add(createTreesOnTerrain({ terrain }))

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  controls.update()
  renderer.render(scene, camera)
}()
