/* global THREE, SteeringEntity */
import { camera, scene, renderer, createOrbitControls } from '/utils/scene.js'
import { createFloor } from '/utils/ground.js'
import { randomInRange } from '/utils/helpers.js'
import { createBall } from '/utils/spheres.js'
import { createCrate } from '/utils/boxes.js'

const controls = createOrbitControls()

const light = new THREE.AmbientLight(0xffffff)
scene.add(light)

camera.position.set(0, 1000, 1000)

const floor = createFloor({ size: 10000 })
scene.add(floor)

const ball = createBall({ radius: 50 })
scene.add(ball)

const mesh = createCrate({ size: 100 })
// Entity
const entity = new SteeringEntity(mesh)
entity.position.set(randomInRange(-5000, 5000), 0, randomInRange(-5000, 5000))
entity.lookAtDirection = true
scene.add(entity)

// Plane boundaries (do not cross)
const boundaries = new THREE.Box3(new THREE.Vector3(-5000, 0, -5000), new THREE.Vector3(5000, 0, 5000))

/* LOOP */

void function update() {
  requestAnimationFrame(update)
  controls.update()

  if (entity.position.distanceTo(ball.position) > 100) {
    entity.seek(ball.position)
    if (entity.lookAtDirection)
      entity.lookWhereGoing(true)
    else
      entity.rotation.set(0, 0, 0)
  } else {
    entity.idle()
    if (entity.lookAtDirection)
      entity.lookAt(ball.position)
    else
      entity.rotation.set(0, 0, 0)
  }

  entity.bounce(boundaries)
  entity.update()
  renderer.render(scene, camera)
}()

/* EVENT */

document.addEventListener('mousemove', onMouseMove, true)

function onMouseMove(event) {
  const mouse3D = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0)
  const raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(mouse3D, camera)
  const intersects = raycaster.intersectObjects(scene.children)
  if (intersects.length > 0)
    ball.position.set(intersects[0].point.x, 50, intersects[0].point.z)
}
