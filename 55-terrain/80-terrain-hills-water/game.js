import { scene, renderer, camera, clock, createOrbitControls, hemLight } from '/utils/scene.js'
import { createWater } from '/utils/ground/index.js'
import { createTreesOnTerrain } from '/utils/trees.js'
import { createHillyTerrain } from '/utils/ground/createHillyTerrain.js'
import { PlayerAvatar } from '/classes/Player.js'
import { dirLight } from '/utils/light.js'

hemLight()
dirLight({ intensity: .5 })
renderer.setClearColor(0x7ec0ee)

const controls = createOrbitControls()
camera.position.y = 150

scene.add(createWater({ size: 1000 }))
const ground = createHillyTerrain()
scene.add(ground)
scene.add(createTreesOnTerrain(ground))

const avatar = new PlayerAvatar()
avatar.addSolids(ground)
scene.add(avatar.mesh)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  avatar.update(delta)
  controls.update()
  renderer.render(scene, camera)
}()
