import * as THREE from '/node_modules/three108/build/three.module.js'
import { camera, createFullScene, renderer, createOrbitControls } from '/utils/scene.js'
import { cameraFollowObject } from '/utils/helpers.js'
import { createHillyTerrain } from '/utils/ground/createHillyTerrain.js'
import keyboard from '/classes/Keyboard.js'
import Zeppelin from '/classes/Zeppelin.js'

const scene = createFullScene()
scene.remove(scene.getObjectByName('hemisphereLight')) // BUG: sa svetlom puca terrain

const controls = createOrbitControls()

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.15)
directionalLight.position.set(500, 2000, 0)
scene.add(directionalLight)

const ground = createHillyTerrain(
  { size: 10000, y: 100, color: 0x33aa33, factorX : 5, factorZ : 2.5, factorY : 200 })
scene.add(ground)

const zeppelin = new Zeppelin(mesh => {
  scene.add(mesh)
  mesh.position.y = 256
  controls.target = mesh.position
  scene.getObjectByName('sunLight').target = mesh
})

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  zeppelin.update()

  if (!keyboard.mouseDown)
    cameraFollowObject(camera, zeppelin.mesh, { y: 30 })
  renderer.render(scene, camera)
}()