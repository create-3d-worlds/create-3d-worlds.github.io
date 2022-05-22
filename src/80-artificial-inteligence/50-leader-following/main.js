/* global THREE, SteeringEntity */
import { camera, scene, renderer, createOrbitControls } from '/utils/scene.js'
import { createFloor } from '/utils/ground.js'
import { ambLight } from '/utils/light.js'
import { createBox } from '/utils/boxes.js'
import { randomInRange, getIntersects } from '/utils/helpers.js'

ambLight()

const controls = createOrbitControls()
camera.position.set(0, 1000, 1000)

const floor = createFloor({ size: 10000 })
scene.add(floor)

const numFollowers = 20

const mesh1 = createBox({ size: 100, yModifier: 2 })

const entity1 = new SteeringEntity(mesh1)
entity1.maxSpeed = 15
entity1.position.set(randomInRange(-2500, 2500), 0, randomInRange(-2500, 2500))
entity1.wanderDistance = 10
entity1.wanderRadius = 5
entity1.wanderRange = 1
scene.add(entity1)

const params = { maxSpeed: 15, maxForce: 5, distance: 400, separationRadius: 300, maxSeparation: 500, leaderSightRadius: 1000, arrivalThreshold: 200 }

const followers = []

for (let i = 0; i < numFollowers; i++) {
  const mesh = createBox({ size: 100, yModifier: 2, color: 0x000000 })
  mesh.position.setY(100)
  const entity = new SteeringEntity(mesh)
  entity.position.set(randomInRange(-2500, 2500), 0, randomInRange(-2500, 2500))
  entity.maxSpeed = params.maxSpeed
  entity.maxForce = params.maxForce
  followers.push(entity)
  scene.add(entity)
}

const boundaries = new THREE.Box3(new THREE.Vector3(-5000, 0, -5000), new THREE.Vector3(5000, 0, 5000))

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  entity1.wander()
  entity1.lookWhereGoing(true)

  followers.forEach(follower => {
    follower.maxSpeed = params.maxSpeed
    follower.maxForce = params.maxForce
    follower.followLeader(entity1, followers, params.distance, params.separationRadius, params.maxSeparation, params.leaderSightRadius, params.arrivalThreshold)
    follower.lookWhereGoing(true)
    follower.update()
    follower.bounce(boundaries)
  })

  entity1.update()
  entity1.bounce(boundaries)

  renderer.render(scene, camera)
}()

/* EVENTS */

document.addEventListener('mousedown', onClick, true)

function onClick(e) {
  const intersects = getIntersects(e, camera, scene)
  if (intersects.length > 0)
    entity1.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z)
}
