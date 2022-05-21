/* global THREE, SteeringEntity */
import { camera, scene, renderer, createOrbitControls } from '/utils/scene.js'
import { createFloor } from '/utils/ground.js'
import { createBox } from '/utils/boxes.js'

const controls = createOrbitControls()

const light = new THREE.AmbientLight(0xffffff)
scene.add(light)

camera.position.set(0, 1000, 1000)

const floor = createFloor({ size: 10000 })
scene.add(floor)

// Entity Mesh
const mesh1 = createBox({ size: 100, color: 0xFFFFFF })

const mesh2 = createBox({ size: 100, color: 0xFF0000 })

// Entities
const entity1 = new SteeringEntity(mesh1)
entity1.maxSpeed = 15
entity1.lookAtDirection = true
entity1.position.set(Math.random() * (5000 - (-5000)) + (-5000), 0, Math.random() * (5000 - (-5000)) + (-5000))
scene.add(entity1)

const entity2 = new SteeringEntity(mesh2)
entity2.maxSpeed = 10
entity2.lookAtDirection = true
entity2.position.set(Math.random() * (5000 - (-5000)) + (-5000), 0, Math.random() * (5000 - (-5000)) + (-5000))
scene.add(entity2)

// Plane boundaries (do not cross)
const boundaries = new THREE.Box3(new THREE.Vector3(-5000, 0, -5000), new THREE.Vector3(5000, 0, 5000))

void function animate() {
  requestAnimationFrame(animate)
  controls.update()

  const distance = entity1.position.distanceTo(entity2.position)

  if (distance > 50) {
    entity1.flee(entity2.position)
    if (entity1.lookAtDirection)
      entity1.lookWhereGoing(true)
    else
      entity1.rotation.set(0, 0, 0)
    entity2.seek(entity1.position)

    if (entity2.lookAtDirection)
      entity2.lookWhereGoing(true)
    else
      entity2.rotation.set(0, 0, 0)
  } else {
    entity1.idle()
    if (entity1.lookAtDirection)
      entity1.lookAt(entity2.position)
    else
      entity1.rotation.set(0, 0, 0)

    entity2.idle()
    if (entity2.lookAtDirection)
      entity2.lookAt(entity1.position)
    else
      entity2.rotation.set(0, 0, 0)
  }

  entity1.update()
  entity2.update()
  entity1.bounce(boundaries)
  entity2.bounce(boundaries)

  renderer.render(scene, camera)
}()

document.addEventListener('mousedown', onClick, true)

function onClick(event) {
  if (event.altKey) {
    const mouse3D = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0)
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(mouse3D, camera)
    const intersects = raycaster.intersectObjects(scene.children)
    if (intersects.length > 0)
      entity1.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z)

  }
}
