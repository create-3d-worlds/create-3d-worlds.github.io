import { scene, renderer, camera, createOrbitControls } from '../utils/three-scene.js'
import { createPlane, createSketchTrees } from '../utils/three-helpers.js'
import PlayerBox from '../classes/PlayerBox.js'

const player = new PlayerBox()
scene.add(player.mesh)

scene.background = new THREE.Color(0xccddff)
scene.fog = new THREE.Fog(0xccddff, 500, 2000)
const ambient = new THREE.AmbientLight(0xffffff)
scene.add(ambient)
const hemisphereLight = new THREE.HemisphereLight(0xdddddd, 0x000000, 0.5)
scene.add(hemisphereLight)

camera.position.z = -200
camera.position.y = 100
player.add(camera)
createOrbitControls()

const plane = createPlane()
scene.add(plane)
const trees = createSketchTrees()
scene.add(trees.group)

/* INIT */

void function animate() {
  requestAnimationFrame(animate)
  player.update(trees.solids)
  renderer.render(scene, camera)
}()

/* EVENTS */

function updateRaycast(e) {
  e.preventDefault()
  const raycaster = new THREE.Raycaster()
  player.movements = []

  const x = e.clientX / renderer.domElement.clientWidth * 2 - 1
  const y = -e.clientY / renderer.domElement.clientHeight * 2 + 1

  raycaster.setFromCamera({x, y}, camera)
  const intersects = raycaster.intersectObjects([plane]) // must be array
  if (intersects.length > 0) player.movements.push(intersects[0].point)
}

document.addEventListener('mousedown', updateRaycast)
