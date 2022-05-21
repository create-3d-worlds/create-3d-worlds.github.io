/* global THREE, SteeringEntity */
import { camera, scene, renderer, createOrbitControls } from '/utils/scene.js'
import { createFloor } from '/utils/ground.js'

const controls = createOrbitControls()

const light = new THREE.AmbientLight(0xffffff)
scene.add(light)

let entity
let ball
let boundaries
let entities
let params

camera.position.set(0, 1000, 1000)
camera.lookAt(new THREE.Vector3(0, 0, 0))

const floor = createFloor({ size: 10000 })
scene.add(floor)

params = { maxSpeed: 10, maxForce: 5, lookAtDirection: true, wanderDistance: 10, wanderRadius: 5, wanderRange: 1, numEntities: 20 }

// Entity Mesh
const geometry = new THREE.BoxGeometry(100, 200, 50)
const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: true })

// Entities
entities = []
for (let i = 0;i < params.numEntities;i++) {
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.setY(100)
  const entity = new SteeringEntity(mesh)
  entity.position.set(Math.random() * (5000 - (-5000)) + (-5000), 0, Math.random() * (5000 - (-5000)) + (-5000))
  entities.push(entity)
  scene.add(entity)
}

// Plane boundaries (do not cross)
boundaries = new THREE.Box3(new THREE.Vector3(-5000, 0, -5000), new THREE.Vector3(5000, 0, 5000))

animate()
function animate() {
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
}