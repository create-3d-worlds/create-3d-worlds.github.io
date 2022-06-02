import * as THREE from '/node_modules/three125/build/three.module.js'
import { camera, scene, renderer } from '/utils/scene.js'
import { cameraFollowObject } from '/utils/helpers.js'
import { createHillyTerrain } from '/utils/ground/createHillyTerrain.js'
import { createGradientSky } from '/utils/sky.js'
import { createSunLight } from '/utils/light.js'
import { createGround } from '/utils/ground.js'
import Zeppelin from '/classes/aircrafts/Zeppelin.js'
import keyboard from '/classes/Keyboard.js'
import { loadModel } from '/utils/loaders.js'

scene.add(createGradientSky({ r: 5000 }))
const light = createSunLight({ x: 500, y: 2000, z: 100, far: 5000 })
scene.add(light)

scene.fog = new THREE.Fog(0xffffff, 1, 5000)

const water = createGround({ color: 0x003133 })
scene.add(water)

const ground = createHillyTerrain()
scene.add(ground)

const { mesh, animations } = await loadModel({ file: 'birds/flamingo.glb', size: 1, rot: { axis: [0, 1, 0], angle: Math.PI } })

const flamingo = new Zeppelin({ mesh, animations, speed: .01, maxSpeed: .01, minHeight: 1 })
scene.add(mesh)

mesh.position.y = 30

flamingo.addSolids(ground, water)

/* LOOP */

renderer.setAnimationLoop(() => {
  flamingo.update()

  if (!keyboard.pressed.mouse) cameraFollowObject(camera, flamingo.mesh, { distance: 0.2, y: 0 })
  renderer.render(scene, camera)
})
