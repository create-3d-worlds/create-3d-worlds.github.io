import * as THREE from 'three'
import { scene, renderer, clock, camera } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { createTerrain } from '/utils/ground.js'
import { createFirTree } from '/utils/geometry/trees.js' // createSimpleFir
import { createWarehouse, createWarehouse2, createWarRuin, createRuin, createAirport } from '/utils/city.js'
import Tower from '/utils/objects/Tower.js'
import Building from '/utils/objects/Building.js'
import { loadModel } from '/utils/loaders.js'
import Score from '/utils/io/Score.js'

const { randInt, randFloatSpread } = THREE.MathUtils
const startScreen = document.getElementById('start-screen')

let i = 0
let time = 0
let last = Date.now()
let pause = true
let warplane

const totalTime = 300
const mapSize = 800
const buildingInterval = 2000
const buildingDistance = mapSize * .4
const groundDistance = mapSize * .99
const updatables = []
const objects = []

const score = new Score({ subtitle: 'Time left', total: totalTime, endText: 'Bravo! <br>You have completed the mission.' })

scene.fog = new THREE.Fog(0xE5C5AB, mapSize * .25, buildingDistance)
scene.add(new THREE.HemisphereLight(0xD7D2D2, 0x302B2F, .25))
scene.add(createSun({ pos: [50, 200, 50] }))

const groundParams = { size: mapSize, color: 0x91A566, colorRange: .1, segments: 50, min: 0, max: 15 }
const ground = createTerrain(groundParams)
const ground2 = createTerrain(groundParams)
ground2.position.z = -groundDistance
scene.add(ground, ground2)

/* OBJECTS */

const factory = await loadModel({ file: 'building/factory/model.fbx', size: 25 })

const addMesh = (mesh, spread = .33) => {
  mesh.position.copy({ x: randFloatSpread(mapSize * spread), y: 0, z: -buildingDistance })
  scene.add(mesh)
  objects.push(mesh)
}

const createBuilding = time => {
  const minutes = Math.floor(time / 60)
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

const addBuilding = time => {
  const building = createBuilding(time)
  updatables.push(building)
  addMesh(building.mesh)
}

const addTree = () => addMesh(createFirTree(), .4)

const spawnObjects = () => {
  if (i++ % 5 === 0) addTree()

  if (Date.now() - last >= buildingInterval) {
    addBuilding(time)
    last = Date.now()
  }
}

/* UPDATES */

const moveGround = deltaSpeed => [ground, ground2].forEach(g => {
  g.translateZ(deltaSpeed)
  if (g.position.z >= mapSize * .75) g.position.z = -groundDistance
})

const moveMesh = (mesh, deltaSpeed) => {
  mesh.translateZ(deltaSpeed)
  if (mesh.position.z > camera.position.z + 200) {
    objects.splice(objects.indexOf(mesh), 1)
    scene.remove(mesh)
  }
}

const updateObjects = (delta, deltaSpeed) => updatables.forEach(object => {
  if (object.name != 'player') moveMesh(object.mesh, deltaSpeed)
  if (object.hitAmount) {
    if (object.name == 'factory') score.update(1)
    if (object.name == 'civil') {
      score.renderTempText('No! Destruction of civilian buildings is a war crime.')
      score.update(-1)
    }
  }
  object.update(delta)
})

void function update() {
  requestAnimationFrame(update)
  renderer.render(scene, camera)
  if (pause) return

  const delta = clock.getDelta()
  const deltaSpeed = warplane.speed * delta
  time += delta

  moveGround(deltaSpeed)
  updateObjects(delta, deltaSpeed)

  if (warplane.dead)
    return setTimeout(() => score.renderText('You have failed.'), 2500)

  let timeLeft = totalTime - Math.floor(time)
  if (timeLeft <= 0) timeLeft = 0

  score.update(0, timeLeft)

  if (time < totalTime - 10) spawnObjects()

  if (time >= totalTime) warplane.land(delta)
}()

/* EVENTS */

startScreen.addEventListener('click', e => {
  if (e.target.tagName != 'INPUT') return
  startScreen.style.display = 'none'
  score.renderTempText('Destroy enemy factories, do not target civilian buildings', 2000)

  const promise = import(`/utils/aircraft/derived/${e.target.id}.js`)
  promise.then(obj => {
    pause = false
    warplane = new obj.default({ camera, limit: mapSize * .25 })
    scene.add(warplane.mesh)
    updatables.push(warplane)
  })
})