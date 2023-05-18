import * as THREE from 'three'
import { clone } from '/node_modules/three/examples/jsm/utils/SkeletonUtils.js'
import { camera, scene, renderer, clock } from '/utils/scene.js'
import { createWorldSphere } from '/utils/geometry.js'
import { createFir } from '/utils/geometry/trees.js'
import { createSun } from '/utils/light.js'
import { loadModel } from '/utils/loaders.js'
import Warplane from '/utils/aircraft/derived/Messerschmitt.js'
import { createWarehouse, createWarehouse2, createWarRuin, createRuin, createAirport } from '/utils/city.js'
import Tower from '/utils/objects/Tower.js'

const { randFloat, randInt } = THREE.MathUtils

let last = Date.now()
let i = 0

const r = 1000
const speed = .05
const interval = 200
const objects = []
const pos = new THREE.Vector3()
const spherical = new THREE.Spherical()

scene.fog = new THREE.FogExp2(0xE5C5AB, .005)
scene.add(new THREE.HemisphereLight(0xD7D2D2, 0x302B2F, .25))
scene.add(createSun({ pos: [50, 200, 50], intensity: .9 }))

const earth = createWorldSphere({ r, segments: 100, color: 0x91A566, distort: 10 })
earth.position.y = -r
scene.add(earth)

const warplane = new Warplane({ camera, speed: 50, y: 25 })
warplane.chaseCamera.far = r * .5
warplane.chaseCamera.speed = 30
scene.add(warplane.mesh)

const updatables = [warplane]

/* OBJECTS */

const factory = await loadModel({ file: 'building/factory/model.fbx', size: 25 })

function addObject(mesh) {
  const radius = r - .3
  const phi = randFloat(Math.PI * .45, Math.PI * .55) // left, right
  const theta = -earth.rotation.x + 3.33 * Math.PI
  spherical.set(radius, phi, theta)
  mesh.position.setFromSpherical(spherical)
  mesh.quaternion.setFromUnitVectors(
    mesh.position.clone().normalize(), earth.position.clone().normalize()
  )
  earth.add(mesh)
  objects.push(mesh)
}

const createBuilding = () => {
  switch (randInt(1, 7)) {
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

const addBuilding = () => addObject(createBuilding())

const addTree = () => addObject(createFir())

/* UPDATES */

function updateObjects() {
  objects.forEach(tree => {
    pos.setFromMatrixPosition(tree.matrixWorld)
    if (pos.z > camera.position.z) {
      objects.splice(objects.indexOf(tree), 1)
      scene.remove(tree)
    }
  })
}

void function update() {
  requestAnimationFrame(update)
  const delta = clock.getDelta()

  earth.rotateY(speed * delta)
  // warplane.update(delta)
  updatables.forEach(element => element.update(delta))

  if (i % 10 === 0) addTree()

  if (Date.now() - last >= interval) {
    addBuilding()
    last = Date.now()
  }
  updateObjects()

  i++
  renderer.render(scene, camera)
}()
