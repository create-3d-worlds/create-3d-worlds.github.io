import * as THREE from '/node_modules/three108/build/three.module.js'
import {randomInRange, randomColor} from './helpers.js'
const loader = new THREE.TextureLoader()

// TODO: delete
function createShadowMaterial(options) {
  // https://stackoverflow.com/questions/47367181/threejs-material-with-shadows-but-no-lights
  THREE.ShaderLib.lambert.fragmentShader = THREE.ShaderLib.lambert.fragmentShader.replace(
    'vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;',
    `#ifndef CUSTOM
          vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
      #else
          vec3 outgoingLight = diffuseColor.rgb * ( 1.0 - 0.5 * ( 1.0 - getShadowMask() ) ); // shadow intensity hardwired to 0.5 here
      #endif`
  )
  const material = new THREE.MeshLambertMaterial(options)
  material.defines = material.defines || {}
  material.defines.CUSTOM = ''
  return material
}

// TODO: rename to ground.js and createGround
export function createFloor({ r = 4000, color = 0x60bf63, file } = {}) {
  const options = {
    side: THREE.DoubleSide // for debugin
  }
  if (file) {
    const texture = loader.load(`/assets/textures/${file}`)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(r / 10, r / 10)
    options.map = texture
  } else
    options.color = color

  const geometry = new THREE.CircleGeometry(r, 32)
  geometry.rotateX(-Math.PI / 2)
  const material = new THREE.MeshLambertMaterial(options)
  const mesh = new THREE.Mesh(geometry, material)
  mesh.receiveShadow = true
  return mesh
}

export function createTerrain(size = 1000, segments = 50) {
  const geometry = new THREE.PlaneGeometry(size, size, segments, segments)
  geometry.rotateX(- Math.PI / 2)
  geometry.vertices.forEach(vertex => {
    vertex.x += randomInRange(-10, 10)
    vertex.y += randomInRange(-5, 15)
    vertex.z += randomInRange(-10, 10)
  })
  geometry.faces.forEach(face => {
    face.vertexColors.push(randomColor(), randomColor(), randomColor())
  })
  const material = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors })
  return new THREE.Mesh(geometry, material)
}

export function createWater(size = 1000, opacity = 0.75, file) {
  const geometry = new THREE.PlaneGeometry(size, size, 1, 1)
  geometry.rotateX(-Math.PI / 2)
  const material = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity
  })
  if (file) {
    const texture = loader.load(`/assets/textures/${file}`)
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(5, 5)
    material.map = texture
  } else
    material.color.setHex(0x6699ff)

  return new THREE.Mesh(geometry, material)
}
