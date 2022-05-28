import * as THREE from '/node_modules/three119/build/three.module.js'

const camera = new THREE.PerspectiveCamera(
  60, window.innerWidth / window.innerHeight, 1, 1000
)
camera.position.set(-68, 143, -90) // z: 0 stavlja kameru iza

export default camera
