import * as THREE from '../node_modules/three/src/Three.js'
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js'

export const scene = new THREE.Scene()
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 5
camera.position.y = 1

export const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

export const controls = new OrbitControls(camera, renderer.domElement)
controls.maxPolarAngle = Math.PI / 2 - 0.1 // prevent bellow ground

export const loader = new THREE.TextureLoader()
