import * as THREE from 'three'
import { camera, scene, renderer, clock } from '/utils/scene.js'
import { createWorldSphere } from '/utils/geometry.js'
import { createFir } from '/utils/geometry/trees.js'
import { hemLight } from '/utils/light.js'

const { randFloat, randInt } = THREE.MathUtils

const worldSpeed = 0.007
const worldRadius = 30
const treeInterval = 500
const treesInPool = 10

const treesPool = []
const activeTrees = []

/* LIGHT & CAMERA */

hemLight({ skyColor: 0xfffafa, groundColor: 0x000000, intensity: .9 })

scene.fog = new THREE.FogExp2(0xf0fff0, 0.1)

camera.position.set(0, 10, 10)
clock.start()

/* INIT */

const earth = createWorldSphere({ r: worldRadius, segments: 100, color: 0x91A566 }) // distort: 15
earth.position.set(0, -24, 2)
scene.add(earth)

for (let i = 0; i < treesInPool; i++)
  treesPool.push(createFir({ size: 1 }))

/* FUNCTIONS */

function addTree(tree, spherical) {
  tree.position.setFromSpherical(spherical)
  const worldVector = earth.position.clone().normalize()
  const treeVector = tree.position.clone().normalize()
  tree.quaternion.setFromUnitVectors(treeVector, worldVector)
  tree.rotation.x += randFloat(-Math.PI / 10, Math.PI / 10)
  earth.add(tree)
}

function addLaneTree() {
  if (treesPool.length == 0) return

  const lane = randInt(0, 2)
  const pathAngleValues = [1.52, 1.57, 1.62]
  const spherical = new THREE.Spherical()
  const tree = treesPool.pop()
  tree.visible = true
  activeTrees.push(tree)
  spherical.set(worldRadius - 0.3, pathAngleValues[lane], -earth.rotation.x + 4)
  addTree(tree, spherical)
}

function updateTrees() {
  const treePos = new THREE.Vector3()
  activeTrees.forEach(tree => {
    if (!tree.visible) return

    treePos.setFromMatrixPosition(tree.matrixWorld)
    if (treePos.z > 6) { // gone out of view
      activeTrees.splice(activeTrees.indexOf(tree), 1)
      treesPool.push(tree)
      tree.visible = false
    }
  })
}

/* LOOP */

let last = Date.now()

void function update() {
  requestAnimationFrame(update)

  earth.rotation.x += worldSpeed

  if (Date.now() - last >= treeInterval) {
    addLaneTree()
    last = Date.now()
  }

  updateTrees()
  renderer.render(scene, camera)
}()
