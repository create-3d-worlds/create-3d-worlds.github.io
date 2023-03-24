import { scene, renderer, camera, clock } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { createGround } from '/utils/ground.js'
import { createTank } from '/utils/geometry/shapes.js'

const sun = createSun()
scene.add(sun)

camera.position.set(8, 4, 10).multiplyScalar(2)
camera.lookAt(0, 0, 0)

scene.add(createGround({ size: 50 }))

const { tank, tankGun, wheels } = createTank()
scene.add(tank)

/* LOOP */

void function loop() {
  const time = clock.getElapsedTime()

  sun.position.x = Math.sin(time * .2) * 100
  sun.position.y = Math.cos(time * .2) * 100

  tankGun.lookAt(sun.position)

  wheels.forEach(obj => {
    obj.rotation.x = time * 3
  })

  renderer.render(scene, camera)
  requestAnimationFrame(loop)
}()
