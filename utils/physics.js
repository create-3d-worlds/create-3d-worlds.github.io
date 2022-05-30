import * as THREE from '/node_modules/three119/build/three.module.js'
import Physijs from '/libs/physi-ecma.js'

Physijs.scripts.worker = '/libs/physijs_worker.js'
Physijs.scripts.ammo = 'ammo.js' // relativ to the worker

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
