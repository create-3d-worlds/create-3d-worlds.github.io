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

const trees = createSketchTrees()
scene.add(trees.group)
const plane = createPlane()
scene.add(plane)
player.plane = plane

/* INIT */

void function animate() {
  requestAnimationFrame(animate)
  player.update(trees.solids)
  renderer.render(scene, camera)
}()
