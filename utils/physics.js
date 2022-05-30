import * as THREE from '/node_modules/three119/build/three.module.js'
import Physijs from '/libs/physi-ecma.js'

Physijs.scripts.worker = '/libs/physijs_worker.js'
Physijs.scripts.ammo = 'ammo.js' // relativ to the worker

/* BOX */

export function createBox({ size = 1, friction = 0.5, bounciness = 0.6 } = {}) {
  const material = Physijs.createMaterial(
    new THREE.MeshNormalMaterial(), friction, bounciness
  )
  const mesh = new Physijs.BoxMesh(
    new THREE.BoxGeometry(size, size, size),
    material
  )
  return mesh
}

/* FLOOR */

/* hight friction = .9, low bounciness = .2 */
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
