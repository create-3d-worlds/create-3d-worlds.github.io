import { scene, renderer, camera, clock } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { createWater, wave, createGround } from '/utils/ground.js'

scene.add(createSun({ pos: [-5, 30, -60] }))
const ground = createGround({ file: 'terrain/ground.jpg' })
scene.add(ground)

const water = createWater({ size: 100, segments: 100, opacity: .98 })
water.position.z = -40
water.position.y = 5
water.rotateY(Math.PI * .5)
scene.add(water)

/* LOOP */

void function update() {
  requestAnimationFrame(update)
  const time = clock.getElapsedTime()

  wave({ geometry: water.geometry, time, passage: { start: 4000, end: 6000 } })

  renderer.render(scene, camera)
}()
