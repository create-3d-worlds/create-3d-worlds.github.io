import * as THREE from '/node_modules/three119/build/three.module.js'
import Physijs from '/libs/physi-ecma.js'
import { camera, renderer, createOrbitControls } from '/utils/scene.js'
import { createRigidBox, createRigidGround } from '/utils/physics.js'

createOrbitControls()

const scene = new Physijs.Scene()
scene.setGravity(new THREE.Vector3(0, -50, 0))

scene.add(createRigidGround())

/* LOOP */

let timeStep = 0

void function update() {
  window.requestAnimationFrame(update)
  scene.simulate()
  if (timeStep++ > 100) {
    const box = createRigidBox()
    box.position.y = 5
    box.rotation.z = Math.random() * Math.PI
    box.rotation.y = Math.random() * Math.PI
    scene.add(box)
    timeStep = 0
  }
  renderer.render(scene, camera)
}()
