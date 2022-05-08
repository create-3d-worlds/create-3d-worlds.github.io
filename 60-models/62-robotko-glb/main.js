import { scene, camera, renderer, clock, createOrbitControls } from '/utils/scene.js'
import { dirLight } from '/utils/light.js'
import { loadGlb } from '/utils/loaders.js'

dirLight({ intensity: 1.5 })

camera.position.set(0, 5, 20)
createOrbitControls()

const { model, mixer } = await loadGlb({ glb: 'robot.glb', scale: 1.5 })
scene.add(model)

// LOOP

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  if (mixer) mixer.update(delta)
  renderer.render(scene, camera)
}()
