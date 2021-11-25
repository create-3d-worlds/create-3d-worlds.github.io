import * as THREE from '/node_modules/three108/build/three.module.js'
import { createFullScene, renderer, createOrbitControls } from '/utils/scene.js'
import { createTerrain } from '/utils/ground.js'
import { cameraFollowObject } from '/utils/helpers.js'
import Airplane from '/classes/Airplane.js'
import keyboard from '/classes/Keyboard.js'

/**
 * TODO:
 * srediti komande: skretanje, spuštanje, dizanje, brzinu
 * dodati sunce, drveće
 * probati pticu
 */

const scene = createFullScene({ color:0xFFC880 }, undefined, undefined, { color: 0xE5C5AB })
scene.add(createTerrain(4000, 200))

const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 5000)
camera.position.set(0, 10, 250)
const controls = createOrbitControls(camera)

const player = new Airplane(() => {
  scene.add(player.mesh)
  controls.target = player.mesh.position
  scene.getObjectByName('sunLight').target = player.mesh
})

/* UPDATE */

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  player.update()
  if (!keyboard.mouseDown)
    cameraFollowObject(camera, player.mesh)
  renderer.render(scene, camera)
}()
