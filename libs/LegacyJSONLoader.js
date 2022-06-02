import * as THREE from '/node_modules/three127/build/three.module.js'

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

export function LegacyJSONLoader (manager) {

  if (typeof manager === 'boolean') {

    console.warn('THREE.JSONLoader: showStatus parameter has been removed from constructor.')
    manager = undefined

  }

  this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager

  this.withCredentials = false

}

Object.assign(LegacyJSONLoader.prototype, {

  crossOrigin: 'anonymous',

  load(url, onLoad, onProgress, onError) {

    const scope = this

    const path = (this.path === undefined) ? THREE.LoaderUtils.extractUrlBase(url) : this.path

    const loader = new THREE.FileLoader(this.manager)
    loader.setPath(this.path)
    loader.setWithCredentials(this.withCredentials)
    loader.load(url, text => {

      const json = JSON.parse(text)
      const {metadata} = json

      if (metadata !== undefined) {

        const {type} = metadata

        if (type !== undefined)

          if (type.toLowerCase() === 'object') {

            console.error('THREE.JSONLoader: ' + url + ' should be loaded with THREE.ObjectLoader instead.')
            return

          }

      }

      const object = scope.parse(json, path)
      onLoad(object.geometry, object.materials)

    }, onProgress, onError)

  },

  setPath(value) {

    this.path = value
    return this

  },

  setResourcePath(value) {

    this.resourcePath = value
    return this

  },

  setCrossOrigin(value) {

    this.crossOrigin = value
    return this

  },

  parse: (function() {

    const _BlendingMode = {
      NoBlending: THREE.NoBlending,
      NormalBlending: THREE.NormalBlending,
      AdditiveBlending: THREE.AdditiveBlending,
      SubtractiveBlending: THREE.SubtractiveBlending,
      MultiplyBlending: THREE.MultiplyBlending,
      CustomBlending: THREE.CustomBlending
    }

    const _color = new THREE.Color()
    const _textureLoader = new THREE.TextureLoader()
    const _materialLoader = new THREE.MaterialLoader()

    function initMaterials(materials, texturePath, crossOrigin) {

      const array = []

      for (let i = 0; i < materials.length; ++ i)

        array[ i ] = createMaterial(materials[ i ], texturePath, crossOrigin)

      return array

    }

    function createMaterial(m, texturePath, crossOrigin) {

      // convert from old material format

      const textures = {}

      //

      const json = {
        uuid: THREE.Math.generateUUID(),
        type: 'MeshLambertMaterial'
      }

      for (const name in m) {

        const value = m[ name ]

        switch (name) {

          case 'DbgColor':
          case 'DbgIndex':
          case 'opticalDensity':
          case 'illumination':
            break
          case 'DbgName':
            json.name = value
            break
          case 'blending':
            json.blending = _BlendingMode[ value ]
            break
          case 'colorAmbient':
          case 'mapAmbient':
            console.warn('THREE.Loader.createMaterial:', name, 'is no longer supported.')
            break
          case 'colorDiffuse':
            json.color = _color.fromArray(value).getHex()
            break
          case 'colorSpecular':
            json.specular = _color.fromArray(value).getHex()
            break
          case 'colorEmissive':
            json.emissive = _color.fromArray(value).getHex()
            break
          case 'specularCoef':
            json.shininess = value
            break
          case 'shading':
            if (value.toLowerCase() === 'basic') json.type = 'MeshBasicMaterial'
            if (value.toLowerCase() === 'phong') json.type = 'MeshPhongMaterial'
            if (value.toLowerCase() === 'standard') json.type = 'MeshStandardMaterial'
            break
          case 'mapDiffuse':
            json.map = loadTexture(value, m.mapDiffuseRepeat, m.mapDiffuseOffset, m.mapDiffuseWrap, m.mapDiffuseAnisotropy, textures, texturePath, crossOrigin)
            break
          case 'mapDiffuseRepeat':
          case 'mapDiffuseOffset':
          case 'mapDiffuseWrap':
          case 'mapDiffuseAnisotropy':
            break
          case 'mapEmissive':
            json.emissiveMap = loadTexture(value, m.mapEmissiveRepeat, m.mapEmissiveOffset, m.mapEmissiveWrap, m.mapEmissiveAnisotropy, textures, texturePath, crossOrigin)
            break
          case 'mapEmissiveRepeat':
          case 'mapEmissiveOffset':
          case 'mapEmissiveWrap':
          case 'mapEmissiveAnisotropy':
            break
          case 'mapLight':
            json.lightMap = loadTexture(value, m.mapLightRepeat, m.mapLightOffset, m.mapLightWrap, m.mapLightAnisotropy, textures, texturePath, crossOrigin)
            break
          case 'mapLightRepeat':
          case 'mapLightOffset':
          case 'mapLightWrap':
          case 'mapLightAnisotropy':
            break
          case 'mapAO':
            json.aoMap = loadTexture(value, m.mapAORepeat, m.mapAOOffset, m.mapAOWrap, m.mapAOAnisotropy, textures, texturePath, crossOrigin)
            break
          case 'mapAORepeat':
          case 'mapAOOffset':
          case 'mapAOWrap':
          case 'mapAOAnisotropy':
            break
          case 'mapBump':
            json.bumpMap = loadTexture(value, m.mapBumpRepeat, m.mapBumpOffset, m.mapBumpWrap, m.mapBumpAnisotropy, textures, texturePath, crossOrigin)
            break
          case 'mapBumpScale':
            json.bumpScale = value
            break
          case 'mapBumpRepeat':
          case 'mapBumpOffset':
          case 'mapBumpWrap':
          case 'mapBumpAnisotropy':
            break
          case 'mapNormal':
            json.normalMap = loadTexture(value, m.mapNormalRepeat, m.mapNormalOffset, m.mapNormalWrap, m.mapNormalAnisotropy, textures, texturePath, crossOrigin)
            break
          case 'mapNormalFactor':
            json.normalScale = value
            break
          case 'mapNormalRepeat':
          case 'mapNormalOffset':
          case 'mapNormalWrap':
          case 'mapNormalAnisotropy':
            break
          case 'mapSpecular':
            json.specularMap = loadTexture(value, m.mapSpecularRepeat, m.mapSpecularOffset, m.mapSpecularWrap, m.mapSpecularAnisotropy, textures, texturePath, crossOrigin)
            break
          case 'mapSpecularRepeat':
          case 'mapSpecularOffset':
          case 'mapSpecularWrap':
          case 'mapSpecularAnisotropy':
            break
          case 'mapMetalness':
            json.metalnessMap = loadTexture(value, m.mapMetalnessRepeat, m.mapMetalnessOffset, m.mapMetalnessWrap, m.mapMetalnessAnisotropy, textures, texturePath, crossOrigin)
            break
          case 'mapMetalnessRepeat':
          case 'mapMetalnessOffset':
          case 'mapMetalnessWrap':
          case 'mapMetalnessAnisotropy':
            break
          case 'mapRoughness':
            json.roughnessMap = loadTexture(value, m.mapRoughnessRepeat, m.mapRoughnessOffset, m.mapRoughnessWrap, m.mapRoughnessAnisotropy, textures, texturePath, crossOrigin)
            break
          case 'mapRoughnessRepeat':
          case 'mapRoughnessOffset':
          case 'mapRoughnessWrap':
          case 'mapRoughnessAnisotropy':
            break
          case 'mapAlpha':
            json.alphaMap = loadTexture(value, m.mapAlphaRepeat, m.mapAlphaOffset, m.mapAlphaWrap, m.mapAlphaAnisotropy, textures, texturePath, crossOrigin)
            break
          case 'mapAlphaRepeat':
          case 'mapAlphaOffset':
          case 'mapAlphaWrap':
          case 'mapAlphaAnisotropy':
            break
          case 'flipSided':
            json.side = THREE.BackSide
            break
          case 'doubleSided':
            json.side = THREE.DoubleSide
            break
          case 'transparency':
            console.warn('THREE.Loader.createMaterial: transparency has been renamed to opacity')
            json.opacity = value
            break
          case 'depthTest':
          case 'depthWrite':
          case 'colorWrite':
          case 'opacity':
          case 'reflectivity':
          case 'transparent':
          case 'visible':
          case 'wireframe':
            json[ name ] = value
            break
          case 'vertexColors':
            if (value === true) json.vertexColors = THREE.VertexColors
            if (value === 'face') json.vertexColors = THREE.FaceColors
            break
          default:
            console.error('THREE.Loader.createMaterial: Unsupported', name, value)
            break

        }

      }

      if (json.type === 'MeshBasicMaterial') delete json.emissive
      if (json.type !== 'MeshPhongMaterial') delete json.specular

      if (json.opacity < 1) json.transparent = true

      _materialLoader.setTextures(textures)

      return _materialLoader.parse(json)

    }

    function loadTexture(path, repeat, offset, wrap, anisotropy, textures, texturePath, crossOrigin) {

      const fullPath = texturePath + path
      const loader = THREE.Loader.Handlers.get(fullPath)

      let texture

      if (loader !== null)

        texture = loader.load(fullPath)

				 else {

        _textureLoader.setCrossOrigin(crossOrigin)
        texture = _textureLoader.load(fullPath)

      }

      if (repeat !== undefined) {

        texture.repeat.fromArray(repeat)

        if (repeat[ 0 ] !== 1) texture.wrapS = THREE.RepeatWrapping
        if (repeat[ 1 ] !== 1) texture.wrapT = THREE.RepeatWrapping

      }

      if (offset !== undefined)

        texture.offset.fromArray(offset)

      if (wrap !== undefined) {

        if (wrap[ 0 ] === 'repeat') texture.wrapS = THREE.RepeatWrapping
        if (wrap[ 0 ] === 'mirror') texture.wrapS = THREE.MirroredRepeatWrapping

        if (wrap[ 1 ] === 'repeat') texture.wrapT = THREE.RepeatWrapping
        if (wrap[ 1 ] === 'mirror') texture.wrapT = THREE.MirroredRepeatWrapping

      }

      if (anisotropy !== undefined)

        texture.anisotropy = anisotropy

      const uuid = THREE.Math.generateUUID()

      textures[ uuid ] = texture

      return uuid

    }

    function parseModel(json, geometry) {

      function isBitSet(value, position) {

        return value & (1 << position)

      }

      let i, j, fi,

        offset, zLength,

        colorIndex, normalIndex, uvIndex, materialIndex,

        type,
        isQuad,
        hasMaterial,
        hasFaceVertexUv,
        hasFaceNormal, hasFaceVertexNormal,
        hasFaceColor, hasFaceVertexColor,

        vertex, face, faceA, faceB, hex, normal,

        uvLayer, uv, u, v,

        {faces} = json,
        {vertices} = json,
        {normals} = json,
        {colors} = json,

        {scale} = json,

        nUvLayers = 0

      if (json.uvs !== undefined) {

        // disregard empty arrays

        for (i = 0; i < json.uvs.length; i ++)

          if (json.uvs[ i ].length) nUvLayers ++

        for (i = 0; i < nUvLayers; i ++)

          geometry.faceVertexUvs[ i ] = []

      }

      offset = 0
      zLength = vertices.length

      while (offset < zLength) {

        vertex = new THREE.Vector3()

        vertex.x = vertices[ offset ++ ] * scale
        vertex.y = vertices[ offset ++ ] * scale
        vertex.z = vertices[ offset ++ ] * scale

        geometry.vertices.push(vertex)

      }

      offset = 0
      zLength = faces.length

      while (offset < zLength) {

        type = faces[ offset ++ ]

        isQuad = isBitSet(type, 0)
        hasMaterial = isBitSet(type, 1)
        hasFaceVertexUv = isBitSet(type, 3)
        hasFaceNormal = isBitSet(type, 4)
        hasFaceVertexNormal = isBitSet(type, 5)
        hasFaceColor = isBitSet(type, 6)
        hasFaceVertexColor = isBitSet(type, 7)

        // console.log("type", type, "bits", isQuad, hasMaterial, hasFaceVertexUv, hasFaceNormal, hasFaceVertexNormal, hasFaceColor, hasFaceVertexColor);

        if (isQuad) {

          faceA = new THREE.Face3()
          faceA.a = faces[ offset ]
          faceA.b = faces[ offset + 1 ]
          faceA.c = faces[ offset + 3 ]

          faceB = new THREE.Face3()
          faceB.a = faces[ offset + 1 ]
          faceB.b = faces[ offset + 2 ]
          faceB.c = faces[ offset + 3 ]

          offset += 4

          if (hasMaterial) {

            materialIndex = faces[ offset ++ ]
            faceA.materialIndex = materialIndex
            faceB.materialIndex = materialIndex

          }

          // to get face <=> uv index correspondence

          fi = geometry.faces.length

          if (hasFaceVertexUv)

            for (i = 0; i < nUvLayers; i ++) {

              uvLayer = json.uvs[ i ]

              geometry.faceVertexUvs[ i ][ fi ] = []
              geometry.faceVertexUvs[ i ][ fi + 1 ] = []

              for (j = 0; j < 4; j ++) {

                uvIndex = faces[ offset ++ ]

                u = uvLayer[ uvIndex * 2 ]
                v = uvLayer[ uvIndex * 2 + 1 ]

                uv = new THREE.Vector2(u, v)

                if (j !== 2) geometry.faceVertexUvs[ i ][ fi ].push(uv)
                if (j !== 0) geometry.faceVertexUvs[ i ][ fi + 1 ].push(uv)

              }

            }

          if (hasFaceNormal) {

            normalIndex = faces[ offset ++ ] * 3

            faceA.normal.set(
              normals[ normalIndex ++ ],
              normals[ normalIndex ++ ],
              normals[ normalIndex ]
            )

            faceB.normal.copy(faceA.normal)

          }

          if (hasFaceVertexNormal)

            for (i = 0; i < 4; i ++) {

              normalIndex = faces[ offset ++ ] * 3

              normal = new THREE.Vector3(
                normals[ normalIndex ++ ],
                normals[ normalIndex ++ ],
                normals[ normalIndex ]
              )

              if (i !== 2) faceA.vertexNormals.push(normal)
              if (i !== 0) faceB.vertexNormals.push(normal)

            }

          if (hasFaceColor) {

            colorIndex = faces[ offset ++ ]
            hex = colors[ colorIndex ]

            faceA.color.setHex(hex)
            faceB.color.setHex(hex)

          }

          if (hasFaceVertexColor)

            for (i = 0; i < 4; i ++) {

              colorIndex = faces[ offset ++ ]
              hex = colors[ colorIndex ]

              if (i !== 2) faceA.vertexColors.push(new THREE.Color(hex))
              if (i !== 0) faceB.vertexColors.push(new THREE.Color(hex))

            }

          geometry.faces.push(faceA)
          geometry.faces.push(faceB)

        } else {

          face = new THREE.Face3()
          face.a = faces[ offset ++ ]
          face.b = faces[ offset ++ ]
          face.c = faces[ offset ++ ]

          if (hasMaterial) {

            materialIndex = faces[ offset ++ ]
            face.materialIndex = materialIndex

          }

          // to get face <=> uv index correspondence

          fi = geometry.faces.length

          if (hasFaceVertexUv)

            for (i = 0; i < nUvLayers; i ++) {

              uvLayer = json.uvs[ i ]

              geometry.faceVertexUvs[ i ][ fi ] = []

              for (j = 0; j < 3; j ++) {

                uvIndex = faces[ offset ++ ]

                u = uvLayer[ uvIndex * 2 ]
                v = uvLayer[ uvIndex * 2 + 1 ]

                uv = new THREE.Vector2(u, v)

                geometry.faceVertexUvs[ i ][ fi ].push(uv)

              }

            }

          if (hasFaceNormal) {

            normalIndex = faces[ offset ++ ] * 3

            face.normal.set(
              normals[ normalIndex ++ ],
              normals[ normalIndex ++ ],
              normals[ normalIndex ]
            )

          }

          if (hasFaceVertexNormal)

            for (i = 0; i < 3; i ++) {

              normalIndex = faces[ offset ++ ] * 3

              normal = new THREE.Vector3(
                normals[ normalIndex ++ ],
                normals[ normalIndex ++ ],
                normals[ normalIndex ]
              )

              face.vertexNormals.push(normal)

            }

          if (hasFaceColor) {

            colorIndex = faces[ offset ++ ]
            face.color.setHex(colors[ colorIndex ])

          }

          if (hasFaceVertexColor)

            for (i = 0; i < 3; i ++) {

              colorIndex = faces[ offset ++ ]
              face.vertexColors.push(new THREE.Color(colors[ colorIndex ]))

            }

          geometry.faces.push(face)

        }

      }

    }

    function parseSkin(json, geometry) {

      const influencesPerVertex = (json.influencesPerVertex !== undefined) ? json.influencesPerVertex : 2

      if (json.skinWeights)

        for (var i = 0, l = json.skinWeights.length; i < l; i += influencesPerVertex) {

          const x = json.skinWeights[ i ]
          const y = (influencesPerVertex > 1) ? json.skinWeights[ i + 1 ] : 0
          const z = (influencesPerVertex > 2) ? json.skinWeights[ i + 2 ] : 0
          const w = (influencesPerVertex > 3) ? json.skinWeights[ i + 3 ] : 0

          geometry.skinWeights.push(new THREE.Vector4(x, y, z, w))

        }

      if (json.skinIndices)

        for (var i = 0, l = json.skinIndices.length; i < l; i += influencesPerVertex) {

          const a = json.skinIndices[ i ]
          const b = (influencesPerVertex > 1) ? json.skinIndices[ i + 1 ] : 0
          const c = (influencesPerVertex > 2) ? json.skinIndices[ i + 2 ] : 0
          const d = (influencesPerVertex > 3) ? json.skinIndices[ i + 3 ] : 0

          geometry.skinIndices.push(new THREE.Vector4(a, b, c, d))

        }

      geometry.bones = json.bones

      if (geometry.bones && geometry.bones.length > 0 && (geometry.skinWeights.length !== geometry.skinIndices.length || geometry.skinIndices.length !== geometry.vertices.length))

        console.warn('When skinning, number of vertices (' + geometry.vertices.length + '), skinIndices (' +
						geometry.skinIndices.length + '), and skinWeights (' + geometry.skinWeights.length + ') should match.')

    }

    function parseMorphing(json, geometry) {

      const {scale} = json

      if (json.morphTargets !== undefined)

        for (var i = 0, l = json.morphTargets.length; i < l; i ++) {

          geometry.morphTargets[ i ] = {}
          geometry.morphTargets[ i ].name = json.morphTargets[ i ].name
          geometry.morphTargets[ i ].vertices = []

          const dstVertices = geometry.morphTargets[ i ].vertices
          const srcVertices = json.morphTargets[ i ].vertices

          for (let v = 0, vl = srcVertices.length; v < vl; v += 3) {

            const vertex = new THREE.Vector3()
            vertex.x = srcVertices[ v ] * scale
            vertex.y = srcVertices[ v + 1 ] * scale
            vertex.z = srcVertices[ v + 2 ] * scale

            dstVertices.push(vertex)

          }

        }

      if (json.morphColors !== undefined && json.morphColors.length > 0) {

        console.warn('THREE.JSONLoader: "morphColors" no longer supported. Using them as face colors.')

        const {faces} = geometry
        const morphColors = json.morphColors[ 0 ].colors

        for (var i = 0, l = faces.length; i < l; i ++)

          faces[ i ].color.fromArray(morphColors, i * 3)

      }

    }

    function parseAnimations(json, geometry) {

      let outputAnimations = []

      // parse old style Bone/Hierarchy animations
      let animations = []

      if (json.animation !== undefined)

        animations.push(json.animation)

      if (json.animations !== undefined)

        if (json.animations.length) {

          animations = animations.concat(json.animations)

        } else {

          animations.push(json.animations)

        }

      for (let i = 0; i < animations.length; i ++) {

        const clip = THREE.AnimationClip.parseAnimation(animations[ i ], geometry.bones)
        if (clip) outputAnimations.push(clip)

      }

      // parse implicit morph animations
      if (geometry.morphTargets) {

        // TODO: Figure out what an appropraite FPS is for morph target animations -- defaulting to 10, but really it is completely arbitrary.
        const morphAnimationClips = THREE.AnimationClip.CreateClipsFromMorphTargetSequences(geometry.morphTargets, 10)
        outputAnimations = outputAnimations.concat(morphAnimationClips)

      }

      if (outputAnimations.length > 0) geometry.animations = outputAnimations

    }

    return function parse(json, path) {

      if (json.data !== undefined)

      // Geometry 4.0 spec
        json = json.data

      if (json.scale !== undefined)

        json.scale = 1.0 / json.scale

				 else

        json.scale = 1.0

      const geometry = new THREE.Geometry()

      parseModel(json, geometry)
      parseSkin(json, geometry)
      parseMorphing(json, geometry)
      parseAnimations(json, geometry)

      geometry.computeFaceNormals()
      geometry.computeBoundingSphere()

      if (json.materials === undefined || json.materials.length === 0)

        return { geometry }

      const materials = initMaterials(json.materials, this.resourcePath || path, this.crossOrigin)

      return { geometry, materials }

    }

  })()

})
