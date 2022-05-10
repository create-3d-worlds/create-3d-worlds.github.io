// https://threejs.org/examples/webgl_loader_md2.html
// https://threejs.org/examples/webgl_loader_md2_control.html
import { scene, renderer, camera, clock, createOrbitControls, hemLight } from '/utils/scene.js'
import { loadModel } from '/utils/loaders.js'
import Player from '/classes/Player.js'
import { dupecheshAnimations } from '/data/animations.js'

hemLight()
createOrbitControls()
camera.position.set(10, 10, 50)

const { mesh, animations } = await loadModel({ file: 'ogro/ogro.md2', texture: 'ogro/skins/arboshak.png' })
const player = new Player({ mesh, animations, animNames: dupecheshAnimations })
scene.add(mesh)

// LOOP

void function update() {
  requestAnimationFrame(update)
  const delta = clock.getDelta()
  player.update(delta)
  renderer.render(scene, camera)
}()
