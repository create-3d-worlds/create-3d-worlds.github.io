import * as THREE from '/node_modules/three108/build/three.module.js'
import { ColladaLoader } from '/node_modules/three108/examples/jsm/loaders/ColladaLoader.js'
import { createFullScene, renderer, createOrbitControls} from '/utils/scene.js'
import { createTerrain } from '/utils/ground.js'
import Airplane from '/classes/Airplane.js'

/**
 * TODO:
 * srediti komande: skretanje, spuštanje, dizanje, brzinu
 * dodati sunce, drveće
 * probati pticu
 */

let mouseDown = false
const scene = createFullScene({ color:0xFFC880 }, undefined, undefined, { color: 0xE5C5AB })
scene.add(createTerrain(4000, 200))

const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 5000)
camera.position.set(0, 10, 250)
const controls = createOrbitControls(camera)

const player = new Airplane()
scene.add(player.mesh)
// player.mesh.add(camera)
controls.target = player.position

/* UPDATE */

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  player.update()
  if (!mouseDown) {
    const  distance = 150
    const playerDir = new THREE.Vector3(0, 0, -1).applyQuaternion(player.mesh.quaternion)
    const newPosition = player.mesh.position.clone()
    newPosition.sub(playerDir.multiplyScalar(distance))
    camera.position.lerp(newPosition, 0.05)
  }

  camera.lookAt(player.mesh.position)
  renderer.render(scene, camera)
}()

/* EVENTS */

document.body.onmousedown = () => {
  mouseDown = true
}
document.body.onmouseup = () => {
  mouseDown = false
}
