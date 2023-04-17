import { scene, renderer, camera, createOrbitControls, clock } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { createWater, wave, createGround } from '/utils/ground.js'
import { WizardPlayer } from '/utils/actor/child/fantasy/Wizard.js'

createOrbitControls()

scene.add(createSun())
const ground = createGround({ file: 'terrain/ground.jpg' })
scene.add(ground)

const water = createWater({ file: null, size: 100, segments: 100 })
water.position.z = -40
water.position.y = 5
water.rotateY(Math.PI * .5)
scene.add(water)

const player = new WizardPlayer()
scene.add(player.mesh)

/* LOOP */

void function update() {
  requestAnimationFrame(update)
  const delta = clock.getDelta()
  const time = clock.getElapsedTime()

  wave({ geometry: water.geometry, time, passage: { start: 4000, end: 6000 } })
  player.update(delta)

  player.update(delta)
  renderer.render(scene, camera)
}()
