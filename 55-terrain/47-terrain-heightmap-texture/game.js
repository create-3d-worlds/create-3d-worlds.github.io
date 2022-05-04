import { createFullScene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import terrainFromHeightmap from '/utils/ground/terrainFromHeightmap.js'

const scene = createFullScene({ color: 0x6666ff })
createOrbitControls()
camera.position.y = 150

terrainFromHeightmap({
  src: '/assets/heightmaps/oos-heightmap-128.jpg',
  callback: mesh => {
    scene.add(mesh)
    mesh.position.y = -10
  },
  textureSrc: '/assets/heightmaps/oos-terrain.jpg',
  heightOffset: 3
})

/* LOOP */

void function update() {
  renderer.render(scene, camera)
  requestAnimationFrame(update)
}()