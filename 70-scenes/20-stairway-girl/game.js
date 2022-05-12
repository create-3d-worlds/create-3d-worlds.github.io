import { scene, camera, renderer, clock } from '/utils/scene.js'
import { createSpiralStairs } from '/utils/towers.js'
import { createGround } from '/utils/ground.js'
import { loadModel } from '/utils/loaders.js'
import Player from '/classes/Player.js'
import { dirLight, hemLight } from '/utils/light.js'
import { girlAnimations } from '/data/animations.js'

hemLight()
dirLight({ intensity: 1.5 })

camera.position.z = 30
camera.position.y = 15

const floor = createGround({ file: 'ground.jpg' })
scene.add(floor)
const stairs = createSpiralStairs(5, 40, 40)
scene.add(stairs)

const { mesh, animations } = await loadModel({ file: 'girl.glb', size: .2, rot: { axis: [0, 1, 0], angle: Math.PI } })

const player = new Player({ mesh, animations, animNames: girlAnimations })
mesh.add(camera)
scene.add(mesh)

player.addSolids(floor, stairs)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  player.update(delta)
  renderer.render(scene, camera)
}()
