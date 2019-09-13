import {scene, camera, renderer, clock, createOrbitControls} from '/utils/scene.js'
import {createSpiralStairs} from '/utils/boxes.js'
import {createFloor} from '/utils/floor.js'
import {Player, Kamenko} from '/classes/index.js'

// createOrbitControls()
camera.position.z = 40
camera.position.y = 20

const floor = createFloor()
scene.add(floor)
const stairs = createSpiralStairs(5, 40, 40)
scene.add(stairs)

const player = new Player(100, 50, -50, 10, false, Kamenko)
player.mesh.rotateY(Math.PI)
player.mesh.add(camera)
scene.add(player.mesh)

player.addGround(floor, stairs)
player.addSurrounding(stairs)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  player.update(delta)
  renderer.render(scene, camera)
}()
