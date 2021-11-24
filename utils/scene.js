import * as THREE from '/node_modules/three108/build/three.module.js'
import { OrbitControls } from '/node_modules/three108/examples/jsm/controls/OrbitControls.js'

export const scene = new THREE.Scene()
scene.background = new THREE.Color().setHSL(0.6, 0, 1)

const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6)
hemiLight.color.setHSL(0.6, 1, 0.6)
hemiLight.groundColor.setHSL(0.095, 1, 0.75)
hemiLight.position.set(0, 50, 0)
scene.add(hemiLight)

const dirLight = new THREE.DirectionalLight(0xffffff, 1)
dirLight.color.setHSL(0.1, 1, 0.95)
dirLight.position.set(- 1, 1.75, 1)
dirLight.position.multiplyScalar(30)
dirLight.castShadow = true
dirLight.shadow.mapSize.width = 2048
dirLight.shadow.mapSize.height = 2048
const d = 50
dirLight.shadow.camera.left = - d
dirLight.shadow.camera.right = d
dirLight.shadow.camera.top = d
dirLight.shadow.camera.bottom = - d
dirLight.shadow.camera.far = 3500
dirLight.shadow.bias = - 0.0001
scene.add(dirLight)

// SKYDOME

const vertexShader = `
varying vec3 vWorldPosition;

void main() {
  vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
  vWorldPosition = worldPosition.xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`

const fragmentShader = `
uniform vec3 topColor;
uniform vec3 bottomColor;
uniform float offset;
uniform float exponent;

varying vec3 vWorldPosition;

void main() {
  float h = normalize( vWorldPosition + offset ).y;
  gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );
}`

const uniforms = {
  'topColor': { value: new THREE.Color(0x0077ff) },
  'bottomColor': { value: new THREE.Color(0xffffff) },
  'offset': { value: 33 },
  'exponent': { value: 0.6 }
}
uniforms.topColor.value.copy(hemiLight.color)

scene.fog = new THREE.Fog(scene.background, 1, 5000)
scene.fog.color.copy(uniforms.bottomColor.value)

const skyGeo = new THREE.SphereGeometry(4000, 32, 15)
const skyMat = new THREE.ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader,
  side: THREE.BackSide
})

const sky = new THREE.Mesh(skyGeo, skyMat)
scene.add(sky)

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

export const clock = new THREE.Clock()

/* FUNCTIONS */

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
