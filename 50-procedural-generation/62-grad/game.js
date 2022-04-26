import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { randomInCircle, createFloor } from '/utils/helpers.js'
import { createBuilding } from '/utils/city.js'
import { createCityLights } from '/utils/streetlights.js'

const size = 200
const numBuildings = 200

const controls = createOrbitControls()
camera.position.set(0, size * .5, size)
renderer.setClearColor(0x070b34)

scene.add(createCityLights({ size, numLights: 10 }))

const floor = createFloor({ size })
scene.add(floor)

for (let i = 0; i < numBuildings; i++) {
  const { x, z } = randomInCircle(size * .9)
  const building = createBuilding({ x, z, rotY: Math.random() })
  scene.add(building)
}

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}()
