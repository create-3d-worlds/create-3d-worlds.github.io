import { loadModel } from '/utils/loaders.js'
import { createWorldScene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { randomInCircle } from '/utils/helpers.js'

const scene = createWorldScene()
const controls = createOrbitControls()
camera.position.set(0, 50, 50)

const HUNTERS = 2
const BIRDS = 10
const HORSES = 10
const HOUSES = 3

const randomPos = mesh => {
  const { x, z } = randomInCircle(50)
  mesh.position.set(x, 0, z)
  return mesh
}

{
  const { mesh } = await loadModel({ file: 'birds/flamingo.glb', size: 5, shouldCenter: true, shouldAdjustHeight: true })
  for (let i = 0; i < BIRDS; i++) {
    const bird = mesh.clone()
    scene.add(randomPos(bird))
  }
}

{
  const { mesh } = await loadModel({ file: 'tower-wizard/scene.gltf', size: 25, shouldCenter: true, shouldAdjustHeight: true })
  const tower = mesh.clone() // mesh.children[0].clone()
  tower.position.y = 100
  scene.add(randomPos(tower))
}

{
  const { mesh } = await loadModel({ file: 'character-ogro/ogro.md2', texture: 'character-ogro/skins/arboshak.png', size: 5, rot: { axis: [0, 1, 0], angle: -Math.PI * .5 }, shouldCenter: true, shouldAdjustHeight: true })
  for (let i = 0; i < HUNTERS; i++) {
    const hunter = mesh.clone()
    scene.add(randomPos(hunter))
  }
}

{
  const { mesh } = await loadModel({ file: 'animal-horse/horse.glb', size: 5, shouldCenter: true, shouldAdjustHeight: true })
  for (let i = 0; i < HORSES; i++) {
    const horse = mesh.clone()
    scene.add(randomPos(horse))
  }
}

{
  const { mesh } = await loadModel({ file: 'houses/house2-01.obj', mtl: 'houses/house2-01.mtl', size: 5, shouldCenter: true, shouldAdjustHeight: true })
  for (let i = 0; i < HOUSES; i++) {
    const house = mesh.clone()
    scene.add(randomPos(house))
  }
}

/* LOOP */

void function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}()
