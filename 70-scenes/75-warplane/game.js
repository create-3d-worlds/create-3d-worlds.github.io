import * as THREE from '/node_modules/three/build/three.module.js'
import { ColladaLoader } from '/node_modules/three/examples/jsm/loaders/ColladaLoader.js'
import { scene, renderer, camera, createOrbitControls} from '/utils/scene.js'
import Avion from './Avion.js'

let avion
let mouseDown = false

const controls = createOrbitControls()

const geometry = new THREE.CircleGeometry(5000, 32)
const material = new THREE.MeshBasicMaterial({ color: 0x006600 })
const ground = new THREE.Mesh(geometry, material)
ground.rotateX(-Math.PI / 2)
scene.add(ground)

/* UPDATE */

const animate = () => {
  requestAnimationFrame(animate)
  controls.update()
  avion.normalizePlane()
  avion.position.z += 1
  if (!mouseDown)
    camera.position.lerp(new THREE.Vector3(avion.position.x, avion.position.y, avion.position.z - 100), 0.05)
  // camera.lookAt(avion.position)
  renderer.render(scene, camera)
}

/* LOAD */

new ColladaLoader().load('/assets/models/s-e-5a/model.dae', collada => {
  avion = new Avion(collada.scene)
  avion.rotateZ(Math.PI)
  avion.position.y = 50
  controls.target = avion.position
  camera.position.set(-68, 100, -90)
  scene.add(avion, ground)
  animate()
})

/* EVENTS */

document.body.onmousedown = () => {
  mouseDown = true
}
document.body.onmouseup = () => {
  mouseDown = false
}

