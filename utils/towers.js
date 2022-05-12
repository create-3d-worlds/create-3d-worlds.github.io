import * as THREE from '/node_modules/three108/build/three.module.js'
import { createStair } from '/utils/boxes.js'

const CIRCLE = Math.PI * 2

function createCircle(radius = 100, y = 0) {
  const blocks = []
  const blocksInCirle = 20
  const step = CIRCLE / blocksInCirle
  for (let i = 0; i <= CIRCLE; i += step) {
    const x = Math.cos(i) * radius
    const z = Math.sin(i) * radius
    const block = createStair(x, y, z)
    block.rotateY(-i)
    blocks.push(block)
  }
  return blocks
}

export function createBabelTower({ floors = 5 } = {}) {
  const group = new THREE.Group()
  for (let i = 0; i < floors; i++)
    group.add(...createCircle(100 - i * 10, i * 20))
  return group
}
