import * as THREE from 'three'
import GameObject from '/utils/actor/GameObject.js'

function createCoin() {
  const geometry = new THREE.CylinderGeometry(1, 1, 0.2, 32)
  const material = new THREE.MeshPhongMaterial({ color: 0xffd700, metalness: 1, roughness: 0 })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.rotation.x = Math.PI / 2
  mesh.position.y = 1
  return mesh
}

export default class Coin extends GameObject {
  constructor({ pos } = {}) {
    super({ mesh: createCoin(), name: 'coin', pos })
  }
}