import { scene, camera, renderer, clock, createOrbitControls } from '/utils/scene.js'
import { createSpiralStairs } from '/utils/boxes.js'
import { createGround } from '/utils/ground.js'
// import { PlayerModel, Dupechesh, Ratamahatta, Robotko, Girl, GirlFighter } from '/classes/index.js'
import { loadModel } from '/utils/loaders.js'
import Player from '/classes/Player.js'
import { dirLight } from '/utils/light.js'

dirLight({ intensity: 1.5 })
createOrbitControls()

camera.position.z = 40
camera.position.y = 20

const floor = createGround({ file: 'ground.jpg' })
scene.add(floor)
const stairs = createSpiralStairs(5, 40, 40)
scene.add(stairs)

const { mesh, animations } = await loadModel({ file: 'girl.glb', size: .4, rot: { axis: [1, 0, 0], angle: Math.PI * .5 } })

const player = new Player({ mesh, animations })
//   mesh.add(camera)
scene.add(mesh)

player.addSolids(floor, stairs)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  player.update(delta)
  renderer.render(scene, camera)
}()
