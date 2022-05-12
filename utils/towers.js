import * as THREE from '/node_modules/three108/build/three.module.js'
import { createBox } from '/utils/boxes.js'

const CIRCLE = Math.PI * 2

function createCircle(radius = 100, y = 0) {
  const blocks = []
  const blocksInCirle = 20
  const step = CIRCLE / blocksInCirle
  for (let i = 0; i <= CIRCLE; i += step) {
    const x = Math.cos(i) * radius
    const z = Math.sin(i) * radius
    const block = createBox({ x, y, z, zModifier: 2 })
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

export function createSpiralStairs(floors, stairsInCirle = 20, yDistance = 80) {
  const radius = 100
  const stairs = new THREE.Group
  const step = CIRCLE / stairsInCirle

  for (let i = 0; i <= CIRCLE * floors; i += step) {
    const x = Math.cos(i) * radius
    const z = Math.sin(i) * radius
    const block = createBox({ x, y: i * yDistance, z, zModifier: 2 })
    block.rotateY(Math.PI / 2 - i)
    stairs.add(block)
  }
  return stairs
}
