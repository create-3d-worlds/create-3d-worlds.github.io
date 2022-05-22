/* global THREE, SteeringEntity */
import { camera, scene, renderer, createOrbitControls } from '/utils/scene.js'
import { createFloor } from '/utils/ground.js'
import { createBox } from '/utils/boxes.js'
import { randomInRange, getIntersects } from '/utils/helpers.js'
import { ambLight } from '/utils/light.js'

ambLight()

const controls = createOrbitControls()
camera.position.set(0, 100, 100)

const floor = createFloor({ size: 1000 })
scene.add(floor)

// Entity Mesh
const mesh1 = createBox({ size: 10, color: 0xFFFFFF })
const mesh2 = createBox({ size: 10, color: 0xFF0000 })

// Entities
const entity1 = new SteeringEntity(mesh1)
entity1.maxSpeed = 1.5
entity1.position.set(randomInRange(-500, 500), 0, randomInRange(-500, 500))
scene.add(entity1)

const entity2 = new SteeringEntity(mesh2)
entity2.maxSpeed = 1
entity2.position.set(randomInRange(-500, 500), 0, randomInRange(-500, 500))
scene.add(entity2)

const boundaries = new THREE.Box3(new THREE.Vector3(-500, 0, -500), new THREE.Vector3(500, 0, 500))

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  controls.update()

  const distance = entity1.position.distanceTo(entity2.position)
  if (distance > 5) {
    entity1.flee(entity2.position)
    entity1.lookWhereGoing(true)
    entity2.seek(entity1.position)
    entity2.lookWhereGoing(true)
  } else {
    entity1.idle()
    entity1.lookAt(entity2.position)
    entity2.idle()
    entity2.lookAt(entity1.position)
  }
  entity1.update()
  entity2.update()
  entity1.bounce(boundaries)
  entity2.bounce(boundaries)

  renderer.render(scene, camera)
}()

/* EVENT */

document.addEventListener('mousedown', onClick, true)

function onClick(e) {
  const intersects = getIntersects(e, camera, scene)
  if (intersects.length > 0)
    entity1.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z)
}
