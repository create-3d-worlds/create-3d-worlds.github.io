import { scene, renderer, camera, createOrbitControls } from '/utils/scene.js'
import { createWater, createHillyTerrain } from '/utils/ground.js'
import { createTreesOnTerrain } from '/utils/geometry/trees.js'
import { hemLight } from '/utils/light.js'

hemLight()
renderer.setClearColor(0x7ec0ee)

const controls = createOrbitControls()
camera.position.y = 75
camera.position.z = 50

scene.add(createWater({ size: 400 }))
const terrain = createHillyTerrain()
scene.add(terrain)

scene.add(createTreesOnTerrain({ terrain }))

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  controls.update()
  renderer.render(scene, camera)
}()
