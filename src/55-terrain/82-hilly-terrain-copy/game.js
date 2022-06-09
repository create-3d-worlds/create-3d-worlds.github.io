import { scene, renderer, camera, createOrbitControls } from '/utils/scene.js'
import { createFirTree } from '/utils/trees.js'
import { createHillyTerrain } from '/utils/ground/createHillyTerrain.js'
import { hemLight } from '/utils/light.js'
import { putOnTerrain } from '/utils/helpers.js'
import { createWater } from '/utils/ground.js'

hemLight()

const controls = createOrbitControls()
camera.position.y = 150
camera.position.z = 100

const terrain = createHillyTerrain({ size: 400 })
console.log(terrain.position.y)
scene.add(terrain)

scene.add(createWater({ size: 400 }))

putOnTerrain({
  size: 400,
  terrain,
  total: 200,
  callBack: pos => {
    scene.add(createFirTree(pos))
  } })

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}()
