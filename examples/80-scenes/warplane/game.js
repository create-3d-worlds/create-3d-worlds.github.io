import * as THREE from 'three'
import { scene, renderer, clock, createOrbitControls } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { createTerrain2 } from '/utils/ground.js'
import Warplane from '/utils/aircrafts/Warplane.js'
import { createFirTree } from '/utils/geometry/trees.js'
import { putOnSolids } from '/utils/helpers.js'

const { randFloatSpread } = THREE.MathUtils

let distance = -100
const mapSize = 2000
const startZ = -mapSize * .99
const speed = 125
const treeInterval = 100

createOrbitControls()

const trees = []

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 500)
camera.position.set(30, 100, 50)

scene.fog = new THREE.Fog(0xE5C5AB, 200, 600)
scene.add(new THREE.HemisphereLight(0xD7D2D2, 0x302B2F, .25))
scene.add(createSun({ pos: [50, 250, 50] }))

const ground = createTerrain2()
const ground2 = createTerrain2()
ground2.position.z = startZ

const aircraft = new Warplane()

scene.add(ground, ground2, aircraft.mesh)

/* FUNCTIONS */

const getPos = () => ({ x: randFloatSpread(mapSize / 2), y: 0, z: distance })

function addTree() {
  const tree = createFirTree({ size: 10, ...getPos() })
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

const last = Date.now()

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
