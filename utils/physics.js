import * as THREE from '/node_modules/three119/build/three.module.js'
import Physijs from '/libs/physi-ecma.js'

Physijs.scripts.worker = '/libs/physijs_worker.js'
Physijs.scripts.ammo = 'ammo.js' // relative to the worker

/* BOX */

export function createBox({ width = 1, height = 1, depth = 1, friction = .5, bounciness = .6, color = 0xdddddd } = {}) {
  const geometry = new THREE.BoxGeometry(width, height, depth)
  const material = Physijs.createMaterial(
    new THREE.MeshLambertMaterial({ color }), friction, bounciness
  )
  const mesh = new Physijs.BoxMesh(geometry, material)
  return mesh
}

export const createBlock = () =>
  createBox({ width: 6, height: 1, depth: 1.5, friction: .4, bounciness: .4, color: 0xff0000 })

/* FLOOR */

export function createGround({ size = 150, color = 0x666666, friction = .8, bounciness = .4 } = {}) {
  const material = Physijs.createMaterial(
    new THREE.MeshBasicMaterial({ color }), friction, bounciness
  )
  const mesh = new Physijs.BoxMesh(
    new THREE.PlaneGeometry(size, size), material, 0, // mass
  )
  mesh.rotateX(- Math.PI / 2)
  return mesh
}

/* STRUCTURES */

export function createBlockTower(scene) {
  const block_height = 1
  const block_offset = 2
  const rows = 16
  for (let i = 0; i < rows; i++)
    for (let j = 0; j < 3; j++) {
      const block = createBlock({ height: block_height })
      block.position.y = (block_height / 2) + block_height * i
      if (i % 2 === 0) {
        block.rotation.y = Math.PI / 2.01 // there's a bug when it's to close to 2
        block.position.x = block_offset * j - (block_offset * 3 / 2 - block_offset / 2)
      } else
        block.position.z = block_offset * j - (block_offset * 3 / 2 - block_offset / 2)
      scene.add(block)
    }
}