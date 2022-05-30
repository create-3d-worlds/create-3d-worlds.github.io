import * as THREE from '/node_modules/three119/build/three.module.js'
import * as CANNON from '/node_modules/cannon-es/dist/cannon-es.js'
import { RIGHT_ANGLE } from '/utils/constants.js'

export function createFloor({ size = 100, color = 0x777777 } = {}) {
  const geometry = new THREE.PlaneGeometry(100, 100, 1, 1)
  const material = new THREE.MeshLambertMaterial({ color: 0x777777 })
  const floor = new THREE.Mesh(geometry, material)
  geometry.rotateX(-RIGHT_ANGLE)
  floor.receiveShadow = true
  return floor
}