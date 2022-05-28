/* global THREE */
import renderer from './renderer.js'
import camera from './camera.js'

const controls = new THREE.OrbitControls(camera, renderer.domElement)

export default controls
