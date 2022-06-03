import * as THREE from '/node_modules/three127/build/three.module.js'
import { camera, renderer } from '/utils/scene.js'
import { dirLight } from '/utils/light.js'
import { scene, createGround, createBlockTower } from '/utils/physics.js'

camera.position.set(-5, 10, 15)
camera.lookAt(new THREE.Vector3(0, 10, 0))

dirLight({ scene, intensity: 1.75 })

const floor = createGround({ size: 50, friction: .9 })
scene.add(floor)

const blocks = createBlockTower({ rows: 16 })
blocks.forEach(block => scene.add(block))

/* LOOPS */

void function render() {
  requestAnimationFrame(render)
  scene.simulate()
  renderer.render(scene, camera)
}()

/* EVENTS */

document.addEventListener('click', () => {
  scene.setGravity(new THREE.Vector3(0, -30, -10))
})