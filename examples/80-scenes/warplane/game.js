import * as THREE from 'three'
import { scene, renderer, clock, camera } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { createTerrain } from '/utils/ground.js'
import { createFirTree } from '/utils/geometry/trees.js' // createSimpleFir
import { createWarehouse, createWarehouse2, createWarRuin, createRuin, createAirport } from '/utils/city.js'
import Tower from '/utils/objects/Tower.js'
import Building from '/utils/objects/Building.js'
import { loadModel } from '/utils/loaders.js'

const startScreen = document.getElementById('start-screen')

const { randInt, randFloatSpread } = THREE.MathUtils

let i = 0
let last = Date.now()
let elapsedTime = 0
let pause = true
let warplane

const meshes = []
const updatables = []
const mapSize = 800
const distance = mapSize * .4
const interval = 2000
const startGroundZ = -mapSize * .99

scene.fog = new THREE.Fog(0xE5C5AB, mapSize * .25, distance)
scene.add(new THREE.HemisphereLight(0xD7D2D2, 0x302B2F, .25))
scene.add(createSun({ pos: [50, 200, 50] }))

const groundParams = { size: mapSize, color: 0x91A566, colorRange: .1, segments: 50, min: 0, max: 15 }
const ground = createTerrain(groundParams)
const ground2 = createTerrain(groundParams)
ground2.position.z = startGroundZ
scene.add(ground, ground2)

/* OBJECTS */

const factory = await loadModel({ file: 'building/factory/model.fbx', size: 25 })

const addMesh = (mesh, spread = .33) => {
  mesh.position.copy({ x: randFloatSpread(mapSize * spread), y: 0, z: -distance })
  scene.add(mesh)
  meshes.push(mesh)
}

const createBuilding = elapsedTime => {
  const minutes = Math.floor(elapsedTime / 60)
  switch (randInt(1, 7 + minutes)) {
    case 1: return new Building({ mesh: factory, name: 'factory' })
    case 2: return new Building({ mesh: createAirport() })
    case 3: return new Building({ mesh: createWarRuin(), name: 'civil' })
    case 4: return new Building({ mesh: createRuin(), name: 'civil' })
    case 5: return new Building({ mesh: createWarehouse() })
    case 6: return new Building({ mesh: createWarehouse2() })
    default: return new Tower()
  }
}

const addBuilding = elapsedTime => {
  const building = createBuilding(elapsedTime)
  updatables.push(building)
  addMesh(building.mesh)
}

const addTree = () => addMesh(createFirTree(), .4)

/* UPDATES */

const updateGround = deltaSpeed => [ground, ground2].forEach(g => {
  g.translateZ(deltaSpeed)
  if (g.position.z >= mapSize * .75) g.position.z = startGroundZ
})

const updateMeshes = deltaSpeed => meshes.forEach(mesh => {
  mesh.translateZ(deltaSpeed)
  if (mesh.position.z > camera.position.z + 200) {
    meshes.splice(meshes.indexOf(mesh), 1)
    scene.remove(mesh)
  }
})

void function update() {
  requestAnimationFrame(update)
  renderer.render(scene, camera)
  const delta = clock.getDelta()
  if (pause) return

  const deltaSpeed = warplane.speed * delta

  updateGround(deltaSpeed)
  updateMeshes(deltaSpeed)
  updatables.forEach(instance => {
    // check hit before update!
    if (instance.hitAmount) console.log(instance.name, instance.hitAmount)
    instance.update(delta)
  })

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