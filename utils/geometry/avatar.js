import * as THREE from 'three'
import { material } from '/utils/shaders/lava.js'

export const skins = {
  STONE: 'stone',
  LAVA: 'lava',
  DISCO: 'disco'
}

const { STONE, LAVA, DISCO } = skins

const createMaterial = skin => {
  if (skin == STONE) return new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load('/assets/textures/terrain/snow.jpg')
  })
  if (skin == LAVA) return material
  return new THREE.MeshNormalMaterial({
    flatShading: THREE.FlatShading
  })
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

export function updateAvatar(mesh, time, axis = 'z') {
  const limbs = [
    mesh.getObjectByName('leftHand'), mesh.getObjectByName('rightHand'),
    mesh.getObjectByName('leftLeg'), mesh.getObjectByName('rightLeg')
  ]
  const elapsed = Math.sin(time) * .666
  limbs.forEach((limb, i) => {
    limb.position[axis] = i % 2 ? elapsed : -elapsed
  })
}

export const { uniforms } = material