import * as THREE from 'three'
import { clone } from '/node_modules/three/examples/jsm/utils/SkeletonUtils.js'

import { scene, renderer, clock, createOrbitControls } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { createTerrain2 } from '/utils/ground.js'
import Warplane from '/utils/aircrafts/Warplane.js'
import { createFirTree } from '/utils/geometry/trees.js'
import { sample } from '/utils/helpers.js'
import { loadModel } from '/utils/loaders.js'
import { createTexturedBuilding } from '/utils/city.js'

const { randFloatSpread } = THREE.MathUtils

let last = Date.now()

const objects = []
const mapSize = 1000
const distance = 500
const speed = 60
const treeInterval = 500
const groundZ = -mapSize * .99

createOrbitControls()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 600)
camera.position.set(10, 56, 16)

scene.fog = new THREE.Fog(0xE5C5AB, 200, distance)
scene.add(new THREE.HemisphereLight(0xD7D2D2, 0x302B2F, .25))
scene.add(createSun({ pos: [50, 250, 50] }))

const ground = createTerrain2()
const ground2 = createTerrain2()
ground2.position.z = groundZ

const aircraft = new Warplane()

scene.add(ground, ground2, aircraft.mesh)

/* FUNCTIONS */

const getPos = () => ({ x: randFloatSpread(mapSize / 2), y: 0, z: -distance })

const factory = await loadModel({ file: 'building/factory/model.fbx', size: 28 })

const addObject = (mesh = createFirTree()) => {
  mesh.position.copy(getPos())
  scene.add(mesh)
  objects.push(mesh)
}

const warehouse = createTexturedBuilding({ width: 20, height: 10, depth: 10, defaultFile: 'buildings/warehouse.jpg', files: [null, null, 'terrain/concrete.jpg'], halfOnSides: true })

const warehouse2 = createTexturedBuilding({ width: 20, height: 10, depth: 20, defaultFile: 'buildings/warehouse.jpg', files: [null, null, 'terrain/concrete.jpg'] })

const warRuin = createTexturedBuilding({ width: 12, height: 10, depth: 10, defaultFile: 'buildings/ruin-01.jpg', files: [null, null, 'terrain/beton-krater.jpg'], halfOnSides: true })

const airport = createTexturedBuilding({ width: 20, height: 10, depth: 10, defaultFile: 'buildings/airport.png', files: [null, null, 'terrain/beton.gif'], halfOnSides: true })

const ruin = createTexturedBuilding({ width: 15, height: 10, depth: 10, defaultFile: 'buildings/ruin-front.jpg', halfOnSides: true })

const addBuilding = () => {
  const mesh = (clone(sample([warehouse, warehouse2, warRuin, airport, ruin, factory])))
  addObject(mesh)
}

const addTree = () => addObject(createFirTree())

/* LOOP */

const updateObjects = deltaSpeed => {
  objects.forEach(mesh => {
    mesh.translateZ(deltaSpeed)
    if (mesh.position.z > camera.position.z + 500) {
      objects.splice(objects.indexOf(mesh), 1)
      scene.remove(mesh)
    }
  })
}

void function update() {
  requestAnimationFrame(update)
  const delta = clock.getDelta()
  const deltaSpeed = speed * delta

  ;[ground, ground2].forEach(g => {
    g.translateZ(deltaSpeed)
    if (g.position.z >= mapSize * .75) g.position.z = groundZ
  })

  aircraft.update(delta)
  camera.lookAt(aircraft.mesh.position)

  addTree()

  if (Date.now() - last >= treeInterval) {
    addBuilding()
    last = Date.now()
  }
  updateObjects(deltaSpeed)

  renderer.render(scene, camera)
}()
