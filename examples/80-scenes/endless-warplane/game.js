import * as THREE from 'three'
import { camera, scene, renderer, clock, createOrbitControls } from '/utils/scene.js'
import { createWorldSphere } from '/utils/geometry.js'
import { createFir } from '/utils/geometry/trees.js'
import { hemLight } from '/utils/light.js'
import Warplane from '/utils/aircrafts/Warplane.js'

const { randFloat } = THREE.MathUtils

const r = 1000
const treeInterval = 200
const trees = []
const pos = new THREE.Vector3()
const spherical = new THREE.Spherical()

camera.position.set(0, r * .78, r * .76)

hemLight({ skyColor: 0xfffafa, groundColor: 0x000000, intensity: .9 })
scene.fog = new THREE.FogExp2(0xE5C5AB, .0025)

const earth = createWorldSphere({ r, segments: 100, color: 0x91A566, distort: 10 })
earth.position.set(0, -24, 2) // ??
scene.add(earth)

const aircraft = new Warplane()
aircraft.position.set(0, r * .74, r * .67)
scene.add(aircraft.mesh)

/* FUNCTIONS */

function addTree() {
  const tree = createFir()
  spherical.set(r - .3, randFloat(Math.PI * .45, Math.PI * .55), -earth.rotation.x + 5)
  tree.position.setFromSpherical(spherical)
  tree.quaternion.setFromUnitVectors(
    tree.position.clone().normalize(), earth.position.clone().normalize()
  )
  tree.rotateZ(randFloat(-Math.PI / 10, Math.PI / 10))
  earth.add(tree)
  trees.push(tree)
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

  earth.rotateY(.2 * delta)
  aircraft.update(delta)

  if (Date.now() - last >= treeInterval) {
    addTree()
    last = Date.now()
  }
  updateTrees()

  renderer.render(scene, camera)
}()
