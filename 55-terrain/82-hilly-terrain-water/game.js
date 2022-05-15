import { scene, renderer, camera, clock, createOrbitControls } from '/utils/scene.js'
import { createWater } from '/utils/ground.js'
import { createTreesOnTerrain } from '/utils/trees.js'
import { createHillyTerrain } from '/utils/ground/createHillyTerrain.js'
import Avatar from '/classes/Avatar.js'
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

const avatar = new Avatar()
avatar.addSolids(terrain)
scene.add(avatar.mesh)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  avatar.update(delta)
  controls.update()
  renderer.render(scene, camera)
}()
