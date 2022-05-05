import * as THREE from '/node_modules/three108/build/three.module.js'
import { OrbitControls } from '/node_modules/three108/examples/jsm/controls/OrbitControls.js'
import { createGradientSky } from './sky.js'
import { createSunLight } from './sun.js'
import { createGround } from './ground/index.js'

export const clock = new THREE.Clock()
export const scene = new THREE.Scene()

// CAMERA

export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000)
camera.position.z = 250
camera.lookAt(scene.position)

// RENDERER

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

export function createWorldScene(groundParam, skyParam, lightParam, fogParam = {}) {
  scene.add(createGround(groundParam))
  scene.add(createGradientSky(skyParam))
  const light = createSunLight(lightParam)
  // const helper = new THREE.CameraHelper(light.shadow.camera)
  // scene.add(helper)
  scene.add(light)
  const { color = 0xffffff, near = 1, far = 5000 } = fogParam
  scene.fog = new THREE.Fog(color, near, far)
  hemLight({ scene })
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

export function addControls(controls) {
  const style = {
    position: 'absolute',
    top: 0,
    left: 0,
    color: '#fff',
  }
  const margins = `
    margin-top:4px;
    margin-bottom:4px
  `
  const div = document.createElement('div')
  Object.assign(div.style, style)
  div.innerHTML = Object.keys(controls).reduce(
    (acc, key) => acc + `<p style="${margins}">${key}: ${controls[key]}</p>`,
    `<h3 style="${margins}">KONTROLE</h2>`
  )
  document.body.appendChild(div)
}

/* LIGHT */

export function initLights(theScene = scene, position = new THREE.Vector3(-10, 30, 40)) {
  const spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.copy(position)
  spotLight.shadow.mapSize.width = 2048
  spotLight.shadow.mapSize.height = 2048
  spotLight.shadow.camera.fov = 15
  spotLight.castShadow = true
  spotLight.decay = 2
  spotLight.penumbra = 0.05
  spotLight.name = 'spotLight'
  theScene.add(spotLight)

  const ambientLight = new THREE.AmbientLight(0x343434)
  ambientLight.name = 'ambientLight'
  theScene.add(ambientLight)
}

export function hemLight({ theScene = scene, intensity = 1 } = {}) {
  const hemisphereLight = new THREE.HemisphereLight(0xfffff0, 0x101020, intensity)
  hemisphereLight.name = 'hemisphereLight'
  theScene.add(hemisphereLight)
}

export { createGradientSky, createGround, createSunLight }