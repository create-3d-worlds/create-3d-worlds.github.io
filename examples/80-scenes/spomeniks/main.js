/* global ModifierStack, Cloth */
import '/libs/modifiers.min.js'
import * as THREE from 'three'
import { scene, renderer, camera, createOrbitControls } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { createGround } from '/utils/ground.js'

scene.add(createSun(), createGround())
createOrbitControls()

function createFlag({ file = 'prva-proleterska.jpg', scale = .5 } = {}) {
  const flag = new THREE.Group()
  flag.rotateY(-Math.PI * .5)

  const geometry = new THREE.CylinderGeometry(.03, .03, 4, 32)
  const material = new THREE.MeshPhongMaterial({ color: new THREE.Color(0x654321) })
  const pole = new THREE.Mesh(geometry, material)
  pole.translateY(2)
  pole.castShadow = true
  flag.add(pole)

  const texture = new THREE.TextureLoader().load(`/assets/images/${file}`)
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(600, 430, 20, 20, true),
    new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }))
  plane.scale.set(.0025, .0025, .0025)
  plane.position.set(.75, 3.5, 0)
  plane.castShadow = true

  flag.add(plane)

  const modifier = new ModifierStack(plane)
  const cloth = new Cloth(3, 0)
  cloth.setForce(0.2, -0.2, -0.2)

  modifier.addModifier(cloth)
  cloth.lockXMin(0)

  flag.scale.set(scale, scale, scale)
  return { flag, modifier }
}

const { flag, modifier } = createFlag({ file: 'prva-proleterska.jpg'})
scene.add(flag)
flag.position.x = -1

const { flag: flag2, modifier: modifier2 } = createFlag({ file: 'sfrj.png'})
scene.add(flag2)
flag2.position.x = 1

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  modifier.apply()
  modifier2.apply()
  renderer.render(scene, camera)
}()