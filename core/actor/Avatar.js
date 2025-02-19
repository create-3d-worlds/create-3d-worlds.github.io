import * as THREE from 'three'
import { clock } from '/core/scene.js'
import Player from './Player.js'
import { material } from '/core/shaders/lava.js'
import { jumpStyles } from '/core/constants.js'

const skins = {
  STONE: 'STONE',
  LAVA: 'LAVA',
  DISCO: 'DISCO'
}
const { STONE, LAVA, DISCO } = skins

const createMaterial = skin => {
  if (skin == STONE) return new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load('/assets/textures/terrain/snow.jpg')
  })
  if (skin == LAVA) return material
  return new THREE.MeshNormalMaterial()
}

const chooseGeometry = skin => {
  if (skin == STONE) return THREE.DodecahedronGeometry
  if (skin == LAVA) return THREE.SphereGeometry
  if (skin == DISCO) return THREE.SphereGeometry
  return THREE.SphereGeometry
}

export function createAvatar({ skin = STONE, r = 1.2 } = {}) {
  const group = new THREE.Group()
  const Geometry = chooseGeometry(skin)
  const material = createMaterial(skin)

  const bodyGeo = new Geometry(r * .66)
  const body = new THREE.Mesh(bodyGeo, material)
  body.position.set(0, r, 0)
  group.add(body)

  const limbGeo = bodyGeo.clone().scale(.6, .6, .6)
  const rightHand = new THREE.Mesh(limbGeo, material)
  rightHand.position.set(-r, r, 0)
  rightHand.name = 'rightHand'
  group.add(rightHand)

  const leftHand = new THREE.Mesh(limbGeo, material)
  leftHand.position.set(r, r, 0)
  leftHand.name = 'leftHand'
  group.add(leftHand)

  const rightLeg = new THREE.Mesh(limbGeo, material)
  rightLeg.position.set(r / 2, r * .3, 0)
  rightLeg.name = 'rightLeg'
  group.add(rightLeg)

  const leftLeg = new THREE.Mesh(limbGeo, material)
  leftLeg.position.set(-r / 2, r * .3, 0)
  leftLeg.name = 'leftLeg'
  group.add(leftLeg)

  return group
}

/** CLASS */

export default class Avatar extends Player {
  constructor({
    skin = STONE,
    jumpStyle = skin == DISCO ? jumpStyles.FLY : jumpStyles.FLY_JUMP,
    maxJumpTime = .66,
    size = 1,
    speed = size * 4,
    showHealthBar = false,
    ...params
  } = {}) {
    super({
      mesh: createAvatar({ skin, r: size }),
      speed,
      jumpStyle,
      maxJumpTime,
      showHealthBar,
      animDict: { jump: true },
      ...params,
    })
    this.skin = skin
    this.jumpForce = this.gravity * 1.8
    if (this.chaseCamera) {
      this.chaseCamera.speed = 4
      this.chaseCamera.distance = 4
    }
    this.limbs = [
      this.mesh.getObjectByName('leftHand'), this.mesh.getObjectByName('rightHand'),
      this.mesh.getObjectByName('leftLeg'), this.mesh.getObjectByName('rightLeg')
    ]
  }

  idleAnim() {
    const idleRange = .09
    this.limbs.forEach(({ position }) => {
      position.z = position.z > idleRange
        ? position.z * .9 // normalize
        : Math.sin(clock.getElapsedTime()) * idleRange // breathe
    })
  }

  walkAnim(name) {
    const r = this.height * .5
    const speedFactor = name === 'run' ? 9 : 6

    const time = Math.sin(clock.getElapsedTime() * speedFactor) * r
    const elapsed = Math.sin(time) * .666

    this.limbs.forEach((limb, i) => {
      limb.position.z = i % 2 ? elapsed : -elapsed
    })
  }

  jumpAnim() {
    this.limbs.forEach(limb => {
      limb.position.z = this.height * .3
    })
  }

  update(delta = 1 / 60) {
    super.update(delta)
    const { name } = this.currentState

    if (name === 'walk' || name === 'run')
      this.walkAnim(name)
    else if (this.input.jump)
      this.jumpAnim()
    else
      this.idleAnim(true)

    if (this.skin == LAVA) material.uniforms.time.value += 0.8 * delta
  }
}
