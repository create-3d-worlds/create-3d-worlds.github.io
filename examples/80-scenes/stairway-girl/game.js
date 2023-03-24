import { scene, camera, renderer, clock } from '/utils/scene.js'
import { createSpiralStairs } from '/utils/geometry/towers.js'
import { createGround } from '/utils/ground.js'
import { dirLight, hemLight } from '/utils/light.js'
import { SorceressPlayer } from '/utils/actors/fantasy/Sorceress.js'

hemLight()
dirLight({ intensity: 1.5 })

const floor = createGround({ file: 'terrain/ground.jpg' })
scene.add(floor)

const stairs = createSpiralStairs({ radius: 25, stairsInCirle: 50, floorHeight: 15, depth: 5, size: 4 })
stairs.translateY(-2)
scene.add(stairs)

const player = new SorceressPlayer({ camera, speed: 4 })
scene.add(player.mesh)

player.addSolids(floor, stairs)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()
  player.update(delta)
  renderer.render(scene, camera)
}()
