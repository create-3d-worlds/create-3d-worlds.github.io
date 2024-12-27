import * as THREE from 'three'
import { similarColor } from '/core/helpers.js'
import config from '/config.js'

const { randFloat } = THREE.MathUtils
const textureLoader = new THREE.TextureLoader()

function addVelocity({ geometry, minVelocity = .5, maxVelocity = 3 } = {}) {
  const velocities = []
  for (let i = 0; i < geometry.attributes.position.count; i++)
    velocities[i] = randFloat(minVelocity, maxVelocity)
  geometry.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 1))
}

/**
 * Particles base class, creates particles in sphere space
 */
export default class Particles {
  constructor({ num = 10000, file = 'ball.png', color, size = .5, opacity = 1, unitAngle = 1, minRadius = 100, maxRadius = 1000, blending = THREE.AdditiveBlending } = {}) {
    this.t = 0
    this.unitAngle = unitAngle
    this.mesh = this.createParticles({ num, file, color, size, opacity, minRadius, maxRadius, blending })
  }

  get particles() {
    return this.mesh
  }

  createParticles({ num = 10000, file = 'ball.png', color, size = .5, opacity = 1, minRadius = 100, maxRadius = 1000, blending = THREE.AdditiveBlending } = {}) {
    const { unitAngle } = this
    const geometry = new THREE.BufferGeometry()
    const positions = []
    const colors = []

    for (let i = 0; i < num; i++) {
      const vertex = new THREE.Vector3(
        randFloat(-unitAngle, unitAngle), randFloat(-unitAngle, unitAngle), randFloat(-unitAngle, unitAngle)
      )
      const radius = randFloat(minRadius, maxRadius)
      vertex.multiplyScalar(radius)
      const { x, y, z } = vertex
      positions.push(x, y, z)

      if (!color) {
        const color = similarColor(0xf2c5f3)
        colors.push(color.r, color.g, color.b)
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    if (!color) geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size,
      transparent: true,
      opacity,
    })
    if (file) {
      material.map = textureLoader.load(`/assets/textures/particles/${file}`)
      material.blending = blending
      material.depthWrite = false // for explosion
    }

    if (color)
      material.color = new THREE.Color(color)
    else
      material.vertexColors = true

    return new THREE.Points(geometry, material)
  }

  reset({ pos, unitAngle = this.unitAngle, color, randomize = true, opacity = 1 } = {}) {
    const { mesh } = this
    this.t = 0
    mesh.visible = true
    mesh.material.opacity = opacity
    if (pos)
      if (Array.isArray(pos)) mesh.position.set(...pos)
      else mesh.position.copy(pos)

    if (randomize) {
      const { position } = mesh.geometry.attributes
      for (let i = 0, l = position.array.length; i < l; i++)
        position.array[i] = randFloat(-unitAngle, unitAngle)
    }

    if (color)
      mesh.material.color = new THREE.Color(color)
  }

  fadeOut(maxRounds) {
    this.t++
    if (this.t > maxRounds) {
      this.mesh.visible = false
      return
    }
    this.mesh.material.opacity = 1 - this.t / maxRounds
  }

  /**
   * expands particles from center according to unitAngle and velocity
   */
  expand({ velocity = 1.1, maxRounds = 50, gravity = 0 } = {}) { // velocity < 1 reverses direction
    if (!this.mesh.visible) return
    this.fadeOut(maxRounds)

    const { position } = this.mesh.geometry.attributes
    const vertex = new THREE.Vector3()
    for (let i = 0, l = position.count; i < l; i++) {
      vertex.fromBufferAttribute(position, i)
      vertex.multiplyScalar(velocity)
      vertex.y -= gravity
      position.setXYZ(i, vertex.x, vertex.y, vertex.z)
    }

    position.needsUpdate = true
  }

  /**
   * moves particles vertically or horizontally according to axis
   */
  update({ delta = 1 / 60, min = -500, max = 500, axis = 2, minVelocity = 50, maxVelocity = 300, loop = true, maxRounds = 250, pos, rotateY } = {}) {
    if (!this.mesh.visible) return
    if (!loop) this.fadeOut(maxRounds)

    const { geometry } = this.mesh
    if (!geometry.attributes.velocity) addVelocity({ geometry, minVelocity, maxVelocity })

    const { position, velocity } = geometry.attributes
    velocity.array.forEach((vel, i) => {
      const index = 3 * i + axis
      const currentPos = position.array[index]

      if (axis === 1) // y: vertical axis
        position.array[index] = (loop && currentPos < min) ? max : (currentPos - vel * delta)

      if (axis === 2) // z: horizontal axis
        position.array[index] = (loop && currentPos > max) ? min : (currentPos + vel * delta)
    })

    position.needsUpdate = true
    if (pos) this.mesh.position.set(pos.x, pos.y, pos.z) // follow player
    if (rotateY) this.mesh.rotateY(rotateY)
  }
}

