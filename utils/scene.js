import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js'

export const scene = new THREE.Scene()

const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 1)
light.position.set(0.5, 1, 0.75)
scene.add(light)

export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000)
camera.position.z = 250
camera.lookAt(scene.position)

export const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.style.margin = 0
document.body.appendChild(renderer.domElement)
renderer.domElement.focus()

export const clock = new THREE.Clock()

/* FUNCTIONS */

export function createOrbitControls() {
  const controls = new OrbitControls(camera, renderer.domElement)
  // controls.maxPolarAngle = Math.PI / 2 - 0.1 // prevent bellow ground
  controls.minDistance = 2
  // controls.maxDistance = 20
  controls.zoomSpeed = .3
  controls.enableKeys = false
  return controls
}
