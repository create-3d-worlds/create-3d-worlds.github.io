import * as THREE from '/node_modules/three108/build/three.module.js'
import { camera, scene, renderer, createOrbitControls } from '/utils/scene.js'
import { terrain, updateTerrain, renderTerrain } from './terrain.js'
import { cameraFollowObject } from '/utils/helpers.js'
import keyboard from '/classes/Keyboard.js'
import Airplane from '/classes/Airplane.js'

const controls = createOrbitControls()
camera.position.set(-1200, 800, 1200)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.15)
directionalLight.position.set(500, 2000, 0)
scene.add(directionalLight)

scene.add(terrain)

const avion = new Airplane(() => {
  scene.add(avion.mesh)
  avion.mesh.position.y = 256
  controls.target = avion.mesh.position
  // scene.getObjectByName('sunLight').target = avion.mesh
})

const getPos = () => ({
  x: avion.direction.x,
  y: -avion.direction.z,
})

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  avion.update()
  // if (avion.mesh && keyboard.mouseDown)
  //   console.log(avion.direction)
  if (avion.mesh)
    updateTerrain(getPos())
  renderTerrain()
  renderer.render(scene, camera)
}()