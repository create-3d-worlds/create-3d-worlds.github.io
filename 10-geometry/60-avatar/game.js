import * as THREE from '/node_modules/three108/build/three.module.js'
import {scene, camera, renderer} from '/utils/scene.js'

camera.position.z = 300

const material = new THREE.MeshNormalMaterial()
const telo = new THREE.SphereGeometry(100)
const avatar = new THREE.Mesh(telo, material)

const ud = new THREE.SphereGeometry(50)
const desna_ruka = new THREE.Mesh(ud, material)
desna_ruka.position.set(-150, 0, 0)
avatar.add(desna_ruka)

const leva_ruka = new THREE.Mesh(ud, material)
leva_ruka.position.set(150, 0, 0)
avatar.add(leva_ruka)

const desna_noga = new THREE.Mesh(ud, material)
desna_noga.position.set(70, -120, 0)
avatar.add(desna_noga)

const leva_noga = new THREE.Mesh(ud, material)
leva_noga.position.set(-70, -120, 0)
avatar.add(leva_noga)

scene.add(avatar)

/* LOOP */

void function animiraj() {
  requestAnimationFrame(animiraj)
  renderer.render(scene, camera)
}()
