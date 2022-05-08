import { scene, renderer, camera, clock, createOrbitControls } from '/utils/scene.js'
import { dirLight, hemLight } from '/utils/light.js'
import { loadGlb } from '/utils/loaders.js'
import { createGround } from '/utils/ground.js'

let animIndex = 1

hemLight()
dirLight()

camera.position.set(0, 20, 50)
createOrbitControls()

scene.add(createGround({ size: 100 }))

const { model, mixer, animations } = await loadGlb({ glb: 'monster/monster.glb' })
model.rotateZ(Math.PI / 4)
model.position.y = -20
scene.add(model)

mixer.clipAction(animations[animIndex]).play()

// LOOP

void function render() {
  const delta = clock.getDelta()
  if (mixer) mixer.update(delta)
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}()

// EVENTS

document.addEventListener('click', () => {
  animIndex++
  const animation = animations[animIndex % animations.length]
  mixer.clipAction(animation).play()
})
