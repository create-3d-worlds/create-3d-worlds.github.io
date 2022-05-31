import * as THREE from '/node_modules/three119/build/three.module.js'
import Physijs from '/libs/physi-ecma.js'
Physijs.scripts.worker = '/libs/physijs_worker.js'
Physijs.scripts.ammo = './ammo.js'
import { renderer, camera, createOrbitControls } from '/utils/scene.js'
import { initLights } from '/utils/light.js'
import { DEGREE } from '/utils/constants.js'
import { createBlock, createGround } from '/utils/physics.js'

const numDominos = 1000

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

function createDominos() {
  const blocks = []
  const r = 27
  let circleOffset = 0
  let j = 0
  for (let i = 0; i < numDominos; i += 6 + circleOffset) {
    circleOffset = 4.5 * (i / 360)
    const block = createBlock({ width: 1, height: 6, depth: 2, color: ++j % 2 ? 0x000000 : 0xffffff })
    const x = (r / 1440) * (1440 - i) * Math.cos(i * DEGREE)
    const z = (r / 1440) * (1440 - i) * Math.sin(i * DEGREE)
    // redosled naredna tri koraka je bitan
    block.position.set(x, 0, z)
    block.lookAt(new THREE.Vector3(0, 0, 0)) // orientate towards the center
    block.position.y = 3.5
    blocks.push(block)
  }
  return blocks
}

/* LOOP */

void function render() {
  requestAnimationFrame(render)
  renderer.render(scene, camera)
  scene.simulate()
}()

/* EVENTS */

window.addEventListener('dblclick', () => {
  blocks[0].rotation.x = 0.4 // first block to fall
  blocks[0].__dirtyRotation = true
})
