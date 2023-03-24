import * as THREE from 'three'
import { scene, camera, renderer, clock } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { createGround } from '/utils/ground.js'
import { loadModel, loadFbxAnimations } from '/utils/loaders.js'
import { getCursorPosition } from '/utils/helpers.js'

let neck, spine

scene.add(createSun())
camera.position.set(0, 1.5, 3)
renderer.outputEncoding = THREE.GammaEncoding

scene.add(createGround())

const { mesh } = await loadModel({ file: 'character/soldier/partisan.fbx', fixColors: true })
const animations = await loadFbxAnimations({ idle: 'Rifle Idle' }, 'character/soldier/')

mesh.traverse(child => {
  if (child.name === 'mixamorigNeck') neck = child
  if (child.name === 'mixamorigSpine') spine = child
})

scene.add(mesh)

const mixer = new THREE.AnimationMixer(mesh)
const clip = animations[0]
// removes spine and neck from animation
clip.tracks = clip.tracks.filter(t => !t.name.includes('Spine') && !t.name.includes('Neck'))
mixer.clipAction(clip).play()

/* FUNCTIONS */

function cursorToDegrees(cursor, degreeMax) {
  const { x, y } = cursor
  let degreeX = 0, degreeY = 0
  const halfX = window.innerWidth / 2
  const halfY = window.innerHeight / 2

  const xdiff = x - halfX
  degreeX = degreeMax * xdiff / halfX

  const ydiff = y - halfY
  if (ydiff < 0) degreeMax *= 0.5
  degreeY = degreeMax * ydiff / halfY

  return { x: degreeX, y: degreeY }
}

function lookAt(cursor, joint, degreeMax) {
  const degrees = cursorToDegrees(cursor, degreeMax)
  joint.rotation.y = THREE.MathUtils.degToRad(degrees.x)
  joint.rotation.x = THREE.MathUtils.degToRad(degrees.y)
}

/* LOOP */

void function update() {
  mixer?.update(clock.getDelta())
  renderer.render(scene, camera)
  requestAnimationFrame(update)
}()

/* EVENTS */

document.addEventListener('mousemove', e => {
  const cursor = getCursorPosition(e)
  lookAt(cursor, neck, 40)
  lookAt(cursor, spine, 40)
})
