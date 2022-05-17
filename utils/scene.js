import * as THREE from '/node_modules/three108/build/three.module.js'
import { OrbitControls } from '/node_modules/three108/examples/jsm/controls/OrbitControls.js'
import { createGradientSky } from './sky.js'
import { createSunLight } from './sun.js'
import { createGround } from './ground.js'
import { initLights, hemLight } from './light.js'

export const clock = new THREE.Clock()
export const scene = new THREE.Scene()

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

// CAMERA

export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000)
camera.position.z = 20
camera.position.y = 10
// camera.lookAt(scene.position)

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
// glb models light
renderer.gammaFactor = 2.2
renderer.gammaOutput = true
// from version 112 replace with:
// renderer.outputEncoding = THREE.sRGBEncoding

/* CONTROLS */

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

export function addUIControls({ commands, title = 'CONTROLS' }) {
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
  div.innerHTML = Object.keys(commands).reduce(
    (acc, key) => acc + `<p style="${margins}">${key}: ${commands[key]}</p>`,
    `<h3 style="${margins}">${title}</h2>`
  )
  document.body.appendChild(div)
}

/* SHORTCUTS */

export { createGradientSky, createGround, createSunLight, initLights, hemLight }