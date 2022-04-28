import * as THREE from '/node_modules/three108/build/three.module.js'
import { camera, scene, renderer, hemLight, createOrbitControls } from '/utils/scene.js'

createOrbitControls()
camera.position.set(0, 2, 6)

hemLight()

scene.background = new THREE.Color(0x8FBCD4)
scene.add(createTrain())

function createTrain() {
  const train = new THREE.Group()
  // materials
  const redMaterial = new THREE.MeshStandardMaterial({ color: 0xff1111 })
  const blackMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 })
  // geometries
  const noseGeo = new THREE.CylinderBufferGeometry(0.75, 0.75, 3, 12)
  const cabinGeo = new THREE.BoxBufferGeometry(2, 2.25, 1.5)
  const chimneyGeo = new THREE.CylinderBufferGeometry(0.3, 0.1, 0.5)
  const wheelGeo = new THREE.CylinderBufferGeometry(0.4, 0.4, 1.75, 16)
  wheelGeo.rotateX(Math.PI / 2)
  // meshes
  const nose = new THREE.Mesh(noseGeo, redMaterial)
  nose.rotation.z = Math.PI / 2
  nose.position.x = -1
  const cabin = new THREE.Mesh(cabinGeo, redMaterial)
  cabin.position.set(1.5, 0.4, 0)
  const chimney = new THREE.Mesh(chimneyGeo, blackMaterial)
  chimney.position.set(-2, 0.9, 0)
  const smallWheelRear = new THREE.Mesh(wheelGeo, blackMaterial)
  smallWheelRear.position.set(0, -0.5, 0)
  const smallWheelCenter = smallWheelRear.clone()
  smallWheelCenter.position.x = -1
  const smallWheelFront = smallWheelRear.clone()
  smallWheelFront.position.x = -2
  const bigWheel = smallWheelRear.clone()
  bigWheel.scale.set(2, 2, 1.25)
  bigWheel.position.set(1.5, -0.1, 0)
  train.add(nose, cabin, chimney, smallWheelRear, smallWheelCenter, smallWheelFront, bigWheel)
  return train
}

/* LOOP */

renderer.setAnimationLoop(() => {
  renderer.render(scene, camera)
})
