import {FirstPersonControls} from '../node_modules/three/examples/jsm/controls/FirstPersonControls.js'
import {nemesis as map} from '../data/maps.js'
import { scene, camera, renderer, clock } from '../utils/3d-scene.js'
import Tilemap3D from '../classes/Tilemap3D.js'

const tilemap = new Tilemap3D(map, 100)
scene.add(tilemap.createFloor())
scene.add(tilemap.createWalls())

camera.position.y = 10

const controls = new FirstPersonControls(camera)
controls.movementSpeed = 50
controls.lookSpeed = 0.06
controls.lookVertical = false // inace propada kroz pod bez kolizije

const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75)
scene.add(light)

/* INIT */

void function animate() {
  requestAnimationFrame(animate)	
  const delta = clock.getDelta()
  controls.update(delta)
  renderer.render(scene, camera)
}()