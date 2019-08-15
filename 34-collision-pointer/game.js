import { scene, renderer, camera, createOrbitControls } from '../utils/three-scene.js'
import { createPlane, createSketchTrees } from '../utils/three-helpers.js'
import PlayerBox from '../classes/PlayerBox.js'

const player = new PlayerBox()
scene.add(player.mesh)

scene.background = new THREE.Color(0xccddff)
scene.fog = new THREE.Fog(0xccddff, 500, 2000)
const ambient = new THREE.AmbientLight(0xffffff)
scene.add(ambient)

camera.position.y = 100
player.add(camera)

createOrbitControls()

const {group, solids} = createSketchTrees()
scene.add(group)
const plane = createPlane()
scene.add(plane)
player.plane = plane

/* INIT */

void function animate() {
  requestAnimationFrame(animate)
  player.update(solids)
  renderer.render(scene, camera)
}()
