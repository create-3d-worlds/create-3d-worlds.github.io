import * as THREE from 'three'
import { clone } from '/node_modules/three/examples/jsm/utils/SkeletonUtils.js'
import { scene, renderer, clock, camera, createOrbitControls } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { createTerrain } from '/utils/ground.js'
import { createFirTree } from '/utils/geometry/trees.js' // createSimpleFir
import { loadModel } from '/utils/loaders.js'
import { createWarehouse, createWarehouse2, createWarRuin, createRuin, createAirport } from '/utils/city.js'
import Tower from '/utils/objects/Tower.js'

const startScreen = document.getElementById('start-screen')

const { randInt, randFloatSpread } = THREE.MathUtils

let i = 0
let last = Date.now()
let elapsedTime = 0
let pause = true
let warplane

const speed = 1.25
const objects = []
const updatables = []
const mapSize = 800
const distance = mapSize * .4
const interval = 2000
const groundZ = -mapSize * .99

createOrbitControls()

scene.fog = new THREE.Fog(0xE5C5AB, mapSize * .25, distance)
scene.add(new THREE.HemisphereLight(0xD7D2D2, 0x302B2F, .25))
scene.add(createSun({ pos: [50, 200, 50] }))

const groundParams = { size: mapSize, color: 0x91A566, colorRange: .1, segments: 50, min: 0, max: 15 }
const ground = createTerrain(groundParams)
const ground2 = createTerrain(groundParams)
ground2.position.z = groundZ
scene.add(ground, ground2)

/* OBJECTS */

const factory = await loadModel({ file: 'building/factory/model.fbx', size: 25 })
factory.name = 'factory'

const addObject = (mesh, spread = .33) => {
  mesh.position.copy({ x: randFloatSpread(mapSize * spread), y: 0, z: -distance })
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

const addTree = () => addObject(createFirTree(), .4)

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
  renderer.render(scene, camera)
  const delta = clock.getDelta()
  if (pause) return

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
}()

/* EVENTS */

startScreen.addEventListener('click', e => {
  if (e.target.tagName != 'INPUT') return
  startScreen.style.display = 'none'
  const promise = import(`/utils/aircraft/derived/${e.target.id}.js`)
  promise.then(obj => {
    pause = false
    warplane = new obj.default({ camera, limit: mapSize * .25 })
    scene.add(warplane.mesh)
    updatables.push(warplane)
  })
})