import { scene, renderer, camera, clock, createOrbitControls } from '/utils/scene.js'
import { createSun } from '/utils/light.js'
import { createGround } from '/utils/ground.js'
import { Smoke } from '/utils/classes/Particles.js'
import { followPath, createEllipse, createRailroadTracks } from '/utils/path.js'
import { loadModel } from '/utils/loaders.js'

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

const { mesh: locomotive, mixer } = await loadModel({
  file: 'vehicle/train/toy-locomotive/scene.gltf', angle: Math.PI, axis: [0, 1, 0]
})
scene.add(locomotive)

const particles = new Smoke(true)
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
