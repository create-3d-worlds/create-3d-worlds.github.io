import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'

camera.position.y = 50

createOrbitControls()

/* FUNCTIONS */

function buildTower({ x = 0, z = 0, towerRadius = 15, height = 200 } = {}) {
  const tower = new THREE.Mesh(
    new THREE.CylinderGeometry(towerRadius, towerRadius, height * .75, 15), new THREE.MeshNormalMaterial())
  tower.position.set(x, 70, z)
  scene.add(tower)
  const cone = new THREE.Mesh(new THREE.CylinderGeometry(0, towerRadius * 1.2, height * .25, 15), new THREE.MeshNormalMaterial())
  cone.position.set(x, 170, z)
  scene.add(cone)
}

// brickInWall: ne sme mnogo zbog rekurzije
function buildCastle({ rows = 10, brickInWall = 24, rowSize = 10, towerRadius = 15 } = {}) {
  const spacing = 0.2
  const brickSize = rowSize + spacing
  const wallWidth = brickSize * brickInWall
  const towerCoords = [
    [0, 0],
    [0, wallWidth],
    [wallWidth, 0],
    [wallWidth, wallWidth]
  ]

  const notPlaceForDoor = (x, y) =>
    (x < wallWidth * 3 / 8 || x > wallWidth * 5 / 8) || y > rows * brickSize / 2  // not in center and not to hight

  const isEven = y => Math.floor(y / brickSize) % 2 == 0

  function addBlock(x, y, z) {
    const block = new THREE.Mesh(new THREE.BoxGeometry(rowSize, rowSize, rowSize), new THREE.MeshNormalMaterial())
    block.position.set(x, y, z)
    scene.add(block)
  }

  function addFourBlocks(x, y) {
    addBlock(x, y, 0)
    addBlock(x, y, wallWidth)
    addBlock(0, y, x)
    if (notPlaceForDoor(x, y)) addBlock(wallWidth, y, x)
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
  towerCoords.forEach(([x, z]) => buildTower({ x, z, towerRadius }))
}

buildCastle()

/* LOOP **/

void function update() {
  window.requestAnimationFrame(update)
  renderer.render(scene, camera)
}()
