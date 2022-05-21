/* global THREE, Physijs */
import { camera, renderer, createOrbitControls } from '/utils/scene.js'
Physijs.scripts.worker = '/libs/physijs_worker.js'
Physijs.scripts.ammo = 'ammo.js' // relativ to the worker

createOrbitControls()

const scene = new Physijs.Scene()
scene.setGravity(new THREE.Vector3(0, -50, 0))

camera.position.set(60, 50, 60)
camera.lookAt(scene.position)

scene.add(createRigidBox())
scene.add(createRigidGround())

/* FUNCTIONS */

function createRigidBox(x = 0, y = 50, z = 0, size = 10) {
  const boxFriction = 0.5
  const boxBounciness = 0.6
  const boxMaterial = Physijs.createMaterial(
    new THREE.MeshNormalMaterial(), boxFriction, boxBounciness
  )
  const box = new Physijs.BoxMesh(
    new THREE.BoxGeometry(size, size, size),
    boxMaterial
  )
  box.position.set(x, y, z)
  box.rotation.z = Math.random() * Math.PI
  box.rotation.y = Math.random() * Math.PI
  return box
}

function createRigidGround(size = 150) {
  const groundFriction = 0.8
  const groundBounciness = 0.4
  const groundMaterial = Physijs.createMaterial(
    new THREE.MeshBasicMaterial(), groundFriction, groundBounciness
  )
  const ground = new Physijs.BoxMesh(
    new THREE.PlaneGeometry(size, size), groundMaterial, 0
  )
  ground.rotateX(- Math.PI / 2)
  return ground
}

/* UPDATE */

let timeStep = 0

void function update() {
  window.requestAnimationFrame(update)
  scene.simulate()
  if (timeStep++ > 100) {
    scene.add(createRigidBox())
    timeStep = 0
  }
  renderer.render(scene, camera)
}()
