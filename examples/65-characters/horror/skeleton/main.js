import { scene, camera, createOrbitControls, clock, createToonRenderer } from '/core/scene.js'
import { createSun } from '/core/light.js'
import { createGround } from '/core/ground.js'
import { SkeletonPlayer } from '/core/actor/derived/fantasy/Skeleton.js'
import GUI from '/core/io/GUI.js'

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
