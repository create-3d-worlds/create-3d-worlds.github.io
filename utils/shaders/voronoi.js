// Created by Inigo Quilez http://www.iquilezles.org/www/articles/voronoilines/voronoilines.htm
// Altered for a Three.js by Chris Brown - blog.2pha.com
import * as THREE from 'three'

export const vertexShader = /* glsl */`
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }
`

export const fragmentShader = /* glsl */`
  varying vec2 vUv;

  uniform vec3 color;
  uniform vec3 borderColor;
  uniform float borderWidth;
  uniform float size;

  vec2 hash2( vec2 p )
  {
    // procedural white noise
    return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
  }

  vec3 voronoi( in vec2 x )
  {
      vec2 n = floor(x);
      vec2 f = fract(x);

      //----------------------------------
      // first pass: regular voronoi
      //----------------------------------
      vec2 mg, mr;

      float md = 8.0;
      for(int j=-1; j<=1; j++ )
        for(int i=-1; i<=1; i++ )
        {
            vec2 g = vec2(float(i),float(j));
            vec2 o = hash2( n + g );
            vec2 r = g + o - f;
            float d = dot(r,r);

            if( d<md )
            {
                md = d;
                mr = r;
                mg = g;
            }
        }

      //----------------------------------
      // second pass: distance to borders
      //----------------------------------
      md = 8.0;
      for( int j=-2; j<=2; j++ )
        for( int i=-2; i<=2; i++ )
        {
            vec2 g = mg + vec2(float(i),float(j));
            vec2 o = hash2( n + g );
            vec2 r = g + o - f;

            if( dot(mr-r,mr-r)>0.00001 )
            md = min( md, dot( 0.5*(mr+r), normalize(r-mr) ) );
        }

      return vec3( md, mr );
  }

  void main() {
    vec3 c = voronoi( 8.0*(vUv*vec2(size)) );
    vec3 col = mix( borderColor, color, smoothstep(borderWidth/100.0, (borderWidth/100.0), c.x ) );

    gl_FragColor = vec4(col, 1.0);
  }
`

const uniforms = {
  size: { type: 'f', value: 1.0 },
  color: { type: 'c', value: new THREE.Color(0xFFC00F) },
  borderColor: { type: 'c', value: new THREE.Color(0x000000) },
  borderWidth: { type: 'f', value: 10.0 },
}

export const material = new THREE.ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader
})
