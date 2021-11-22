import {scene, camera, renderer, clock} from '/utils/scene.js'
import {createTerrain} from '/utils/floor.js'

camera.position.z = 40
camera.position.y = 20

const terrain = createTerrain()
scene.add(terrain)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()

  renderer.render(scene, camera)
}()
