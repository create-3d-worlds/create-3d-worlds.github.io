import { scene, renderer, camera, clock } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { createWater, wave } from '/utils/ground.js'

camera.position.y = 7

scene.add(createSun({ pos: [-5, 30, -60] }))

const water = createWater({ size: 100, segments: 100, opacity: .98 })
water.rotateY(Math.PI * .5)
scene.add(water)

/* LOOP */

void function update() {
  requestAnimationFrame(update)
  const time = clock.getElapsedTime()

  wave({ geometry: water.geometry, time })

  renderer.render(scene, camera)
}()
