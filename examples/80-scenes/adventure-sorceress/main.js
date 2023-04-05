import { scene, renderer, camera, clock } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { createGround } from '/utils/ground.js'
import { createStoneCircles, createSpiralStairs } from '/utils/geometry/towers.js'
import { SorceressPlayer } from '/utils/actor/derived/fantasy/Sorceress.js'

const light = createSun()
scene.add(light)

const floor = createGround()
scene.add(floor)

const stones = createStoneCircles()
scene.add(stones)

const stairs = createSpiralStairs({ radius: 25, stairsInCirle: 50, floorHeight: 15, depth: 5, size: 4 })
stairs.translateY(-2)
scene.add(stairs)

const player = new SorceressPlayer({ camera, speed: 4 })
scene.add(player.mesh)

player.addSolids(floor, stairs)

/* LOOP */

const lightRadius = 8
let lightAngle = 0

void function loop() {
  lightAngle += .003
  const x = Math.cos(lightAngle) * lightRadius
  const z = Math.sin(lightAngle) * lightRadius
  light.position.set(x, 10, z)

  const delta = clock.getDelta()
  player.update(delta)

  renderer.render(scene, camera)
  requestAnimationFrame(loop)
}()