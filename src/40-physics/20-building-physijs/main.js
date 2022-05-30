import * as THREE from '/node_modules/three119/build/three.module.js'
import Physijs from '/libs/physi-ecma.js'
import { camera, renderer, createOrbitControls } from '/utils/scene.js'
import { dirLight } from '/utils/light.js'
import { createGround, createBlockTower } from '/utils/physics.js'

createOrbitControls()
camera.position.set(5, 10, -15)
camera.lookAt(new THREE.Vector3(0, 10, 0))

const scene = new Physijs.Scene()
scene.setGravity(new THREE.Vector3(0, -30, 0))

dirLight({ scene, position: [20, 30, -5], intensity: 1.75 })

const floor = createGround({ size: 50, friction: .9 })
scene.add(floor)

createBlockTower(scene)

/* LOOPS */

void function render() {
  requestAnimationFrame(render)
  scene.simulate()
  renderer.render(scene, camera)
}()

/* EVENTS */

document.addEventListener('click', () => {
  scene.setGravity(new THREE.Vector3(0, -30, 10))
})