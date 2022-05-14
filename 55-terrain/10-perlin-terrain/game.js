import { camera, scene, renderer, createOrbitControls } from '/utils/scene.js'
import { createTerrain } from '/utils/ground/perlin-terrain.js'

const controls = createOrbitControls()
camera.position.y = 1500
camera.position.z = 2500

const mesh = createTerrain()
scene.add(mesh)

/* FUNCTIONS */

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}()
