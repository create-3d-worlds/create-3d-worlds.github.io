import * as THREE from '/node_modules/three127/build/three.module.js'
import { FBXLoader } from '/node_modules/three127/examples/jsm/loaders/FBXLoader.js'
import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'

const files = [
  'Kachujin-Armada.fbx',
  'Kachujin-Bencao.fbx',
  'Kachujin-Breathing-Idle.fbx',
  'Kachujin-Chapa-2.fbx',
  'Kachujin-Dwarf-Idle.fbx',
  'Kachujin-Esquiva-3.fbx',
  'Kachujin-Falling-Idle.fbx',
  'Kachujin-Ginga-Variation-2.fbx',
  'Kachujin-Ginga.fbx',
  'Kachujin-Jump.fbx',
  'Kachujin-Martelo-2.fbx',
  'Kachujin-Meia-Lua-De-Compasso-Back.fbx',
  'Kachujin-Meia-Lua-De-Frente.fbx',
  'Kachujin-Mma-Kick.fbx',
  'Kachujin-Mma-Kick2.fbx',
  'Kachujin-Quad-Punch.fbx',
  'Kachujin-Queshada-2.fbx',
  'Kachujin-Slow-Run.fbx',
  'Kachujin-Walking.fbx',
  'Kachujin-Warrior-Idle.fbx',
  'Kachujin-Zombie-Punching.fbx',
]

const ambientLight = new THREE.AmbientLight()
scene.add(ambientLight)

const controls = createOrbitControls()
controls.target.set(0, 1, 0)

const fbxLoader = new FBXLoader()
fbxLoader.setPath('/assets/models/character-kachujin/')
fbxLoader.load('Kachujin.fbx', model => {
  model.scale.set(.02, .02, .02)
  scene.add(model)
  console.log(model.animations)
})

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}()