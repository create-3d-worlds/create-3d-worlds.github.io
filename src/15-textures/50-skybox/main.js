import { camera, scene, renderer, createSkyBox, createOrbitControls } from '/utils/scene.js'
import { createGround } from '/utils/ground.js'
import { initLights } from '/utils/light.js'

initLights()
createOrbitControls()
camera.position.set(0, 15, 30)

const ground = createGround({ size: 512, file: 'grass-512.jpg' })
scene.add(ground)

scene.background = createSkyBox()

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()
