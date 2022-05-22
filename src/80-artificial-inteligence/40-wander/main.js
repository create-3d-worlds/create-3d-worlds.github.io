/* global THREE, SteeringEntity */
import { camera, scene, renderer, createOrbitControls } from '/utils/scene.js'
import { createFloor } from '/utils/ground.js'
import { ambLight } from '/utils/light.js'
import { randomInRange } from '/utils/helpers.js'
import { createBox } from '/utils/boxes.js'

ambLight()

const controls = createOrbitControls()
camera.position.set(0, 1000, 1000)

const floor = createFloor({ size: 10000 })
scene.add(floor)

const params = { maxSpeed: 10, maxForce: 5, lookAtDirection: true, wanderDistance: 10, wanderRadius: 5, wanderRange: 1, numEntities: 20 }

const entities = []
for (let i = 0;i < params.numEntities;i++) {
  const mesh = createBox({ size: 100, yModifier: 2 })
  const entity = new SteeringEntity(mesh)
  entity.position.set(randomInRange(-5000, 5000), 0, randomInRange(-5000, 5000))
  entities.push(entity)
  scene.add(entity)
}

const boundaries = new THREE.Box3(new THREE.Vector3(-5000, 0, -5000), new THREE.Vector3(5000, 0, 5000))

void function animate() {
  requestAnimationFrame(animate)

  for (let i = 0;i < entities.length;i++) {
    entities[i].maxSpeed = params.maxSpeed
    entities[i].maxForce = params.maxForce
    entities[i].wanderDistance = params.wanderDistance
    entities[i].wanderRadius = params.wanderRadius
    entities[i].wanderRange = params.wanderRange
    entities[i].wander()
    if (params.lookAtDirection)
      entities[i].lookWhereGoing(true)
    else
      entities[i].rotation.set(0, 0, 0)

    entities[i].update()
    entities[i].bounce(boundaries)
  }
  controls.update()
  renderer.render(scene, camera)
}()