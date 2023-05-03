import * as THREE from 'three'
import { scene, renderer, camera, clock, createOrbitControls } from '/utils/scene.js'
import { createSun, hemLight } from '/utils/light.js'
import { createTerrain } from '/utils/ground.js'
import Warplane from '/utils/aircrafts/Warplane.js'
import { createTree } from '/utils/geometry/trees.js'
import { putOnSolids } from '/utils/helpers.js'

const mapSize = 2000
const startZ = -mapSize * .99

createOrbitControls()

const trees = []

camera.position.set(30, 100, 50)
camera.far = 500
camera.updateProjectionMatrix()

scene.fog = new THREE.Fog(0xE5C5AB, 200, 600)
scene.add(new THREE.HemisphereLight(0xD7D2D2, 0x302B2F, .25))
scene.add(createSun({ pos: [50, 250, 50] }))

const createGround = () =>
  new createTerrain({ size: mapSize, segments: 100, factor: 7, color: 0x91A566, colorRange: .05 })

const ground = createGround()
const ground2 = createGround()
ground2.position.z = startZ

const aircraft = new Warplane()

scene.add(ground, ground2, aircraft.mesh)

/* FUNCTIONS */

let distance = 100

function addTree() {
  const range = 200
  const tree = createTree({ size: 10 })
  tree.position.x = Math.random() * range - range / 2
  distance += 100
  tree.position.z = -distance
  putOnSolids(tree, ground)
  ground.add(tree)
  trees.push(tree)
}

/* LOOP */

void function update() {
  requestAnimationFrame(update)
  const delta = clock.getDelta()

  // if (trees.length < 20)
  //   addTree()

  ;[ground, ground2].forEach(g => {
    g.translateZ(125 * delta)
    if (g.position.z >= mapSize * .75) g.position.z = startZ
  })

  aircraft.update(delta)
  camera.lookAt(aircraft.mesh.position)

  renderer.render(scene, camera)
}()

/* LOOP */

document.addEventListener('click', () => {
  addTree()
})