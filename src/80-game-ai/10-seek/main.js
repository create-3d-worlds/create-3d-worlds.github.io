/* global THREE, SteeringEntity */
import { camera, scene, renderer, createOrbitControls } from '/utils/scene.js'
import { createFloor } from '/utils/ground.js'
import { randomInRange, getMouseIntersects } from '/utils/helpers.js'
import { createBall } from '/utils/geometry.js'
import { createCrate } from '/utils/geometry.js'
import { ambLight } from '/utils/light.js'

ambLight()

const controls = createOrbitControls()
camera.position.set(0, 100, 100)

const floor = createFloor({ size: 1000 })
scene.add(floor)

const ball = createBall({ r: 5 })
scene.add(ball)

const mesh = createCrate({ size: 10 })
// Entity
const entity = new SteeringEntity(mesh)
entity.position.set(randomInRange(-500, 500), 0, randomInRange(-500, 500))
entity.maxSpeed = 1
scene.add(entity)

// Plane boundaries (do not cross)
const boundaries = new THREE.Box3(new THREE.Vector3(-500, 0, -500), new THREE.Vector3(500, 0, 500))

/* LOOP */

void function update() {
  requestAnimationFrame(update)
  controls.update()

  if (entity.position.distanceTo(ball.position) > 10) {
    entity.seek(ball.position)
    entity.lookWhereGoing(true)
  } else {
    entity.idle()
    entity.lookAt(ball.position)
  }

  entity.bounce(boundaries)
  entity.update()
  renderer.render(scene, camera)
}()

/* EVENT */

document.addEventListener('mousemove', onMouseMove, true)

function onMouseMove(e) {
  const intersects = getMouseIntersects(e, camera, scene)
  if (intersects.length > 0)
    ball.position.set(intersects[0].point.x, 5, intersects[0].point.z)
}
