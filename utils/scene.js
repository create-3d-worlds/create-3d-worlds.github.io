import * as THREE from '/node_modules/three108/build/three.module.js'
import { OrbitControls } from '/node_modules/three108/examples/jsm/controls/OrbitControls.js'
import { createBlueSky } from './sky.js'
import { createSunLight } from './light.js'
import { createGround } from './ground.js'

export const clock = new THREE.Clock()
export const scene = new THREE.Scene()

const hemisphereLight = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75)
hemisphereLight.position.set(0.5, 1, 0.75)
// scene.add(hemisphereLight) // puca procedural terrain, TODO: napraviti izuzetak!

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
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/* FUNCTIONS */

export function createFullScene(floorParam, skyParam, lightParam, fogParam = {}) {
  scene.add(createGround(floorParam))
  scene.add(createBlueSky(skyParam))
  const light = createSunLight(lightParam)
  // const helper = new THREE.CameraHelper(light.shadow.camera)
  // scene.add(helper)
  scene.add(light)
  const { color = 0xffffff, near = 1, far = 5000 } = fogParam
  scene.fog = new THREE.Fog(color, near, far)
  return scene
}

export function createOrbitControls(cam = camera, el = renderer.domElement) {
  const controls = new OrbitControls(cam, el)
  controls.maxPolarAngle = Math.PI / 2 - 0.1 // prevent bellow ground, negde ne radi, za avion radi
  // controls.maxDistance = 20
  controls.enableKeys = false
  controls.minDistance = 2
  controls.zoomSpeed = .3
  controls.enableDamping = true
  controls.dampingFactor = 0.1
  return controls
}
