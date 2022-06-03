import * as THREE from '/node_modules/three127/build/three.module.js'
import { renderer, camera } from '/utils/scene.js'
import { initLights } from '/utils/light.js'
import { CIRCLE } from '/utils/constants.js'
import { scene, createTerrain, createBall, createCrate } from '/utils/physics.js'

camera.position.set(80, 40, 80)
camera.lookAt(new THREE.Vector3(0, 0, 0))

initLights({ scene, position: [0, 50, 120] })

function addSphere() {
  const sphere = createBall({ r: 3 })
  setRandPosition(sphere)
  scene.add(sphere)
}

function addBlock() {
  const cube = createCrate({ size: 5 })
  setRandPosition(cube)
  scene.add(cube)
}

const ground = createTerrain({ size: 200, rotationY: 0.5 })
scene.add(ground)

function setRandPosition(obj) {
  obj.position.set(Math.random() * 20 - 45, 40, Math.random() * 20 - 5)
  obj.rotation.set(Math.random() * CIRCLE, Math.random() * CIRCLE, Math.random() * CIRCLE)
}

/* LOOP */

void function render() {
  requestAnimationFrame(render)
  renderer.render(scene, camera)
  scene.simulate()
}()

/* EVENTS */

document.addEventListener('click', () => {
  if (Math.random() > .5) addSphere()
  else addBlock()
})
