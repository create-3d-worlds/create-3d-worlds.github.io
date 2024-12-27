import * as THREE from 'three'
import { scene, renderer, camera, clock, createOrbitControls } from '/core/scene.js'
import { createSun } from '/core/light.js'
import { createGround } from '/core/ground.js'
import { Smoke } from '/core/Particles.js'
import { followPath, createEllipse, createRailroadTracks } from '/core/path.js'
import { loadModel } from '/core/loaders.js'

const createMixer = (mesh, animations, i = 0) => {
  const mixer = new THREE.AnimationMixer(mesh)
  const action = mixer.clipAction(animations[i])
  action.play()
  return mixer
}

createOrbitControls()
camera.position.z = 20

scene.add(createSun())
scene.add(createGround({ size: 50, circle: true }))

const xRadius = 40, yRadius = 15

const line = createEllipse({ xRadius, yRadius })
const { path } = line.userData
const outerLine = createEllipse({ xRadius: xRadius + .4, yRadius: yRadius + .4 })
const innerLine = createEllipse({ xRadius: xRadius - .4, yRadius: yRadius - .4 })
scene.add(outerLine, innerLine)

const locomotive = await loadModel({
  file: 'vehicle/train/toy-locomotive/scene.gltf', angle: Math.PI, axis: [0, 1, 0]
})
scene.add(locomotive)
const mixer = createMixer(locomotive, locomotive.userData.animations)

const particles = new Smoke({ num: 10, maxRadius: .1, })
particles.mesh.position.set(0, 1.5, 1.25)
particles.mesh.rotateX(-.2)
locomotive.add(particles.mesh)

const tracks = createRailroadTracks(path, 200)
scene.add(...tracks)

/* LOOP */

void function loop() {
  requestAnimationFrame(loop)
  const delta = clock.getDelta()
  const elapsedTime = clock.getElapsedTime()

  followPath({ path, mesh: locomotive, elapsedTime, speed: .025, y: .75 })
  particles.update({ delta })
  mixer.update(delta * 15)

  renderer.render(scene, camera)
}()
