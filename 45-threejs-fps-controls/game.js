import { PointerLockControls } from '../node_modules/three/examples/jsm/controls/PointerLockControls.js'
import { askPointerLock } from './askPointerLock.js';

let camera, scene, renderer
let geometry, material, mesh
let controls
const objects = []
let raycaster

let moveForward = false
let moveBackward = false
let moveLeft = false
let moveRight = false
let canJump = false
let prevTime = performance.now()
const velocity = new THREE.Vector3()

camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)
scene = new THREE.Scene()
scene.fog = new THREE.Fog(0xffffff, 0, 750)
const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75)
light.position.set(0.5, 1, 0.75)
scene.add(light)
controls = new PointerLockControls(camera)
askPointerLock(controls)

scene.add(controls.getObject())
const onKeyDown = function (event) {
  switch (event.keyCode) {
    case 38: // up
    case 87: // w
      moveForward = true
      break
    case 37: // left
    case 65: // a
      moveLeft = true; break
    case 40: // down
    case 83: // s
      moveBackward = true
      break
    case 39: // right
    case 68: // d
      moveRight = true
      break
    case 32: // space
      if (canJump === true) velocity.y += 350
      canJump = false
      break
  }
}
const onKeyUp = function (event) {
  switch (event.keyCode) {
    case 38: // up
    case 87: // w
      moveForward = false
      break
    case 37: // left
    case 65: // a
      moveLeft = false
      break
    case 40: // down
    case 83: // s
      moveBackward = false
      break
    case 39: // right
    case 68: // d
      moveRight = false
      break
  }
}
document.addEventListener('keydown', onKeyDown, false)
document.addEventListener('keyup', onKeyUp, false)
raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, - 1, 0), 0, 10)
// floor
geometry = new THREE.PlaneGeometry(2000, 2000, 100, 100)
geometry.rotateX(- Math.PI / 2)
for (var i = 0, l = geometry.vertices.length; i < l; i++) {
  const vertex = geometry.vertices[i]
  vertex.x += Math.random() * 20 - 10
  vertex.y += Math.random() * 2
  vertex.z += Math.random() * 20 - 10
}
for (var i = 0, l = geometry.faces.length; i < l; i++) {
  var face = geometry.faces[i]
  face.vertexColors[0] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75)
  face.vertexColors[1] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75)
  face.vertexColors[2] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75)
}
material = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors })
mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)
// objects
geometry = new THREE.BoxGeometry(20, 20, 20)
for (var i = 0, l = geometry.faces.length; i < l; i++) {
  var face = geometry.faces[i]
  face.vertexColors[0] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75)
  face.vertexColors[1] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75)
  face.vertexColors[2] = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75)
}
for (var i = 0; i < 500; i++) {
  material = new THREE.MeshPhongMaterial({ specular: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors })
  mesh = new THREE.Mesh(geometry, material)
  mesh.position.x = Math.floor(Math.random() * 20 - 10) * 20
  mesh.position.y = Math.floor(Math.random() * 20) * 20 + 10
  mesh.position.z = Math.floor(Math.random() * 20 - 10) * 20
  scene.add(mesh)
  material.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75)
  objects.push(mesh)
}
//
renderer = new THREE.WebGLRenderer()
renderer.setClearColor(0xffffff)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
//
window.addEventListener('resize', onWindowResize, false)

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}
function animate() {
  requestAnimationFrame(animate)
  if (controls.enabled) {
    raycaster.ray.origin.copy(controls.getObject().position)
    raycaster.ray.origin.y -= 10
    const intersections = raycaster.intersectObjects(objects)
    const isOnObject = intersections.length > 0
    const time = performance.now()
    const delta = (time - prevTime) / 1000
    velocity.x -= velocity.x * 10.0 * delta
    velocity.z -= velocity.z * 10.0 * delta
    velocity.y -= 9.8 * 100.0 * delta // 100.0 = mass
    if (moveForward) velocity.z -= 400.0 * delta
    if (moveBackward) velocity.z += 400.0 * delta
    if (moveLeft) velocity.x -= 400.0 * delta
    if (moveRight) velocity.x += 400.0 * delta
    if (isOnObject === true) {
      velocity.y = Math.max(0, velocity.y)
      canJump = true
    }
    controls.getObject().translateX(velocity.x * delta)
    controls.getObject().translateY(velocity.y * delta)
    controls.getObject().translateZ(velocity.z * delta)
    if (controls.getObject().position.y < 10) {
      velocity.y = 0
      controls.getObject().position.y = 10
      canJump = true
    }
    prevTime = time
  }
  renderer.render(scene, camera)
}

animate()
