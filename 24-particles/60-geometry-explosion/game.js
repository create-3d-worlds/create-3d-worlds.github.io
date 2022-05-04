import * as THREE from '/node_modules/three108/build/three.module.js'
import { scene, camera, renderer, createOrbitControls } from '/utils/scene.js'

const avgVertexNormals = []

camera.position.set(5, 5, 3)
createOrbitControls()

const geometry = new THREE.SphereGeometry(4, 64, 64) // BoxGeometry(4, 6, 4, 20, 20, 20)

const particles = createParticlesFromGeometry(geometry)
scene.add(particles)

/* FUNCTIONS */

function createParticlesFromGeometry(geometry) {
  geometry.vertices.forEach(v => {
    v.velocity = Math.random() * 0.005
  })
  const material = new THREE.PointsMaterial({
    depthTest: false,
    map: new THREE.TextureLoader().load('/assets/textures/ps_ball.png'),
    blending: THREE.AdditiveBlending,
    opacity: 0.6,
  })

  for (let i = 0; i < geometry.vertices.length; i++)
    avgVertexNormals.push(new THREE.Vector3(0, 0, 0))

  geometry.faces.forEach(f => {
    avgVertexNormals[f.a].add(f.vertexNormals[0])
    avgVertexNormals[f.b].add(f.vertexNormals[1])
    avgVertexNormals[f.c].add(f.vertexNormals[2])
  })

  return new THREE.Points(geometry, material)
}

function updateVertices() {
  geometry.vertices.forEach((v, i) => {
    v.x += avgVertexNormals[i].x * v.velocity
    v.y += avgVertexNormals[i].y * v.velocity
    v.z += avgVertexNormals[i].z * v.velocity
  })
  geometry.verticesNeedUpdate = true
}

/* LOOP */

void function render() {
  renderer.render(scene, camera)
  updateVertices()
  requestAnimationFrame(render)
}()
