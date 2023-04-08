import { scene, renderer, camera, clock } from '/utils/scene.js'
import { createSun, orbiting } from '/utils/light.js'
import { createGround } from '/utils/ground.js'
import { createStoneCircles, createStairway } from '/utils/geometry/towers.js'
import { SorceressPlayer } from '/utils/actor/child/fantasy/Sorceress.js'

const sun = createSun()
scene.add(sun)

const floor = createGround()
scene.add(floor)

const stones = createStoneCircles()
scene.add(stones)

const stairs = createStairway({ radius: 25, stairsInCirle: 50, floorHeight: 15, depth: 5, size: 4 })
stairs.translateY(-2)
scene.add(stairs)

const player = new SorceressPlayer({ camera, speed: 4 })
scene.add(player.mesh)

player.addSolids(floor, stairs)

/* LOOP */

void function loop() {
  const delta = clock.getDelta()
  const elapsed = clock.getElapsedTime()

  orbiting(sun, elapsed * .1)
  player.update(delta)

  renderer.render(scene, camera)
  requestAnimationFrame(loop)
}()