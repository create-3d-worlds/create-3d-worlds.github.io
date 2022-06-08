/* global THREE, SteeringEntity */
import { camera, scene, renderer, createOrbitControls } from '/utils/scene.js'
import { createFloor } from '/utils/ground.js'
import { ambLight } from '/utils/light.js'
import { createBox } from '/utils/geometry.js'
import { randomInRange, getMouseIntersects } from '/utils/helpers.js'

ambLight()

const controls = createOrbitControls()
camera.position.set(0, 100, 100)

const floor = createFloor({ size: 1000 })
scene.add(floor)

const whiteBox = createBox({ size: 10, yModifier: 2 })
const leader = new SteeringEntity(whiteBox)
leader.maxSpeed = 1.5
leader.position.set(randomInRange(-250, 250), 0, randomInRange(-250, 250))
leader.wanderDistance = 5
leader.wanderRadius = 2.5
leader.wanderRange = .5
scene.add(leader)

const followers = []
for (let i = 0; i < 20; i++) {
  const mesh = createBox({ size: 10, yModifier: 2, color: 0x000000 })
  const entity = new SteeringEntity(mesh)
  entity.position.set(randomInRange(-250, 250), 0, randomInRange(-250, 250))
  entity.maxSpeed = 1.5,
  followers.push(entity)
  scene.add(entity)
}

const boundaries = new THREE.Box3(new THREE.Vector3(-500, 0, -500), new THREE.Vector3(500, 0, 500))

/* LOOP */

const params = { distance: 40, separationRadius: 30, maxSeparation: 50, leaderSightRadius: 100, arrivalThreshold: 20 }

void function animate() {
  requestAnimationFrame(animate)
  controls.update()

  leader.wander()
  leader.lookWhereGoing(true)
  leader.update()
  leader.bounce(boundaries)

  followers.forEach(follower => {
    follower.followLeader(leader, followers, params.distance, params.separationRadius, params.maxSeparation, params.leaderSightRadius, params.arrivalThreshold)
    follower.lookWhereGoing(true)
    follower.update()
    follower.bounce(boundaries)
  })

  renderer.render(scene, camera)
}()

/* EVENTS */

document.addEventListener('mousedown', onClick, true)

function onClick(e) {
  const intersects = getMouseIntersects(e, camera, scene)
  if (intersects.length > 0) {
    const { x, y, z } = intersects[0].point
    leader.position.set(x, y, z)
  }
}
