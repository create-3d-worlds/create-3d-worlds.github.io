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

// https://gist.github.com/mikedugan/7355415
document.body.style = `
  // background: linear-gradient(to bottom, #b7eaff 0%,#94dfff 100%);
  // background: linear-gradient(to bottom, #94c5f8 1%,#a6e6ff 70%,#b1b5ea 100%);
  background: linear-gradient(to bottom, #40405c 0%,#6f71aa 80%,#8a76ab 100%);
  color: yellow;
  font-family: Verdana;
  margin: 0;
  overflow: hidden;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px  1px 0 #000, 1px  1px 0 #000;
  user-select: none;
`

export const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio)) // save battery by limit pixel ratio to 2
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
// renderer.setClearColor(0x87CEEB) // 0x7ec0ee

const canvas = renderer.domElement
canvas.addEventListener('contextmenu', e => e.preventDefault())
document.body.appendChild(canvas)
canvas.focus()

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
})

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
