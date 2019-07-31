import * as THREE from '../node_modules/three/src/Three.js'
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js'
// import model from '../maps/small-map.js'

// console.table(model)
// console.log(OrbitControls)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 5

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

const floorMaterial = new THREE.MeshBasicMaterial({
  side: THREE.DoubleSide
})
const floorGeometry = new THREE.PlaneGeometry(100, 100)
const floor = new THREE.Mesh(floorGeometry, floorMaterial)
floor.rotation.x = Math.PI / 2
floor.position.y = -5
scene.add(floor)

const controls = new OrbitControls(camera, renderer.domElement)

void function gameLoop() {
  requestAnimationFrame(gameLoop)
  controls.update()
  renderer.render(scene, camera)
}()
