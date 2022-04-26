import * as THREE from '/node_modules/three108/build/three.module.js'
import {scene, camera, renderer, createOrbitControls} from '/utils/scene.js'

const scale = 0.02
const avgVertexNormals = []
const avgVertexCount = []

camera.position.set(5, 5, 3)
createOrbitControls()

const sphere = new THREE.BoxGeometry(4, 6, 4, 20, 20, 20)
sphere.vertices.forEach(v => {
  v.velocity = Math.random()
})
createParticleSystemFromGeometry(sphere)

/* FUNCTIONS */

function explode() {
  let count = 0
  sphere.vertices.forEach(v => {
    v.x += avgVertexNormals[count].x * v.velocity * scale
    v.y += avgVertexNormals[count].y * v.velocity * scale
    v.z += avgVertexNormals[count].z * v.velocity * scale
    count++
  })
  sphere.verticesNeedUpdate = true
}

function createParticleSystemFromGeometry(geometry) {
  const material = new THREE.PointsMaterial({
    depthTest: false,
    map: new THREE.TextureLoader().load('/assets/textures/ps_ball.png'),
    blending: THREE.AdditiveBlending,
    opacity: 0.6,
  })
  const ps = new THREE.Points(geometry, material)
  ps.sortParticles = true
  scene.add(ps)

  for (let i = 0; i < sphere.vertices.length; i++) {
    avgVertexNormals.push(new THREE.Vector3(0, 0, 0))
    avgVertexCount.push(0)
  }

  sphere.faces.forEach(f => {
    const vA = f.vertexNormals[0]
    const vB = f.vertexNormals[1]
    const vC = f.vertexNormals[2]

    avgVertexCount[f.a] += 1
    avgVertexCount[f.b] += 1
    avgVertexCount[f.c] += 1

    avgVertexNormals[f.a].add(vA)
    avgVertexNormals[f.b].add(vB)
    avgVertexNormals[f.c].add(vC)
  })

  for (let i = 0; i < avgVertexNormals.length; i++)
    avgVertexNormals[i].divideScalar(avgVertexCount[i])
}

/* LOOP */

void function render() {
  renderer.render(scene, camera)
  explode()
  requestAnimationFrame(render)
}()
