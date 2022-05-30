import * as THREE from '/node_modules/three119/build/three.module.js'
import Physijs from '/libs/physi-ecma.js'
import { camera, renderer, createOrbitControls } from '/utils/scene.js'
import { dirLight } from '/utils/light.js'
import { createGround, createBlock } from '/utils/physics.js'

const blocks = []

createOrbitControls()
camera.position.set(5, 10, -15)
camera.lookAt(new THREE.Vector3(0, 10, 0))

const scene = new Physijs.Scene({ fixedTimeStep: 1 / 120 })
scene.setGravity(new THREE.Vector3(0, -30, 0))

dirLight({ scene, position: [20, 30, -5], intensity: 1.75 })

const table = createGround({ size: 50 })
scene.add(table)

createTower()

function createTower() {
  const block_height = 1, block_offset = 2

  const rows = 16
  for (let i = 0; i < rows; i++)
    for (let j = 0; j < 3; j++) {
      const block = createBlock({ height: block_height })
      block.position.y = (block_height / 2) + block_height * i
      if (i % 2 === 0) {
        block.rotation.y = Math.PI / 2.01 // there's a bug when this is to close to 2
        block.position.x = block_offset * j - (block_offset * 3 / 2 - block_offset / 2)
      } else
        block.position.z = block_offset * j - (block_offset * 3 / 2 - block_offset / 2)
      scene.add(block)
      blocks.push(block)
    }
}

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