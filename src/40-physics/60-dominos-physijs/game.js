import * as THREE from '/node_modules/three119/build/three.module.js'
import Physijs from '/libs/physi-ecma.js'
Physijs.scripts.worker = '/libs/physijs_worker.js'
Physijs.scripts.ammo = './ammo.js'
import { renderer, camera, createOrbitControls } from '/utils/scene.js'
import { initLights } from '/utils/light.js'
import { createDominos, createGround } from '/utils/physics.js'

const scene = new Physijs.Scene
scene.setGravity(new THREE.Vector3(0, -50, 0))

createOrbitControls()
camera.position.set(10, 10, 50)
initLights({ scene })

const ground = createGround({ size: 100, file: 'wood_1024.png' })
scene.add(ground)
const blocks = createDominos()
blocks.forEach(block => scene.add(block))

/* FUNCTIONS */


/* LOOP */

void function render() {
  requestAnimationFrame(render)
  renderer.render(scene, camera)
  scene.simulate()
}()

/* EVENTS */

window.addEventListener('dblclick', () => {
  // TODO: apply force
  blocks[0].rotation.x = 0.4
  blocks[0].__dirtyRotation = true
})
