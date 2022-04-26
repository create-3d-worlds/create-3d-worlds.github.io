import * as THREE from '/node_modules/three108/build/three.module.js'
import { TWEEN } from '/node_modules/three108/examples/jsm/libs/tween.module.min.js'
import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'

createOrbitControls()

camera.position.z = 1000
scene.background = new THREE.Color(0x000040)

const material = new THREE.SpriteMaterial({
  map: new THREE.CanvasTexture(generateSprite()),
  blending: THREE.AdditiveBlending
})

for (let i = 0; i < 1000; i++) {
  const particle = new THREE.Sprite(material)
  tweenParticle(particle, i * 10)
  scene.add(particle)
}

/* FUNCTIONS */

function generateSprite() {
  const canvas = document.createElement('canvas')
  canvas.width = 16
  canvas.height = 16

  const context = canvas.getContext('2d')
  const gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.2, 'rgba(0,255,255,1)')
  gradient.addColorStop(0.4, 'rgba(0,0,64,1)')
  gradient.addColorStop(1, 'rgba(0,0,0,1)')

  context.fillStyle = gradient
  context.fillRect(0, 0, canvas.width, canvas.height)

  return canvas
}

function tweenParticle(particle, delay = 0) {
  particle.position.set(0, 0, 0)
  particle.scale.x = particle.scale.y = Math.random() * 32 + 16

  new TWEEN.Tween(particle)
    .delay(delay)
    .to({}, 10000)
    .onComplete(() => tweenParticle(particle))
    .start()

  new TWEEN.Tween(particle.position)
    .delay(delay)
    .to({
      x: Math.random() * 4000 - 2000,
      y: Math.random() * 1000 - 500,
      z: Math.random() * 4000 - 2000
    }, 10000)
    .start()

  new TWEEN.Tween(particle.scale)
    .delay(delay)
    .to({
      x: 0.01,
      y: 0.01
    }, 10000)
    .start()
}

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  TWEEN.update()
  renderer.render(scene, camera)
}()
