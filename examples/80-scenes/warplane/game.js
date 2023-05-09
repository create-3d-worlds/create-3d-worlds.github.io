import * as THREE from 'three'
import { clone } from '/node_modules/three/examples/jsm/utils/SkeletonUtils.js'
import { scene, renderer, clock, createOrbitControls } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { createTerrain } from '/utils/ground.js'
import Warplane from '/utils/aircraft/Warplane.js'
import { createFirTree } from '/utils/geometry/trees.js'
import { loadModel } from '/utils/loaders.js'
import { createWarehouse, createWarehouse2, createWarRuin, createRuin, createAirport } from '/utils/city.js'
import Tower from '/utils/objects/Tower.js'
import Stats from '/node_modules/three/examples/jsm/libs/stats.module.js'

const stats = new Stats()
document.body.appendChild(stats.dom)

const { randInt, randFloatSpread } = THREE.MathUtils

let i = 0
let last = Date.now()

const layer = []
const mapSize = 800
const distance = mapSize / 2
const speed = 20
const interval = 2000
const groundZ = -mapSize * .99

createOrbitControls()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, mapSize * .6)
// camera.position.set(10, 56, 16)

scene.fog = new THREE.Fog(0xE5C5AB, 200, distance)
scene.add(new THREE.HemisphereLight(0xD7D2D2, 0x302B2F, .25))
scene.add(createSun({ pos: [50, 200, 50] }))

const ground = createTerrain({ size: mapSize, color: 0x91A566, colorRange: .1 })
const ground2 = createTerrain({ size: mapSize, color: 0x91A566, colorRange: .1 })
ground2.position.z = groundZ

const aircraft = new Warplane()
aircraft.add(camera)
camera.position.z = 20

scene.add(ground, ground2, aircraft.mesh)
const updatables = [aircraft, stats]

/* OBJECTS */

const factory = await loadModel({ file: 'building/factory/model.fbx', size: 28 })

const addObject = (mesh = createFirTree()) => {
  mesh.position.copy({ x: randFloatSpread(mapSize / 2), y: 0, z: -distance })
  scene.add(mesh)
  layer.push(mesh)
}

const createBuilding = () => {
  switch (randInt(1, 1)) {
    case 1:
      const tower = new Tower()
      updatables.push(tower)
      return tower.mesh
    case 2: return clone(factory)
    case 3: return createWarehouse2()
    case 4: return createWarRuin()
    case 5: return createRuin()
    case 6: return createAirport()
    case 7: return createWarehouse()
  }
}

const addBuilding = () => addObject(createBuilding())

const addTree = () => addObject(createFirTree())

/* UPDATES */

const updateGround = deltaSpeed => [ground, ground2].forEach(g => {
  g.translateZ(deltaSpeed)
  if (g.position.z >= mapSize * .75) g.position.z = groundZ
})

const updateLayer = deltaSpeed => layer.forEach(mesh => {
  mesh.translateZ(deltaSpeed)
  if (mesh.position.z > camera.position.z + 200) {
    layer.splice(layer.indexOf(mesh), 1)
    scene.remove(mesh)
  }
})

void function update() {
  requestAnimationFrame(update)
  const delta = clock.getDelta()
  const deltaSpeed = speed * delta

  updateGround(deltaSpeed)
  updateLayer(deltaSpeed)
  updatables.forEach(element => element.update(delta))
  camera.lookAt(aircraft.mesh.position)

  if (i % 5 === 0) addTree()

  if (Date.now() - last >= interval) {
    addBuilding()
    last = Date.now()
  }

  i++
  renderer.render(scene, camera)
}()
