/* global THREE */
import { scene, camera, renderer, createOrbitControls, initLights } from '/utils/scene.js'

initLights()
createOrbitControls()

camera.position.set(1, 1, 1)
camera.lookAt(new THREE.Vector3(0, 0.4, 0))

const map = new THREE.TextureLoader().load('textures/WoodBarrel_2k_d.jpg')
const material = new THREE.MeshPhongMaterial({ map })

const loader = new THREE.LegacyJSONLoader()
loader.load('/assets/models/barrel.js', geometry => {
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)
})

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}()
