import * as THREE from '/node_modules/three125/build/three.module.js'

export const Cloud = function() {
  THREE.Mesh.call(this, new THREE.BoxGeometry(1, 1, 1))
}

Cloud.prototype = Object.create(THREE.Mesh.prototype)
Cloud.prototype.constructor = Cloud

