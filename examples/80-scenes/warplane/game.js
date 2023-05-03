import * as THREE from 'three'
import { scene, renderer, camera, clock, createOrbitControls } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { createTerrain2 } from '/utils/ground.js'
import Warplane from '/utils/aircrafts/Warplane.js'
import { createFir } from '/utils/geometry/trees.js'
import { putOnSolids } from '/utils/helpers.js'

const { randFloat, randFloatSpread } = THREE.MathUtils

let distance = -100
const mapSize = 2000
const startZ = -mapSize * .99
const speed = 125
const treeInterval = 100

createOrbitControls()

const trees = []

camera.position.set(30, 100, 50)
camera.far = 500
camera.updateProjectionMatrix()

scene.fog = new THREE.Fog(0xE5C5AB, 200, 600)
scene.add(new THREE.HemisphereLight(0xD7D2D2, 0x302B2F, .25))
scene.add(createSun({ pos: [50, 250, 50] }))

const ground = createTerrain2()
const ground2 = createTerrain2()
ground2.position.z = startZ

const aircraft = new Warplane()

scene.add(ground, ground2, aircraft.mesh)

/* FUNCTIONS */

function addTree(range = mapSize / 2) {
  const tree = createFir({ size: 10 })
  tree.position.x = randFloatSpread(range)
  tree.position.z = distance
  putOnSolids(tree, ground)
  scene.add(tree)
  trees.push(tree)
}

function updateTrees(deltaSpeed) {
  trees.forEach(tree => {
    tree.translateZ(deltaSpeed)
    if (tree.position.z > camera.position.z + 500) {
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
  const deltaSpeed = speed * delta

  ;[ground, ground2].forEach(g => {
    g.translateZ(deltaSpeed)
    distance -= deltaSpeed
    if (g.position.z >= mapSize * .75) g.position.z = startZ
  })

  aircraft.update(delta)
  camera.lookAt(aircraft.mesh.position)

  // if (Date.now() - last >= treeInterval) {
  addTree()
  //   last = Date.now()
  // }
  updateTrees(deltaSpeed)

  renderer.render(scene, camera)
}()
