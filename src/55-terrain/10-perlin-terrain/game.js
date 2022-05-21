import { camera, scene, renderer, createOrbitControls } from '/utils/scene.js'
import { createPerlinTerrain } from '/utils/ground/perlin-terrain.js'

const controls = createOrbitControls()
camera.position.y = 1000
camera.position.z = 1000

const mesh = createPerlinTerrain({ planeSize: 2000, worldSize: 32 })
scene.add(mesh)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}()
