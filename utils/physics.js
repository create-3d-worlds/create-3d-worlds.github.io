import * as THREE from '/node_modules/three119/build/three.module.js'
import Physijs from '/libs/physi-ecma.js'

Physijs.scripts.worker = '/libs/physijs_worker.js'
Physijs.scripts.ammo = 'ammo.js' // relativ to the worker

/* BOX */

export function createRigidBox({ size = 1, friction = 0.5, bounciness = 0.6 } = {}) {
  const boxMaterial = Physijs.createMaterial(
    new THREE.MeshNormalMaterial(), friction, bounciness
  )
  const box = new Physijs.BoxMesh(
    new THREE.BoxGeometry(size, size, size),
    boxMaterial
  )
  return box
}

/* FLOOR */

export function createRigidGround({ size = 150, color = 0x666666, friction = 0.8, bounciness = 0.4 } = {}) {
  const groundMaterial = Physijs.createMaterial(
    new THREE.MeshBasicMaterial({ color }), friction, bounciness
  )
  const ground = new Physijs.BoxMesh(
    new THREE.PlaneGeometry(size, size), groundMaterial, 0
  )
  ground.rotateX(- Math.PI / 2)
  return ground
}
