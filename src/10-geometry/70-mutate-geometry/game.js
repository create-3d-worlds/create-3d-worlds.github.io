import * as THREE from '/node_modules/three127/build/three.module.js'
import { scene, camera, renderer } from '/utils/scene.js'
import { createSphere } from '/utils/balls.js'

scene.add(new THREE.AmbientLight(0xffffff, 0.25))

const setVert = function(geometry, vertIndex, pos) {
  const i = geometry.index.array[vertIndex] * 3
  const positions = geometry.attributes.position.array
  positions[i] = pos.x
  positions[i + 1] = pos.y
  positions[i + 2] = pos.z
  geometry.attributes.position.needsUpdate = true
}

const updateSphereTop = function(geometry, y) {
  const positions = geometry.attributes.position.array
  const pos = {
    x: positions[0],
    y,
    z: positions[2]
  }
  const { widthSegments } = geometry.parameters
  let i = 0
  while (i < widthSegments * 3) {
    setVert(geometry, i, pos)
    i += 1
  }
}

const ball = createSphere({ r: 0.5 })
scene.add(ball)

camera.position.set(1, 1, 1)
camera.lookAt(ball.position)

let per = 0
let bias
let lastTime = new Date()
const maxFrames = 300
const FPS = 30

void function loop() {
  const now = new Date()
  const secs = (now - lastTime) / 1000
  requestAnimationFrame(loop)
  if (secs <= 1 / FPS) return

  per += 1 / (maxFrames / FPS) * secs
  per %= 1
  bias = 1 - Math.abs(per - 0.5) / 0.5

  updateSphereTop(ball.geometry, 0.75 - 0.75 * bias)
  renderer.render(scene, camera)
  lastTime = now
}()

