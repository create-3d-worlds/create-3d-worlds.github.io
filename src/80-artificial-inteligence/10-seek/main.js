/* global THREE, SteeringEntity */
import { camera, scene, renderer, createOrbitControls } from '/utils/scene.js'
import { createFloor } from '/utils/ground.js'
import { randomInRange } from '/utils/helpers.js'
import { createBall } from '/utils/spheres.js'
import { createCrate } from '/utils/boxes.js'

const controls = createOrbitControls()

const light = new THREE.AmbientLight(0xffffff)
scene.add(light)

camera.position.set(0, 100, 100)

const floor = createFloor({ size: 1000 })
scene.add(floor)

const ball = createBall({ radius: 5 })
scene.add(ball)

const mesh = createCrate({ size: 10 })
// Entity
const entity = new SteeringEntity(mesh)
entity.position.set(randomInRange(-500, 500), 0, randomInRange(-500, 500))
entity.lookAtDirection = true
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

function onMouseMove(e) {
  const mouse3D = new THREE.Vector3((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1, 0)
  const raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(mouse3D, camera)
  const intersects = raycaster.intersectObjects(scene.children)
  if (intersects.length > 0)
    ball.position.set(intersects[0].point.x, 5, intersects[0].point.z)
}
