import { scene, renderer, camera, clock } from '/utils/scene.js'
import { createSun } from '/utils/planets.js'

renderer.setClearColor('#121212', 1)
camera.position.set(130, 0, 0)

const sun = createSun()
scene.add(sun)
camera.lookAt(sun.position)

/* LOOP */

void function render() {
  requestAnimationFrame(render)
  const time = clock.getElapsedTime()
  sun.rotation.y = time * 0.05
  renderer.render(scene, camera)
}()
