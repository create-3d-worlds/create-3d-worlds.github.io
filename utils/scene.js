import * as THREE from '/node_modules/three108/build/three.module.js'
import { OrbitControls } from '/node_modules/three108/examples/jsm/controls/OrbitControls.js'
import { createBlueSky } from './sky.js'
import { createSunLight } from './light.js'
import { createFloor } from './floor.js'

export const clock = new THREE.Clock()
export const scene = new THREE.Scene()

const hemiLight = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75)
// const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6)
hemiLight.position.set(0.5, 1, 0.75)
scene.add(hemiLight)

// CAMERA

export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000)
camera.position.z = 250
camera.lookAt(scene.position)

export const renderer = new THREE.WebGLRenderer()
document.body.appendChild(renderer.domElement)
document.body.style.margin = 0
renderer.domElement.focus()
renderer.outputEncoding = THREE.sRGBEncoding
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true

/* FUNCTIONS */

export function createFullScene(floorParam, skyParam, lightParam) {
  // scene.background = new THREE.Color().setHSL(0.6, 0, 1)
  scene.fog = new THREE.Fog(0xffffff, 1, 5000) // color, near, far
  scene.add(createFloor(floorParam))
  scene.add(createBlueSky(skyParam))
  scene.add(createSunLight(lightParam))
  return scene
}

export function createOrbitControls() {
  const controls = new OrbitControls(camera, renderer.domElement)
  // controls.maxPolarAngle = Math.PI / 2 - 0.1 // prevent bellow ground
  // controls.maxDistance = 20
  controls.enableKeys = false
  controls.minDistance = 2
  controls.zoomSpeed = .3
  controls.enableDamping = true
  controls.dampingFactor = 0.1
  return controls
}
