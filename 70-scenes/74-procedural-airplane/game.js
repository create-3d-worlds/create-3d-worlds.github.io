import * as THREE from '/node_modules/three108/build/three.module.js'
import { camera, createFullScene, renderer, createOrbitControls } from '/utils/scene.js'
import { terrain, updateTerrain, renderTerrain } from './terrain.js'
import { cameraFollowObject } from '/utils/helpers.js'
import keyboard from '/classes/Keyboard.js'
import Zeppelin from '/classes/Zeppelin.js'

const scene = createFullScene()
scene.remove(scene.getObjectByName('hemisphereLight')) // puca procedural terrain

const controls = createOrbitControls()

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.15)
directionalLight.position.set(500, 2000, 0)
scene.add(directionalLight)

scene.add(terrain)

const zeppelin = new Zeppelin(() => {
  scene.add(zeppelin.mesh)
  zeppelin.mesh.position.y = 256
  controls.target = zeppelin.mesh.position
  scene.getObjectByName('sunLight').target = zeppelin.mesh
})

const getPos = () => ({
  x: zeppelin.direction.x * 2,
  y: -zeppelin.direction.z * 2,
})

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  zeppelin.update()
  if (zeppelin.mesh)
    updateTerrain(getPos())
  renderTerrain()
  if (!keyboard.mouseDown)
    cameraFollowObject(camera, zeppelin.mesh, { y: 30 })
  renderer.render(scene, camera)
}()