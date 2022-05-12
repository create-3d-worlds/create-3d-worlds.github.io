import { scene, camera, renderer, clock, createOrbitControls } from '/utils/scene.js'
import { createSpiralStairs } from '/utils/boxes.js'
import { createGround } from '/utils/ground.js'
// import { PlayerModel, Dupechesh, Ratamahatta, Robotko, Girl, GirlFighter } from '/classes/index.js'
import { loadModel } from '/utils/loaders.js'
import Player from '/classes/Player.js'
import { dirLight, hemLight } from '/utils/light.js'

hemLight()
dirLight({ intensity: 1.5 })
const controls = createOrbitControls()

camera.position.z = 30
camera.position.y = 15

const floor = createGround({ file: 'ground.jpg' })
scene.add(floor)
const stairs = createSpiralStairs(5, 40, 40)
scene.add(stairs)

const { mesh, animations } = await loadModel({ file: 'girl.glb', size: .2, rot: { axis: [0, 1, 0], angle: Math.PI } })

const player = new Player({ mesh, animations })
// mesh.add(camera)
scene.add(mesh)

// player.addSolids(floor, stairs)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  player.update(delta)
  controls.update()
  renderer.render(scene, camera)
}()
