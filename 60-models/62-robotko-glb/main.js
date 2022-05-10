import { scene, camera, renderer, clock, createOrbitControls } from '/utils/scene.js'
import { dirLight } from '/utils/light.js'
import { loadGlb } from '/utils/loaders.js'
import Player from '/classes/Player.js'
import { createGround } from '/utils/ground.js'

dirLight({ intensity: 1.5 })

camera.position.set(0, 10, 15)
createOrbitControls()

const { mesh, mixer, animations } = await loadGlb({ glb: 'robot.glb', rot: { axis: [0, 1, 0], angle: Math.PI } })
const player = new Player({ mesh, mixer, animations })
scene.add(player.mesh)

scene.add(createGround({ size: 100 }))

// LOOP

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  player.update(delta)
  renderer.render(scene, camera)
}()
