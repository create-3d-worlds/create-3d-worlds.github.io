import * as THREE from 'three'
import { OutlineEffect } from '/node_modules/three/examples/jsm/effects/OutlineEffect.js'
import { OrbitControls } from '/node_modules/three/examples/jsm/controls/OrbitControls.js'

import { createSkySphere } from './geometry.js'
import { createGround } from './ground.js'
import { hemLight, createSun } from './light.js'

export const clock = new THREE.Clock()

// SCENE

export const scene = new THREE.Scene()

export function createWorldScene(groundParam, skyParam, lightParam, fogParam = {}) {
  scene.add(createGround(groundParam))
  scene.add(createSkySphere(skyParam))
  const light = createSun(lightParam)
  scene.add(light)
  const { color = 0xffffff, near = 1, far = 5000 } = fogParam
  scene.fog = new THREE.Fog(color, near, far)
  hemLight({ scene, intensity: 0.5 })
  return scene
}

export const setBackground = color => {
  scene.background = new THREE.Color(color)
  // renderer.setClearColor(color)
}

// CAMERA

export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10000)
camera.position.set(0, 2, 4)

// RENDERER

export const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true
})
document.body.style.margin = 0
const container = document.getElementById('container') || document.body
container.appendChild(renderer.domElement)
renderer.setSize(window.innerWidth, window.innerHeight)
// Some mobiles have a pixel ratio 5. Improve battery life by limiting this to 2.
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
renderer.domElement.focus()
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

renderer.setClearColor(0x87CEEB) // 0x7ec0ee

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
})

renderer.domElement.addEventListener('contextmenu', e => e.preventDefault())

export function createToonRenderer({ defaultThickness = 0.003 } = {}) {
  return new OutlineEffect(renderer, { defaultThickness })
}

export const fixColors = () => {
  renderer.outputEncoding = THREE.sRGBEncoding
}

/* CONTROLS */

export function createOrbitControls(cam = camera, el = renderer.domElement) {
  const controls = new OrbitControls(cam, el)
  controls.maxPolarAngle = Math.PI / 2 - 0.1 // prevent bellow ground, negde ne radi
  // controls.maxDistance = 20
  controls.enableKeys = false
  controls.minDistance = 2
  controls.zoomSpeed = .3
  controls.enableDamping = true
  controls.dampingFactor = 0.1
  // controls.enableZoom = false
  return controls
}

/* UI */

const baseCommands = {
  '←': 'left',
  '→': 'right',
  '↑': 'forward',
  '↓': 'backward',
  CapsLock: 'run',
  Space: 'jump',
}

export function addUIControls({ commands = baseCommands, title = 'COMMANDS' } = {}) {
  const translateKey = key => {
    key = key.replace(/Key/, '') // eslint-disable-line no-param-reassign
    switch (key) {
      case 'ArrowLeft':
        return '←'
      case 'ArrowRight':
        return '→'
      case 'ArrowUp':
        return '↑'
      case 'ArrowDown':
        return '↓'
      default:
        return key
    }
  }

  const divStyle = `
    color: #fff;
    left: 8px;
    position: absolute;
    top: 4px;
  `
  const rowStyle = `
    margin-top: 2px;
    margin-bottom: 2px;
  `
  const btnStyle = `
    border:1px solid #fff;
    padding: 1px 2px;
    min-width: 12px;
    display: inline-block;
    text-align: center;
  `
  const div = document.createElement('div')
  div.style = divStyle
  div.innerHTML = Object.keys(commands).reduce(
    (acc, key) => acc + `<p style="${rowStyle}"><b style="${btnStyle}">${translateKey(key)}</b> ${commands[key]}</p>`,
    `<h3 style="${rowStyle}">${title}</h2>`
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
