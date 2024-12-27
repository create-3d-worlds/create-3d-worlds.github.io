import { scene, camera, clock, createToonRenderer } from '/core/scene.js'
import { createSun } from '/core/light.js'
import { createTank } from '/core/geometry/shapes.js'

const renderer = await createToonRenderer()

const sun = createSun()
scene.add(sun)

camera.position.set(8, 5, 10)
camera.lookAt(0, 0, 0)

const { tank, tankGun, wheels } = createTank()
scene.add(tank)

/* LOOP */

void function loop() {
  const time = clock.getElapsedTime()

  sun.position.x = Math.sin(time * .2) * 100
  tankGun.lookAt(sun.position)

  wheels.forEach(obj => {
    obj.rotation.x = time * 3
  })

  renderer.render(scene, camera)
  requestAnimationFrame(loop)
}()
