import * as THREE from 'three'
import { createSphere } from '/core/geometry/index.js'
import { material as fractalMaterial } from '/core/shaders/fractal-planet.js'
import { material as fireMaterial } from '/core/shaders/fireball.js'
import { material as lavaMaterial } from '/core/shaders/lava.js'
import { addRings } from '/core/geometry/planets.js'

const { randFloat } = THREE.MathUtils

const textures = ['jupiter.jpg', 'saturn.jpg', 'venus.jpg', 'mars.jpg']
const materials = [fractalMaterial, fireMaterial, lavaMaterial]

function addMoon(planet, r) {
  const moon = createSphere({ r: r * .33, file: 'planets/moon.jpg' })
  moon.translateX(r * 2.5)
  planet.userData.moon = moon
  planet.add(moon)
}

/**
 * i = 0: fractal shader
 * i = 1: fire shader
 * i = 2: lava shader
 * i > 2: random texture
 */
function createPlanet({ r = randFloat(2, 5), pos, i = 0 } = {}) {
  const file = `planets/${textures[i % textures.length]}`
  const planet = createSphere({ file, r })
  if (pos) planet.position.copy(pos)
  planet.userData.angleSpeed = randFloat(-1, 1)

  if (i < materials.length)
    planet.material = materials[i]
  else if (r > 3 && Math.abs(planet.userData.angleSpeed) > .5)
    addMoon(planet, r)
  else if (Math.random() > .75)
    addRings(planet)

  return planet
}

export default class Planet {
  constructor(params) {
    this.mesh = createPlanet(params)
    this.time = 0
  }

  update(delta) {
    const { mesh } = this
    const { angleSpeed, moon } = mesh.userData

    mesh.rotateY(angleSpeed * delta)
    if (moon)
      moon.rotateY(angleSpeed * delta)

    if (mesh.material.uniforms)
      mesh.material.uniforms.time.value = this.time

    this.time += delta
  }
}
