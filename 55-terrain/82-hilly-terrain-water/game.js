import { scene, renderer, camera, clock, createOrbitControls, hemLight } from '/utils/scene.js'
import { createWater } from '/utils/ground.js'
import { createTreesOnTerrain } from '/utils/trees.js'
import { createHillyTerrain } from '/utils/ground/createHillyTerrain.js'
import Avatar from '/classes/Avatar.js'
import { dirLight } from '/utils/light.js'

hemLight()
dirLight({ intensity: .5 })
renderer.setClearColor(0x7ec0ee)

const controls = createOrbitControls()
camera.position.y = 150

scene.add(createWater({ size: 1000 }))
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
