import * as THREE from '/node_modules/three119/build/three.module.js'
import Physijs from '/libs/physi-ecma.js'
import { camera, renderer, createOrbitControls } from '/utils/scene.js'
import { createBox, createGround } from '/utils/physics.js'
import { dirLight } from '/utils/light.js'

createOrbitControls()

const scene = new Physijs.Scene()
scene.setGravity(new THREE.Vector3(0, -50, 0))

scene.add(createGround())

dirLight({ scene })

/* LOOP */

let timeStep = 0

void function update() {
  window.requestAnimationFrame(update)
  scene.simulate()
  if (++timeStep % 100 == 0) {
    const box = createBox()
    box.position.y = 5
    scene.add(box)
  }
  renderer.render(scene, camera)
}()
