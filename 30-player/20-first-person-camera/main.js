import * as THREE from '/node_modules/three108/build/three.module.js'
import {scene, camera, renderer, clock} from '/utils/scene.js'
import keyboard from '/classes/Keyboard.js'

camera.position.set(0, 150, 400)
camera.lookAt(scene.position)

const floorTexture = new THREE.TextureLoader().load('/assets/textures/sand-512.jpg')
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping
floorTexture.repeat.set(10, 10)
const floorMaterial = new THREE.MeshBasicMaterial({map: floorTexture, side: THREE.DoubleSide})
const floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10)
const floor = new THREE.Mesh(floorGeometry, floorMaterial)
floor.position.y = -0.5
floor.rotation.x = Math.PI / 2
scene.add(floor)

const player = new THREE.Mesh()
player.position.set(0, 25.1, 0)
scene.add(player)

function update() {
  const delta = clock.getDelta() // seconds
  const moveDistance = 200 * delta // 200 pixels per second
  const rotateAngle = Math.PI / 2 * delta // pi/2 radians (90 degrees) per second

  if (keyboard.pressed.KeyW)
    player.translateZ(-moveDistance)
  if (keyboard.pressed.KeyS)
    player.translateZ(moveDistance)
  if (keyboard.pressed.KeyQ)
    player.translateX(-moveDistance)
  if (keyboard.pressed.KeyE)
    player.translateX(moveDistance)

  if (keyboard.pressed.KeyA)
    player.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateAngle)
  if (keyboard.pressed.KeyD)
    player.rotateOnAxis(new THREE.Vector3(0, 1, 0), -rotateAngle)
  if (keyboard.pressed.KeyR)
    player.rotateOnAxis(new THREE.Vector3(1, 0, 0), rotateAngle)
  if (keyboard.pressed.KeyF)
    player.rotateOnAxis(new THREE.Vector3(1, 0, 0), -rotateAngle)

  if (keyboard.pressed.ArrowLeft)
    player.position.x -= moveDistance
  if (keyboard.pressed.ArrowRight)
    player.position.x += moveDistance
  if (keyboard.pressed.ArrowUp)
    player.position.z -= moveDistance
  if (keyboard.pressed.ArrowDown)
    player.position.z += moveDistance

  const relativeCameraOffset = new THREE.Vector3(0, 50, 200)
  const cameraOffset = relativeCameraOffset.applyMatrix4(player.matrixWorld)

  camera.position.x = cameraOffset.x
  camera.position.y = cameraOffset.y
  camera.position.z = cameraOffset.z
  camera.lookAt(player.position)
}

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  update()
}()
