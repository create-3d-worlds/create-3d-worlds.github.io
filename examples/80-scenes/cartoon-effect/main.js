// MeshToonMaterial removes nuisances, OutlineEffect adds black borders
import * as THREE from 'three'
import { OutlineEffect } from '/node_modules/three/examples/jsm/effects/OutlineEffect.js'
import { scene, renderer, camera, createOrbitControls } from '/utils/scene.js'
import { createTrees } from '/utils/geometry/trees.js'
import { createSun } from '/utils/light.js'

const mapSize = 200

const sun = createSun()
scene.add(sun)

scene.background = new THREE.Color('skyblue')

const controls = createOrbitControls()
camera.position.set(0, 30, 40)

scene.add(createTrees({ mapSize: mapSize * .5, n: 100 }))

function createGround({ size = mapSize } = {}) {
  const material = new THREE.MeshToonMaterial({ color: 0x509f53 })
  const geometry = new THREE.CircleGeometry(size, 32)
  geometry.rotateX(-Math.PI * 0.5)

  const mesh = new THREE.Mesh(geometry, material)
  mesh.receiveShadow = true
  return mesh
}

scene.add(createGround())

const effect = new OutlineEffect(renderer, { defaultThickness: 0.003 })

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const timer = Date.now() * 0.0002
  controls.update()

  sun.position.x = Math.sin(timer) * 100
  sun.position.y = Math.cos(timer) * 100

  effect.render(scene, camera)
}()