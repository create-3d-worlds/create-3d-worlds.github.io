import * as THREE from '/node_modules/three108/build/three.module.js'
import { camera, scene, renderer, createOrbitControls } from '/utils/scene.js'
import { cameraFollowObject } from '/utils/helpers.js'
import { createHillyTerrain } from '/utils/ground/createHillyTerrain.js'
import { createGradientSky } from '/utils/sky.js'
import { createSunLight } from '/utils/sun.js'
import { createGround } from '/utils/ground.js'
import keyboard from '/classes/Keyboard.js'
import Zeppelin from '/classes/Zeppelin.js'

scene.add(createGradientSky({ r: 5000 }))
const light = createSunLight({ x: 500, y: 2000, z: 100, far: 5000 })
scene.add(light)
scene.remove(scene.getObjectByName('hemisphereLight')) // BUG: sa svetlom puca terrain
scene.fog = new THREE.Fog(0xffffff, 1, 5000)
const water = createGround({ color: 0x003133 })
scene.add(water)

const controls = createOrbitControls()

const ground = createHillyTerrain({ size: 10000, y: 100, factorX : 5, factorZ : 2.5, factorY : 200 })
scene.add(ground)

const zeppelin = new Zeppelin(mesh => {
  scene.add(mesh)
  mesh.position.y = 256
  controls.target = mesh.position
  scene.getObjectByName('sunLight').target = mesh
  zeppelin.addSolids(ground, water)
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