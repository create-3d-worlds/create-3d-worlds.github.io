/* global THREE */

import DirectionalLight from './DirectionalLight.js'

const scene = new THREE.Scene()
scene.fog = new THREE.Fog(0xE5C5AB, 200, 950)
scene.add(
  new THREE.HemisphereLight(0xD7D2D2, 0x302B2F, .9),
  new DirectionalLight(0xffffff, .9),
  new THREE.AmbientLight(0x302B2F, .5)
)

export default scene
