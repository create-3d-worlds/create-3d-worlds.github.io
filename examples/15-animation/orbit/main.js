import { scene, camera, renderer } from '/utils/scene.js'
import { createSphere } from '/utils/geometry.js'

camera.position.set(0, 0, 30)
let tick = 0

const sphere = createSphere()
scene.add(sphere)

const orbitRadius = 10

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  tick += 0.03

  const x = Math.cos(tick) * orbitRadius * 1.5
  const y = Math.sin(tick) * orbitRadius
  sphere.position.set(x, y, 0)

  renderer.render(scene, camera)
}()