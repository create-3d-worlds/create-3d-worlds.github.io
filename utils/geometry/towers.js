import * as THREE from 'three'
import { createBox } from '/utils/geometry.js'
import { centerMesh, adjustHeight } from '/utils/helpers.js'
import * as BufferGeometryUtils from '/node_modules/three/examples/jsm/utils/BufferGeometryUtils.js'

const CIRCLE = Math.PI * 2

// TOWER OF BABEL

function createCircle({ r = 100, y = 0, size = 10, color } = {}) {
  const blocks = []
  const blocksInCirle = 15
  const step = CIRCLE / blocksInCirle
  for (let i = 0; i <= CIRCLE; i += step) {
    const x = Math.cos(i) * r
    const z = Math.sin(i) * r
    const block = createBox({ size, depth: 2 * size, color })
    block.position.set(x, y, z)
    block.rotateY(-i)
    blocks.push(block)
  }
  return blocks
}

export function createBabelTower({ floors = 5, size = 10, r = 50 } = {}) {
  const group = new THREE.Group()
  for (let i = 0; i < floors; i++)
    group.add(...createCircle({ r: r - i * 5, y: i * size, size }))
  return group
}

export function createBaradDur({ floors = 6, size = 20, r = 5 } = {}) {
  const group = new THREE.Group()
  for (let i = 0; i < floors; i++)
    group.add(...createCircle({ r: r - i * 5, y: i * size * .5, size, color: 0x444444 }))
  return group
}

export function createSpaceTower({ floors = 6, size = 5, r = 5 } = {}) {
  const group = new THREE.Group()
  for (let i = 0; i < floors; i++)
    group.add(...createCircle({ r: r - i * 5, y: i * size * 2, size }))
  return group
}

// STAIRWAY TO HEAVEN

export function createSpiralStairs({ floors = 5, radius = 30, stairsInCirle = 30, floorHeight = 20, depth = 6, size = 4 } = {}) {
  const stairs = new THREE.Group
  const step = CIRCLE / stairsInCirle

  for (let i = 0; i <= CIRCLE * floors; i += step) {
    const x = Math.cos(i) * radius
    const z = Math.sin(i) * radius
    const block = createBox({ depth, size })
    block.position.set(x, i * floorHeight, z)
    block.rotateY(Math.PI / 2 - i)
    stairs.add(block)
  }
  return stairs
}

// CASTLE

function buildTower({ x = 0, z = 0, radius = 15, height = 200 } = {}) {
  const towerGeometry = new THREE.CylinderGeometry(radius, radius, height * .75, 15)
  towerGeometry.translate(x, 70, z)

  const coneGeometry = new THREE.CylinderGeometry(0, radius * 1.2, height * .25, 15)
  coneGeometry.translate(x, 170, z)

  const merged = BufferGeometryUtils.mergeBufferGeometries([towerGeometry, coneGeometry])
  return merged
}

export function buildCastle({ rows = 10, brickInWall = 30, rowSize = 10, towerRadius = 20 } = {}) {
  const spacing = 0.2
  const brickSize = rowSize + spacing
  const wallWidth = brickSize * brickInWall
  const towerCoords = [
    [0, 0],
    [0, wallWidth],
    [wallWidth, 0],
    [wallWidth, wallWidth]
  ]
  const geometries = []

  const notPlaceForGate = (x, y) =>
    (x < wallWidth * 3 / 8 || x > wallWidth * 5 / 8) || y > rows * brickSize / 2  // not in center and not to hight

  const isEven = y => Math.floor(y / brickSize) % 2 == 0

  function addBlock(x, y, z) {
    const geometry = new THREE.BoxGeometry(rowSize, rowSize, rowSize)
    geometry.translate(x, y, z)
    geometries.push(geometry)
  }

  function addFourBlocks(x, y) {
    addBlock(x, y, 0)
    addBlock(x, y, wallWidth)
    addBlock(0, y, x)
    if (notPlaceForGate(x, y)) addBlock(wallWidth, y, x)
  }

  function buildRow(y, x) {
    if (x > wallWidth + 1) return
    if (y < brickSize * (rows - 1))
      addFourBlocks(x, y)
    else if (isEven(x)) addFourBlocks(x, y)
    buildRow(y, x + brickSize)
  }

  function buildWalls(y) {
    if (y > brickSize * rows) return
    const startX = isEven(y) ? 0 : brickSize / 2
    buildRow(y, startX)
    buildWalls(y + brickSize)
  }

  buildWalls(0)

  towerCoords.forEach(([x, z]) => {
    const geometry = buildTower({ x, z, radius: towerRadius })
    geometries.push(geometry)
  })

  const merged = BufferGeometryUtils.mergeBufferGeometries(geometries)
  merged.rotateY(-Math.PI / 2)
  const castle = new THREE.Mesh(merged, new THREE.MeshNormalMaterial())
  centerMesh(castle)
  adjustHeight(castle)
  return castle
}

export function createStoneCircles({ radius = 5, height = 3, total = 12 } = {}) {
  const group = new THREE.Group()
  const CIRCLE = 2 * Math.PI
  for (let degree = 0; degree <= CIRCLE; degree += CIRCLE / total) {
    const cube = createBox({ height, color: 0xffffff, castShadow: true, receiveShadow: true })
    cube.position.set(Math.cos(degree) * radius, 0, Math.sin(degree) * radius)
    cube.rotation.y = -degree
    group.add(cube)
  }
  return group
}
