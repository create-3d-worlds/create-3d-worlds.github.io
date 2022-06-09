/* global THREE, SteeringEntity */
import { camera, scene, renderer, createOrbitControls } from '/utils/scene.js'
import { createFloor } from '/utils/ground.js'
import { ambLight } from '/utils/light.js'
import { createBall } from '/utils/geometry.js'
import { createBox } from '/utils/geometry.js'
import { randomInRange, getMouseIntersects } from '/utils/helpers.js'

ambLight()

const controls = createOrbitControls()
camera.position.set(0, 1000, 1000)

const floor = createFloor({ size: 10000 })
scene.add(floor)

// Ball
const ball = createBall({ r: 50 })
ball.position.set(randomInRange(-5000, 5000), 50, randomInRange(-5000, 5000))
scene.add(ball)

// Entity Mesh
const mesh1 = createBox({ size: 100, color: 0xFFFFFF })
mesh1.position.setY(100)

const mesh2 = createBox({ size: 100, color: 0xFF0000 })
mesh2.position.setY(100)

const mesh3 = createBox({ size: 100, color: 0x000000 })
mesh3.position.setY(100)

// Entities
const entity1 = new SteeringEntity(mesh1)
entity1.maxSpeed = 15
entity1.position.set(randomInRange(-5000, 5000), 0, randomInRange(-5000, 5000))
scene.add(entity1)

const entity2 = new SteeringEntity(mesh2)
entity2.maxSpeed = 10
entity2.position.set(randomInRange(-5000, 5000), 0, randomInRange(-5000, 5000))
scene.add(entity2)

const entity3 = new SteeringEntity(mesh3)
entity3.maxSpeed = 10
entity3.position.set(randomInRange(-5000, 5000), 0, randomInRange(-5000, 5000))
scene.add(entity3)

const boundaries = new THREE.Box3(new THREE.Vector3(-5000, 0, -5000), new THREE.Vector3(5000, 0, 5000))

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  controls.update()

  entity1.avoid([entity2, entity3])
  entity2.avoid([entity1, entity3])
  entity3.avoid([entity1, entity2])

  if (entity1.position.distanceTo(ball.position) > 100) {
    entity1.seek(ball.position)
    entity1.lookWhereGoing(true)
  } else {
    entity1.idle()
    entity1.lookAt(new THREE.Vector3(ball.position.x, entity1.position.y, ball.position.z))
  }

  if (entity2.position.distanceTo(entity1.position) > 200) {
    entity2.seek(entity1.position)
    entity2.lookWhereGoing(true)
    entity2.bounce(boundaries)
  } else {
    entity2.idle()
    entity2.lookAt(entity1.position)
  }

  if (entity3.position.distanceTo(entity1.position) > 200) {
    entity3.pursue(entity1)
    entity3.lookWhereGoing(true)
    entity3.bounce(boundaries)
  } else {
    entity3.idle()
    entity3.lookAt(entity1.position)
  }

  entity1.update()
  entity2.update()
  entity3.update()

  renderer.render(scene, camera)
}()

/* EVENTS */

document.addEventListener('mousedown', onClick, true)
document.addEventListener('mousemove', onMouseMove, true)

function onClick(e) {
  const intersects = getMouseIntersects(e, camera, scene)
  if (intersects.length > 0) {
    entity1.position.set(randomInRange(-5000, 5000), 0, randomInRange(-5000, 5000))
    entity2.position.set(randomInRange(-5000, 5000), 0, randomInRange(-5000, 5000))
    entity3.position.set(randomInRange(-5000, 5000), 0, randomInRange(-5000, 5000))
  }
}

function onMouseMove(e) {
  const intersects = getMouseIntersects(e, camera, scene)
  if (intersects.length > 0)
    ball.position.set(intersects[0].point.x, 50, intersects[0].point.z)
}
