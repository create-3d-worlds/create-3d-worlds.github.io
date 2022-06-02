import * as THREE from '/node_modules/three127/build/three.module.js'
import { scene, camera, renderer, clock, createOrbitControls } from '/utils/scene.js'
import { randomInRange } from '/utils/helpers.js'

const totalParticles = 200
const radiusRange = 50

const controls = createOrbitControls()
camera.position.set(0, 50, 150)

const texture = new THREE.TextureLoader().load('images/spark.png')

const particles = createParticles()
scene.add(particles)

/* FUNCTIONS */

function createParticles() {
  const particles = new THREE.Object3D()
  for (let i = 0; i < totalParticles; i++) {
    const material = new THREE.SpriteMaterial({ map: texture, color: 0xffffff })
    const sprite = new THREE.Sprite(material)
    sprite.scale.set(32, 32, 1.0)
    sprite.position.set(randomInRange(-.5, .5), randomInRange(-.5, .5), randomInRange(-.5, .5))
    sprite.position.setLength(radiusRange * randomInRange(.9, 1))
    sprite.material.color.setHSL(Math.random(), 0.9, 0.7)
    sprite.material.blending = THREE.AdditiveBlending // glowing

    // assign custom properties
    sprite.startPosition = sprite.position.clone()
    sprite.randomness = Math.random() + 1

    particles.add(sprite)
  }
  return particles
}

function updateParticles() {
  const time = 4 * clock.getElapsedTime()
  for (let i = 0; i < particles.children.length; i++) {
    const sprite = particles.children[i]
    // pulse away/towards center at individual rates
    const pulseFactor = Math.sin(sprite.randomness * time) * 0.1 + 0.9
    sprite.position.x = sprite.startPosition.x * pulseFactor
    sprite.position.y = sprite.startPosition.y * pulseFactor
    sprite.position.z = sprite.startPosition.z * pulseFactor
  }
  particles.rotation.y = time * 0.75
}

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  updateParticles()
  renderer.render(scene, camera)
}()
