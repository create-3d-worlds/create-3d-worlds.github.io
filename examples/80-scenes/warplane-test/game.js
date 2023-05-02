import * as THREE from 'three'
import { camera, scene, renderer, clock } from '/utils/scene.js'
import { createWorldSphere } from '/utils/geometry.js'
import { createFir } from '/utils/geometry/trees.js'
import { hemLight } from '/utils/light.js'

const { randFloat, randInt } = THREE.MathUtils

const worldRadius = 1000
const treeInterval = 500
const treesInPool = 100

const treesPool = []
const activeTrees = []

/* LIGHT & CAMERA */

hemLight({ skyColor: 0xfffafa, groundColor: 0x000000, intensity: .9 })
scene.fog = new THREE.FogExp2(0xE5C5AB, .0025)

camera.position.set(0, worldRadius * .75, worldRadius * .75)

/* INIT */

const earth = createWorldSphere({ r: worldRadius, segments: 100, color: 0x91A566, distort: 10 })
earth.position.set(0, -24, 2) // ??
scene.add(earth)

for (let i = 0; i < treesInPool; i++)
  treesPool.push(createFir())

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

  const spherical = new THREE.Spherical()
  const tree = treesPool.pop()
  tree.visible = true
  activeTrees.push(tree)
  spherical.set(worldRadius - 0.3, randFloat(1.5, 1.7), -earth.rotation.x + 4)
  addTree(tree, spherical)
}

function updateTrees() {
  const treePos = new THREE.Vector3()
  activeTrees.forEach(tree => {
    if (!tree.visible) return

    treePos.setFromMatrixPosition(tree.matrixWorld)
    if (treePos.z > camera.position.z) { // gone out of view
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
  const delta = clock.getDelta()

  earth.rotation.x += .2 * delta

  if (Date.now() - last >= treeInterval) {
    addLaneTree()
    last = Date.now()
  }

  updateTrees()
  renderer.render(scene, camera)
}()
