import { scene, camera, renderer, clock, createOrbitControls } from '/utils/scene.js'
import { dirLight } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'
import Player from '/classes/Player.js'
import { createGround } from '/utils/ground.js'
import { robotAnimations } from '/data/animations.js'

dirLight({ intensity: 1.5 })

camera.position.set(0, 3, 5)
createOrbitControls()

const { mesh, animations } = await loadModel({ file: 'robot.glb', size: 2, rot: { axis: [0, 1, 0], angle: Math.PI } })
const player = new Player({ mesh, animations, animNames: robotAnimations })
scene.add(mesh)

scene.add(createGround({ size: 100 }))

// LOOP

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  player.update(delta)
  renderer.render(scene, camera)
}()
