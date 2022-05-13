import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer, clock } from '/utils/scene.js'
import keyboard from '/classes/Keyboard.js'

camera.position.set(0, 15, 40)
camera.lookAt(scene.position)

const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 })
const floorGeometry = new THREE.PlaneGeometry(100, 100, 10, 10)
const floor = new THREE.Mesh(floorGeometry, floorMaterial)
floor.rotation.x = -Math.PI / 2
scene.add(floor)

const cubeMat = new THREE.MeshNormalMaterial()
const cubeGeom = new THREE.CubeGeometry(5, 5, 5, 1, 1, 1)
const player = new THREE.Mesh(cubeGeom, cubeMat)
player.position.set(0, 2.5, 0)
scene.add(player)

function update() {
  const delta = clock.getDelta() // seconds.
  const moveDistance = 20 * delta // pixels per second
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
}

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  update()
}()