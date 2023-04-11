import { scene, renderer, camera, clock } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { createGround } from '/utils/ground.js'
import { createStoneCircles, createStairway } from '/utils/geometry/towers.js'
import { orbiting } from '/utils/geometry/planets.js'
import { SorceressPlayer } from '/utils/actor/child/fantasy/Sorceress.js'

const sun = createSun()
const sun2 = createSun({ addLight: false })
const sun3 = createSun({ addLight: false })
scene.add(sun, sun2, sun3)

const floor = createGround()
scene.add(floor)

const stones = createStoneCircles()
scene.add(stones)

const stairs = createStairway({ radius: 25, stairsInCirle: 50, floorHeight: 15, depth: 5, size: 4 })
stairs.translateY(-2)
scene.add(stairs)

const player = new SorceressPlayer({ camera, speed: 4, solids: [floor, stairs, stones] })
scene.add(player.mesh)

/* LOOP */

void function loop() {
  const delta = clock.getDelta()
  const elapsed = clock.getElapsedTime()

  orbiting(sun, elapsed * .1, 50)
  orbiting(sun2, elapsed * .11, 50, 1)
  orbiting(sun3, elapsed * .12, 50, 2)

  player.update(delta)

  renderer.render(scene, camera)
  requestAnimationFrame(loop)
}()