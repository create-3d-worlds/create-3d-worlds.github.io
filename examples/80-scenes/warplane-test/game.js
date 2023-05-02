import * as THREE from 'three'
import { camera, scene, renderer, clock } from '/utils/scene.js'
import { createWorldSphere } from '/utils/geometry.js'
import { createFir } from '/utils/geometry/trees.js'
import { hemLight } from '/utils/light.js'

const { randFloat } = THREE.MathUtils

const worldRadius = 1000
const treeInterval = 500
const trees = []
const pos = new THREE.Vector3()

/* LIGHT & CAMERA */

hemLight({ skyColor: 0xfffafa, groundColor: 0x000000, intensity: .9 })
scene.fog = new THREE.FogExp2(0xE5C5AB, .0025)

camera.position.set(0, worldRadius * .75, worldRadius * .75)

/* INIT */

const earth = createWorldSphere({ r: worldRadius, segments: 100, color: 0x91A566, distort: 10 })
earth.position.set(0, -24, 2) // ??
scene.add(earth)

/* FUNCTIONS */

function addTree() {
  const tree = createFir()
  const spherical = new THREE.Spherical(worldRadius - .3, randFloat(1.5, 1.7), -earth.rotation.x + 5)
  tree.position.setFromSpherical(spherical)
  tree.quaternion.setFromUnitVectors(
    tree.position.clone().normalize(),
    earth.position.clone().normalize()
  )
  tree.rotateX(randFloat(-Math.PI / 10, Math.PI / 10))
  trees.push(tree)
  earth.add(tree)
}

function updateTrees() {
  trees.forEach(tree => {
    pos.setFromMatrixPosition(tree.matrixWorld)
    if (pos.z > camera.position.z) {
      trees.splice(trees.indexOf(tree), 1)
      scene.remove(tree)
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
    addTree()
    last = Date.now()
  }
  updateTrees()

  renderer.render(scene, camera)
}()
