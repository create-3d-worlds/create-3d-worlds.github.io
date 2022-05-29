import * as THREE from '/node_modules/three119/build/three.module.js'
import Physijs from '/libs/physi-ecma.js'

Physijs.scripts.worker = '/libs/physijs_worker.js'
Physijs.scripts.ammo = 'ammo.js' // relativ to the worker

export function createRigidBox(x = 0, y = 50, z = 0, size = 10) {
  const boxFriction = 0.5
  const boxBounciness = 0.6
  const boxMaterial = Physijs.createMaterial(
    new THREE.MeshNormalMaterial(), boxFriction, boxBounciness
  )
  const box = new Physijs.BoxMesh(
    new THREE.BoxGeometry(size, size, size),
    boxMaterial
  )
  box.position.set(x, y, z)
  box.rotation.z = Math.random() * Math.PI
  box.rotation.y = Math.random() * Math.PI
  return box
}

export function createRigidGround(size = 150) {
  const groundFriction = 0.8
  const groundBounciness = 0.4
  const groundMaterial = Physijs.createMaterial(
    new THREE.MeshBasicMaterial(), groundFriction, groundBounciness
  )
  const ground = new Physijs.BoxMesh(
    new THREE.PlaneGeometry(size, size), groundMaterial, 0
  )
  ground.rotateX(- Math.PI / 2)
  return ground
}
