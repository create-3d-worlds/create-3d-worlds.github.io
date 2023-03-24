import * as THREE from 'three'
import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js'
import { scene, camera, renderer, clock, createOrbitControls } from '/utils/scene.js'
import { createSun } from '/utils/light.js'

const mixers = []

scene.add(createSun())
createOrbitControls()
camera.position.z = 50

scene.background = new THREE.Color(0x8FBCD4)

const loader = new GLTFLoader()

const onLoad = (data, position) => {
  const { scene: model, animations } = data
  model.position.set(...position)
  model.scale.set(.4, .4, .4)
  const mixer = new THREE.AnimationMixer(model)
  mixers.push(mixer)
  const action = mixer.clipAction(animations[0])
  action.play()
  scene.add(model)
}

loader.load('/assets/models/animal/parrot.glb', data => onLoad(data, [0, 1.5, 0]))

loader.load('/assets/models/animal/flamingo.glb', data => onLoad(data, [25, 0, -10]))

loader.load('/assets/models/animal/stork.glb', data => onLoad(data, [-25, 0, -10]))

/* LOOP */

renderer.setAnimationLoop(() => {
  const delta = clock.getDelta()
  for (const mixer of mixers) mixer.update(delta)
  renderer.render(scene, camera)
})
