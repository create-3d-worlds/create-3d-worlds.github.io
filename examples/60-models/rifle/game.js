import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'

scene.add(createSun())
createOrbitControls()

const rifle = await loadModel({ file: 'weapon/rifle.fbx', size: 1, angle: Math.PI })

scene.add(rifle)

void function loop() {
  requestAnimationFrame(loop)
  renderer.render(scene, camera)
}()
