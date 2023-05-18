import * as THREE from 'three'
import { clone } from '/node_modules/three/examples/jsm/utils/SkeletonUtils.js'
import { scene, renderer, clock, camera, createOrbitControls } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { createTerrain } from '/utils/ground.js'
import Warplane from '/utils/aircraft/derived/Messerschmitt.js'
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
let elapsedTime = 0

const speed = 2
const objects = []
const mapSize = 800
const distance = mapSize * .4
const interval = 2000
const groundZ = -mapSize * .99

createOrbitControls()

scene.fog = new THREE.Fog(0xE5C5AB, 200, distance)
scene.add(new THREE.HemisphereLight(0xD7D2D2, 0x302B2F, .25))
scene.add(createSun({ pos: [50, 200, 50] }))

const groundParams = { size: mapSize, color: 0x91A566, colorRange: .1, segments: 50, min: 0, max: 15 }
const ground = createTerrain(groundParams)
const ground2 = createTerrain(groundParams)
ground2.position.z = groundZ

const warplane = new Warplane({ camera })
warplane.chaseCamera.far = mapSize * .5

scene.add(ground, ground2, warplane.mesh)
const updatables = [warplane, stats]

/* OBJECTS */

const factory = await loadModel({ file: 'building/factory/model.fbx', size: 25 })

const addObject = mesh => {
  mesh.position.copy({ x: randFloatSpread(mapSize * .33), y: 0, z: -distance })
  scene.add(mesh)
  objects.push(mesh)
}

const createBuilding = elapsedTime => {
  const minutes = Math.floor(elapsedTime / 60)
  switch (randInt(1, 7 + minutes)) {
    case 1: return clone(factory)
    case 2: return createWarehouse2()
    case 3: return createWarRuin()
    case 4: return createRuin()
    case 5: return createAirport()
    case 6: return createWarehouse()
    default:
      const tower = new Tower()
      updatables.push(tower)
      return tower.mesh
  }
}

const addBuilding = elapsedTime => addObject(createBuilding(elapsedTime))

const addTree = () => addObject(createFirTree())

/* UPDATES */

const updateGround = deltaSpeed => [ground, ground2].forEach(g => {
  g.translateZ(deltaSpeed)
  if (g.position.z >= mapSize * .75) g.position.z = groundZ
})

const updateObjects = deltaSpeed => objects.forEach(mesh => {
  mesh.translateZ(deltaSpeed)
  if (mesh.position.z > camera.position.z + 200) {
    objects.splice(objects.indexOf(mesh), 1)
    scene.remove(mesh)
  }
})

void function update() {
  requestAnimationFrame(update)
  const delta = clock.getDelta()
  const deltaSpeed = warplane.speed * speed * delta

  updateGround(deltaSpeed)
  updateObjects(deltaSpeed)
  updatables.forEach(element => element.update(delta))

  if (i % 5 === 0) addTree()

  if (Date.now() - last >= interval) {
    addBuilding(elapsedTime)
    last = Date.now()
  }

  i++
  elapsedTime += delta
  renderer.render(scene, camera)
}()
