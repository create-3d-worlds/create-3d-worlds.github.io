import * as THREE from 'three'

import { camera, scene, renderer, clock, setBackground } from '/utils/scene.js'
import { createSphere } from '/utils/geometry.js'
import { createMoon, addRings } from '/utils/geometry/planets.js'
import { createTerrain, shake } from '/utils/ground.js'
import { Stars } from '/utils/classes/Particles.js'
import { createMoon as createMoonLight } from '/utils/light.js'
import Avatar from '/utils/actor/Avatar.js'
import { getShuffledCoords } from '/utils/helpers.js'

import { material as fireMaterial, uniforms as fireUniforms } from '/utils/shaders/fireball.js'
import { material as fractalMaterial, uniforms as fractalUniforms } from '/utils/shaders/fractal-planet.js'
import { material as lavaMaterial, uniforms as lavaUniforms } from '/utils/shaders/lava.js'

const { randFloat } = THREE.MathUtils

setBackground(0x000000)
scene.add(createMoonLight())

const textures = ['jupiter.jpg', 'saturn.jpg', 'venus.jpg', 'mars.jpg']
const materials = [fractalMaterial, fireMaterial, lavaMaterial]
const uniforms = [fractalUniforms, fireUniforms, lavaUniforms]

const mapSize = 400
const numPlanets = 20

const planets = []
const moons = []

const coords = getShuffledCoords({ mapSize: mapSize / 2, fieldSize: 30 })

for (let i = 0; i < numPlanets; i++) {
  const r = randFloat(2, 5)
  const file = `planets/${textures[i % textures.length]}`
  const planet = createSphere({ file, r })
  const pos = coords.pop()
  planet.position.set(pos.x, r * randFloat(1.5, 5), pos.z)
  planet.userData.angleSpeed = randFloat(-1, 1)
  planets.push(planet)

  if (i < materials.length)
    planet.material = materials[i]
  else if (r > 3 && Math.abs(planet.userData.angleSpeed) > .5)
    addMoon(planet, r)
  else if (Math.random() > .75)
    addRings(planet)
}

const terrain = createTerrain({ size: mapSize, wireframe: true })
scene.add(terrain)

const stars = new Stars({ num: 10000 })
scene.add(stars.mesh)

scene.add(...planets)

const player = new Avatar({ solids: [...planets, terrain], camera, skin: 'DISCO' })
scene.add(player.mesh)

/* FUNCTIONS */

function addMoon(planet, r) {
  const moon = createMoon({ r: r * .33 })
  moon.userData.angleSpeed = randFloat(-1, 1)
  moon.translateX(r * 2.5)
  planet.add(moon)
  moons.push(moon)
}

/* LOOP */

const bodies = [...planets, ...moons]

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()
  const time = clock.getElapsedTime()

  uniforms.forEach(uniform => {
    uniform.time.value = time
  })
  bodies.forEach(body => body.rotateY(body.userData.angleSpeed * delta))

  shake({ geometry: terrain.geometry, time })
  stars.update({ delta: delta * .1 })
  player.update(delta)

  renderer.render(scene, camera)
}()
