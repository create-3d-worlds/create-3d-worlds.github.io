import * as THREE from '/node_modules/three108/build/three.module.js'
import {camera, scene, renderer, createOrbitControls} from '/utils/scene.js'

createOrbitControls()
camera.position.set(0, 50, 100)
camera.lookAt(scene.position)

const textureLoader = new THREE.TextureLoader()

// floor

const floorMaterial = new THREE.MeshBasicMaterial({side: THREE.DoubleSide})
const floorGeometry = new THREE.PlaneGeometry(100, 100, 10, 10)
const floor = new THREE.Mesh(floorGeometry, floorMaterial)
floor.rotation.x = -Math.PI / 2
scene.add(floor)

// skybox

const directions = ['xpos', 'xneg', 'ypos', 'yneg', 'zpos', 'zneg']
const skyGeometry = new THREE.CubeGeometry(5000, 5000, 5000)

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
