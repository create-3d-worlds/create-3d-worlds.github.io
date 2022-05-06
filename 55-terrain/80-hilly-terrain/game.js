import { scene, renderer, camera, createOrbitControls, hemLight } from '/utils/scene.js'
import { createHillyTerrain } from '/utils/ground/createHillyTerrain.js'

hemLight({ intensity: 1.5 })

const controls = createOrbitControls()
camera.position.y = 150

const ground = createHillyTerrain({ factorY: 100 })
scene.add(ground)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}()
