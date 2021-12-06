import * as THREE from '/node_modules/three108/build/three.module.js'
import { camera, createFullScene, renderer, createOrbitControls } from '/utils/scene.js'
import { terrain, updateTerrain } from '../../utils/dynamic-terrain/index.js'
import { cameraFollowObject } from '/utils/helpers.js'
import keyboard from '/classes/Keyboard.js'
import Zeppelin from '/classes/Zeppelin.js'

const scene = createFullScene()
const controls = createOrbitControls()

scene.remove(scene.getObjectByName('hemisphereLight')) // BUG: sa svetlom puca terrain

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

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  zeppelin.update()
  if (zeppelin.mesh)
    updateTerrain(zeppelin.direction.x, -zeppelin.direction.z)
  if (!keyboard.mouseDown)
    cameraFollowObject(camera, zeppelin.mesh, { y: 30 })
  renderer.render(scene, camera)
}()