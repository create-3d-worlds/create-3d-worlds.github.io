import * as THREE from '/node_modules/three127/build/three.module.js'
import { camera, scene, renderer, createOrbitControls } from '/utils/scene.js'
import { createGround } from '/utils/ground.js'

const textureLoader = new THREE.TextureLoader()

createOrbitControls()
camera.position.set(0, 50, 100)

scene.add(createGround({ size: 100 }))

// skybox

const directions = ['xpos', 'xneg', 'ypos', 'yneg', 'zpos', 'zneg']
const skyGeometry = new THREE.BoxGeometry(5000, 5000, 5000)

const materialArray = []
for (let i = 0; i < 6; i++)
  materialArray.push(new THREE.MeshBasicMaterial({
    map: textureLoader.load('images/dawnmountain-' + directions[i] + '.png'),
    side: THREE.BackSide
  }))

const skyBox = new THREE.Mesh(skyGeometry, materialArray)
scene.add(skyBox)

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()
