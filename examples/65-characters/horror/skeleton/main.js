import { scene, camera, createOrbitControls, clock, createToonRenderer } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { createGround } from '/utils/ground.js'
import { SkeletonPlayer } from '/utils/actor/derived/fantasy/Skeleton.js'
import GUI from '/utils/io/GUI.js'

createOrbitControls()

const renderer = await createToonRenderer()

scene.add(createSun())
scene.add(createGround({ size: 100 }))

const player = new SkeletonPlayer()
scene.add(player.mesh)

new GUI({ scoreTitle: '', player })

/* LOOP */

void function update() {
  requestAnimationFrame(update)
  const delta = clock.getDelta()

  player.update(delta)
  renderer.render(scene, camera)
}()
