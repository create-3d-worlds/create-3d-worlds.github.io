import { scene, camera, renderer, clock, createOrbitControls } from '/utils/scene.js'
import { createWater, wave, createGround } from '/utils/ground.js'
import { createSun } from '/utils/light.js'

scene.add(createSun())
camera.position.set(0, 20, 20)
createOrbitControls()

const water = createWater({ file: null, size: 100, segments: 100 })
water.rotateY(Math.PI * .5)
scene.add(water)

const ground = createGround({ file: 'terrain/ground.jpg' })
ground.position.y = -5
scene.add(ground)

/* LOOP */

void function render() {
  requestAnimationFrame(render)

  const time = clock.getElapsedTime()
  wave({ geometry: water.geometry, time, passage: { start: 4000, end: 6000 } })

  renderer.render(scene, camera)
}()