import * as THREE from 'three'
import { clone } from '/node_modules/three/examples/jsm/utils/SkeletonUtils.js'
import { scene, renderer, clock, createOrbitControls } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { createTerrain } from '/utils/ground.js'
import Warplane from '/utils/aircrafts/Warplane.js'
import { createFirTree } from '/utils/geometry/trees.js'
import { sample, putOnSolids } from '/utils/helpers.js'
import { loadModel } from '/utils/loaders.js'
import { createWarehouse, createWarehouse2, createWarRuin, createRuin, createAirport } from '/utils/city.js'
import Stats from '/node_modules/three/examples/jsm/libs/stats.module.js'

const stats = new Stats()
document.body.appendChild(stats.dom)

const { randFloatSpread } = THREE.MathUtils

let last = Date.now()
let i = 0

const objects = []
const mapSize = 1000
const distance = mapSize / 2
const speed = 60
const treeInterval = 500
const groundZ = -mapSize * .99

createOrbitControls()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 600)
camera.position.set(10, 56, 16)

scene.fog = new THREE.Fog(0xE5C5AB, 200, distance)
scene.add(new THREE.HemisphereLight(0xD7D2D2, 0x302B2F, .25))
scene.add(createSun({ pos: [50, 200, 50] }))

const ground = createTerrain({ size: mapSize, color: 0x91A566, colorRange: .1 })
const ground2 = createTerrain({ size: mapSize, color: 0x91A566, colorRange: .1 })
ground2.position.z = groundZ

const aircraft = new Warplane()

scene.add(ground, ground2, aircraft.mesh)

/* FUNCTIONS */

const factory = await loadModel({ file: 'building/factory/model.fbx', size: 28 })
const tower = await loadModel({ file: 'building/tower/ww2/D85VT1X9UHDSYASVUM1UY02HA.obj', mtl: 'building/tower/ww2/D85VT1X9UHDSYASVUM1UY02HA.mtl', size: 20, shouldAdjustHeight: true })
const warehouse = createWarehouse()
const warehouse2 = createWarehouse2()
const warRuin = createWarRuin()
const airport = createAirport()
const ruin = createRuin()

const getPos = () => ({ x: randFloatSpread(mapSize / 2), y: 0, z: -distance })

const addObject = (mesh = createFirTree()) => {
  mesh.position.copy(getPos())
  putOnSolids(mesh, ground)
  console.log(mesh.position.y)
  scene.add(mesh)
  objects.push(mesh)
}

const addBuilding = () => {
  const mesh = (clone(sample([tower, warehouse, warehouse2, warRuin, airport, ruin, factory])))
  addObject(mesh)
}

const addTree = () => addObject(createFirTree())

/* LOOP */

const updateObjects = deltaSpeed => {
  objects.forEach(mesh => {
    mesh.translateZ(deltaSpeed)
    if (mesh.position.z > camera.position.z + 200) {
      objects.splice(objects.indexOf(mesh), 1)
      scene.remove(mesh)
    }
  })
}

const updateGround = deltaSpeed => {
  [ground, ground2].forEach(g => {
    g.translateZ(deltaSpeed)
    if (g.position.z >= mapSize * .75) g.position.z = groundZ
  })
}

void function update() {
  requestAnimationFrame(update)
  const delta = clock.getDelta()
  const deltaSpeed = speed * delta

  updateGround(deltaSpeed)
  aircraft.update(delta)
  camera.lookAt(aircraft.mesh.position)
  updateObjects(deltaSpeed)

  if (i % 5 === 0)
    addTree()

  if (Date.now() - last >= treeInterval) {
    addBuilding()
    last = Date.now()
  }

  stats.update()
  i++
  renderer.render(scene, camera)
}()
