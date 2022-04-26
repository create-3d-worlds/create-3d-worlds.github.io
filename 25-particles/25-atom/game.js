import * as THREE from '/node_modules/three108/build/three.module.js'
import {scene, camera, renderer, clock, createOrbitControls} from '/utils/scene.js'

const totalParticles = 200
const radiusRange = 50

createOrbitControls()
camera.position.set(0, 150, 400)
scene.background = new THREE.Color(0x9999ff)

const texture = new THREE.TextureLoader().load('images/spark.png')

const particleGroup = new THREE.Object3D()
const particleAttributes = {
  startSize: [],
  startPosition: [],
  randomness: []
}

for (let i = 0; i < totalParticles; i++) {
  const material = new THREE.SpriteMaterial({map: texture, color: 0xffffff})
  const sprite = new THREE.Sprite(material)
  sprite.scale.set(32, 32, 1.0)
  sprite.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
  sprite.position.setLength(radiusRange * (Math.random() * 0.1 + 0.9))
  sprite.material.color.setHSL(Math.random(), 0.9, 0.7)
  sprite.material.blending = THREE.AdditiveBlending // "glowing" particles

  particleGroup.add(sprite)
  // add variable qualities to arrays, if they need to be accessed later
  particleAttributes.startPosition.push(sprite.position.clone())
  particleAttributes.randomness.push(Math.random())
}
particleGroup.position.y = 50
scene.add(particleGroup)

function update() {
  const time = 4 * clock.getElapsedTime()
  for (let c = 0; c < particleGroup.children.length; c++) {
    const sprite = particleGroup.children[c]
    // pulse away/towards center (individual rates of movement)
    const a = particleAttributes.randomness[c] + 1
    const pulseFactor = Math.sin(a * time) * 0.1 + 0.9
    sprite.position.x = particleAttributes.startPosition[c].x * pulseFactor
    sprite.position.y = particleAttributes.startPosition[c].y * pulseFactor
    sprite.position.z = particleAttributes.startPosition[c].z * pulseFactor
  }
  // rotate the entire group
  particleGroup.rotation.y = time * 0.75
}

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  update()
}()
