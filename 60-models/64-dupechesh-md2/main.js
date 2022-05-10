// https://threejs.org/examples/webgl_loader_md2.html
// https://threejs.org/examples/webgl_loader_md2_control.html
import { scene, renderer, camera, clock, createOrbitControls } from '/utils/scene.js'
import { loadModel } from '/utils/loaders.js'
import Player from '/classes/Player.js'
import { dupecheshAnimations } from '/data/animations.js'
import { createGround } from '/utils/ground.js'
import { dirLight } from '/utils/light.js'

dirLight({ intensity: 1.5 })
createOrbitControls()
camera.position.set(0, 2, 5)

const { mesh, animations } = await loadModel({ file: 'ogro/ogro.md2', texture: 'ogro/skins/arboshak.png', size: 2, rot: { axis: [0, 1, 0], angle: Math.PI * .5 } })
const player = new Player({ mesh }) // animations, animNames: dupecheshAnimations
scene.add(mesh)

const ground = createGround({ size: 10 })
scene.add(ground)

// LOOP

void function update() {
  requestAnimationFrame(update)
  const delta = clock.getDelta()
  player.update(delta)
  renderer.render(scene, camera)
}()
