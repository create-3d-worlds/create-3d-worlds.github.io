import * as THREE from '/node_modules/three127/build/three.module.js'
import { OrbitControls } from '/node_modules/three127/examples/jsm/controls/OrbitControls.js'
import { createSkySphere } from './geometry.js'
import { createGround } from './ground.js'
import { initLights, hemLight, createSunLight } from './light.js'

export const clock = new THREE.Clock()
export const scene = new THREE.Scene()

export function createWorldScene(groundParam, skyParam, lightParam, fogParam = {}) {
  scene.add(createGround(groundParam))
  scene.add(createSkySphere(skyParam))
  const light = createSunLight(lightParam)
  // const helper = new THREE.CameraHelper(light.shadow.camera)
  // scene.add(helper)
  scene.add(light)
  const { color = 0xffffff, near = 1, far = 5000 } = fogParam
  scene.fog = new THREE.Fog(color, near, far)
  hemLight({ scene, intensity: 0.5 })
  return scene
}

// CAMERA

export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000)
camera.position.z = 4
camera.position.y = 2

// RENDERER

export const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true
})
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
renderer.outputEncoding = THREE.GammaEncoding

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
})

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

/* UI */

export function addUIControls({ commands, title = 'CONTROLS' }) {
  const style = {
    position: 'absolute',
    top: 0,
    left: 0,
    color: '#fff',
    paddingTop: '4px',
    paddingBottom: '4px',
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

export function addScoreUI({ score = 0, title = 'Score' } = {}) {
  const div = document.createElement('div')
  const style = `
    position: absolute;
    color: yellow;
    top: 20px;
    right: 20px;
  `
  div.style.cssText = style
  document.body.appendChild(div)

  const updateScore = (point = 1) => {
    score += point // eslint-disable-line no-param-reassign
    div.innerHTML = `${title}: ${score}`
  }
  updateScore(0)
  return updateScore
}

/* SHORTCUTS */

export { createGround, initLights, hemLight }