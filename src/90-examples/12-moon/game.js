import { camera, scene, renderer, clock, createOrbitControls } from '/utils/scene.js'
import { createMoon } from '/utils/planets.js'
import { dirLight } from '/utils/light.js'

dirLight({ position: [.5, 0, 1], intensity: 2 })
renderer.setClearColor(0x000000)

const controls = createOrbitControls()
camera.position.z = 8

const moon = createMoon({ r: 2 })
scene.add(moon)

/* LOOP */

void function run() {
  requestAnimationFrame(run)
  const dt = clock.getDelta()
  moon.rotation.y += dt / 10
  controls.update()
  renderer.render(scene, camera)
}()
