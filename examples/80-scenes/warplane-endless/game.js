import * as THREE from 'three'
import { camera, scene, renderer, clock } from '/utils/scene.js'
import { createWorldSphere } from '/utils/geometry.js'
import { createFir } from '/utils/geometry/trees.js'
import { hemLight } from '/utils/light.js'
import Warplane from '/utils/aircraft/derived/Messerschmitt.js'

const { randFloat } = THREE.MathUtils

let last = Date.now()

const r = 1000
const interval = 200
const objects = []
const pos = new THREE.Vector3()
const spherical = new THREE.Spherical()

hemLight({ skyColor: 0xfffafa, groundColor: 0x000000, intensity: .9 })
scene.fog = new THREE.FogExp2(0xE5C5AB, .005)

const earth = createWorldSphere({ r, segments: 100, color: 0x91A566, distort: 10 })
earth.position.y = -r
scene.add(earth)

const aircraft = new Warplane({ camera })
scene.add(aircraft.mesh)

/* FUNCTIONS */

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

  earth.rotateY(.2 * delta)
  aircraft.update(delta)

  if (Date.now() - last >= interval) {
    addTree()
    last = Date.now()
  }
  updateObjects()

  renderer.render(scene, camera)
}()