/* CHILD CLASSES */

export class Stars extends Particles {
  update({ min = -500, max = 500, ...rest } = {}) {
    super.update({ min, max, axis: 2, ...rest })
  }
}

export class Rain extends Particles {
  // rain-drop.png je ukrivo
  constructor({ file = 'rain-drop.png', num = 1000, size = .1, opacity = .75, minRadius = 2, maxRadius = 5, color = 0xDEF4FC } = {}) {
    super({ file, num, size, opacity, minRadius, maxRadius, color, blending: THREE.NormalBlending })

    this.audio = new Audio('/assets/sounds/rain.mp3')
    this.audio.volume = config.volume * .5
    this.audio.loop = true
    this.playing = false
  }

  update({ min = 0, max = 50, minVelocity = 30, maxVelocity = 90, ...rest } = {}) {
    super.update({ min, max, axis: 1, minVelocity, maxVelocity, ...rest })
    if (!this.playing) {
      this.audio.play()
      this.playing = true
    }
  }
}

export class Snow extends Particles {
  constructor(params = {}) {
    super({ file: 'snowflake.png', num: 1000, color: 0xffffff, size: .3, opacity: .6, minRadius: 2, maxRadius: 50, ...params })
  }

  update(params = {}) {
    super.update({ axis: 1, rotateY: .009, min: -5, max: 15, minVelocity: 3, maxVelocity: 9, ...params })
  }
}

export class Explosion extends Particles {
  constructor({ num = 30, file = 'fireball.png', size = .4, unitAngle = 0.1, ...rest } = {}) {
    super({ num, file, size, unitAngle, ...rest })
  }
}

export class Flame extends Particles {
  constructor({ file = 'fire.png', size = 5, num = 50, minRadius = 0, maxRadius = .5, ...rest } = {}) {
    super({ num, file, size, minRadius, maxRadius, ...rest })
  }

  update({ delta, maxRounds = 75, min = 0, max = 8, axis = 2, minVelocity = 5, maxVelocity = 10, ...rest } = {}) {
    super.update({ delta, maxRounds, min, max, axis, minVelocity, maxVelocity, ...rest })
  }
}

export class RedFlame extends Flame {
  constructor() {
    super(({ file: 'fire.png', size: 10, num: 150, minRadius: 0, maxRadius: .5, blending: THREE.NormalBlending }))
  }
}

export class Fire extends Particles {
  constructor({ file = 'fire.png', num = 30, size = 30, opacity = .7, minRadius = 1.5, maxRadius = 3, color = 0xffffff } = {}) {
    super({ file, num, size, opacity, minRadius, maxRadius, color, blending: THREE.NormalBlending })
    this.mesh.rotateX(Math.PI)
  }

  update({ rotateY = .009, min = -8, max = 4, minVelocity = 1.5, maxVelocity = 5, ...rest } = {}) {
    super.update({ axis: 1, rotateY, min, max, minVelocity, maxVelocity, ...rest })
  }
}

export class Smoke extends Particles {
  constructor({ file = 'smoke.png', size = 1, num = 100, minRadius = 0, maxRadius = .5, color = 0x999999, blending = THREE.NormalBlending, ...rest } = {}) {
    super({ num, file, size, minRadius, maxRadius, color, blending, ...rest })
    this.mesh.rotateX(Math.PI)
  }

  update({ rotateY = .009, min = -4, max = 0, minVelocity = 2, maxVelocity = 5, ...rest } = {}) {
    super.update({ rotateY, min, max, minVelocity, maxVelocity, axis: 1, ...rest })
  }
}

export class BigSmoke extends Smoke {
  constructor() {
    super({ num: 40, size: 10, opacity: .7, minRadius: 1.5, maxRadius: 3 })
  }

  update({ min = -8, max = 4, minVelocity = 1.5, ...rest } = {}) {
    super.update({ min, max, minVelocity, ...rest })
  }
}