import * as THREE from '/node_modules/three119/build/three.module.js'
import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'
import { addVelocity } from '/utils/particles.js'

camera.position.set(5, 5, 3)
createOrbitControls()

const vertexNormals = []
const geometry = new THREE.SphereGeometry(4, 64, 64)

const particles = createParticlesFromGeometry(geometry)
scene.add(particles)

/* FUNCTIONS */

function createParticlesFromGeometry(geometry) {
  const material = new THREE.PointsMaterial({
    depthTest: false,
    map: new THREE.TextureLoader().load('/assets/particles/fireball.png'),
    blending: THREE.AdditiveBlending,
    opacity: 0.6,
  })

  for (let i = 0; i < geometry.vertices.length; i++)
    vertexNormals.push(new THREE.Vector3(0, 0, 0))

  geometry.faces.forEach(f => {
    vertexNormals[f.a].add(f.vertexNormals[0])
    vertexNormals[f.b].add(f.vertexNormals[1])
    vertexNormals[f.c].add(f.vertexNormals[2])
  })

  const particles = new THREE.Points(geometry, material)
  addVelocity({ particles, min: 0, max: 0.005 })
  return particles
}

function updateVertices() {
  geometry.vertices.forEach((v, i) => {
    v.x += vertexNormals[i].x * v.velocity
    v.y += vertexNormals[i].y * v.velocity
    v.z += vertexNormals[i].z * v.velocity
  })
  geometry.verticesNeedUpdate = true
}

/* LOOP */

void function render() {
  renderer.render(scene, camera)
  updateVertices()
  requestAnimationFrame(render)
}()
