import { scene, camera, renderer, createOrbitControls } from '/core/scene.js'
import { createSun } from '/core/light.js'
import { loadModel } from '/core/loaders.js'

scene.add(createSun())
createOrbitControls()

const rifle = await loadModel({ file: 'weapon/rifle.fbx', size: 1, angle: Math.PI })

scene.add(rifle)

void function loop() {
  requestAnimationFrame(loop)
  renderer.render(scene, camera)
}()
