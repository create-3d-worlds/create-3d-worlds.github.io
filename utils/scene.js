import * as THREE from 'three'
import { OrbitControls } from '/node_modules/three/examples/jsm/controls/OrbitControls.js'

export const clock = new THREE.Clock()

// SCENE

export const scene = new THREE.Scene()

export const setBackground = color => {
  scene.background = new THREE.Color(color)
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setClearColor(0x87CEEB) // 0x7ec0ee

renderer.domElement.focus()

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
})

renderer.domElement.addEventListener('contextmenu', e => e.preventDefault())

export async function createToonRenderer({ defaultThickness = 0.003 } = {}) {
  const { OutlineEffect } = await import('/node_modules/three/examples/jsm/effects/OutlineEffect.js')
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
