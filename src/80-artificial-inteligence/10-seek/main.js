/* global THREE, SteeringEntity */
import { camera, scene, renderer, createOrbitControls } from '/utils/scene.js'
import { createFloor } from '/utils/ground.js'

const controls = createOrbitControls()

const light = new THREE.AmbientLight(0xffffff)
scene.add(light)

camera.position.set(0, 1000, 1000)
camera.lookAt(new THREE.Vector3(0, 0, 0))

const floor = createFloor({ size: 10000 })
scene.add(floor)

// Ball
const ballGeometry = new THREE.SphereGeometry(50, 32, 32)
const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xBCFF00 })
const ball = new THREE.Mesh(ballGeometry, ballMaterial)
ball.position.set(Math.random() * (5000 - (-5000)) + (-5000), 50, Math.random() * (5000 - (-5000)) + (-5000))
scene.add(ball)

// Entity Mesh
const geometry = new THREE.BoxGeometry(100, 200, 50)
const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: true })
const mesh = new THREE.Mesh(geometry, material)
mesh.position.setY(100)

// Entity
const entity = new SteeringEntity(mesh)
entity.position.set(Math.random() * (5000 - (-5000)) + (-5000), 0, Math.random() * (5000 - (-5000)) + (-5000))
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
      entity.lookAt(new THREE.Vector3(ball.position.x, entity.position.y, ball.position.z))
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
