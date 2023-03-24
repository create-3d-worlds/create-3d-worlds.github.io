/**
 * chroma.js - JavaScript library for color conversions
 *
 * Copyright (c) 2011-2019, Gregor Aisch
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. The name Gregor Aisch may not be used to endorse or promote products
 * derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL GREGOR AISCH OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * -------------------------------------------------------
 *
 * chroma.js includes colors from colorbrewer2.org, which are released under
 * the following license:
 *
 * Copyright (c) 2002 Cynthia Brewer, Mark Harrower,
 * and The Pennsylvania State University.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 *
 * ------------------------------------------------------
 *
 * Named colors are taken from X11 Color Names.
 * http://www.w3.org/TR/css3-color/#svg-color
 *
 * @preserve
 */
const limit = function(x, min, max) {
  if (min === void 0) min = 0
  if (max === void 0) max = 1

  return x < min ? min : x > max ? max : x
}

const clip_rgb = function(rgb) {
  rgb._clipped = false
  rgb._unclipped = rgb.slice(0)
  for (let i = 0; i <= 3; i++)
    if (i < 3) {
      if (rgb[i] < 0 || rgb[i] > 255)  rgb._clipped = true
      rgb[i] = limit(rgb[i], 0, 255)
    } else if (i === 3)
      rgb[i] = limit(rgb[i], 0, 1)

  return rgb
}

// ported from jQuery's $.type
const classToType = {}
for (let i = 0, list = ['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Undefined', 'Null']; i < list.length; i += 1) {
  const name = list[i]

  classToType[('[object ' + name + ']')] = name.toLowerCase()
}
const type = function(obj) {
  return classToType[Object.prototype.toString.call(obj)] || 'object'
}

const unpack = function(args, keyOrder) {
  if (keyOrder === void 0) keyOrder = null

  // if called with more than 3 arguments, we return the arguments
  if (args.length >= 3)  return Array.prototype.slice.call(args)
  // with less than 3 args we check if first arg is object
  // and use the keyOrder string to extract and sort properties
  if (type(args[0]) == 'object' && keyOrder)
    return keyOrder.split('')
      .filter(k => args[0][k] !== undefined)
      .map(k => args[0][k])

  // otherwise we just return the first argument
  // (which we suppose is an array of args)
  return args[0]
}

const last = function(args) {
  if (args.length < 2)  return null
  const l = args.length - 1
  if (type(args[l]) == 'string')  return args[l].toLowerCase()
  return null
}

const { PI } = Math

const utils = {
  clip_rgb,
  limit,
  type,
  unpack,
  last,
  PI,
  TWOPI: PI * 2,
  PITHIRD: PI / 3,
  DEG2RAD: PI / 180,
  RAD2DEG: 180 / PI
}

const input = {
  format: {},
  autodetect: []
}

const last$1 = utils.last
const clip_rgb$1 = utils.clip_rgb
const type$1 = utils.type

const Color = function Color() {
  let args = [], len = arguments.length
  while (len--) args[ len ] = arguments[ len ]

  const me = this
  if (type$1(args[0]) === 'object' &&
      args[0].constructor &&
      args[0].constructor === this.constructor)
  // the argument is already a Color instance
    return args[0]

  // last argument could be the mode
  let mode = last$1(args)
  let autodetect = false

  if (!mode) {
    autodetect = true
    if (!input.sorted) {
      input.autodetect = input.autodetect.sort((a, b) => b.p - a.p)
      input.sorted = true
    }
    // auto-detect format
    for (let i = 0, list = input.autodetect; i < list.length; i += 1) {
      const chk = list[i]

      mode = chk.test.apply(chk, args)
      if (mode)  break
    }
  }

  if (input.format[mode]) {
    const rgb = input.format[mode].apply(null, autodetect ? args : args.slice(0, -1))
    me._rgb = clip_rgb$1(rgb)
  } else
    throw new Error('unknown format: ' + args)

  // add alpha channel
  if (me._rgb.length === 3)  me._rgb.push(1)
}

Color.prototype.toString = function toString() {
  if (type$1(this.hex) == 'function')  return this.hex()
  return ('[' + (this._rgb.join(',')) + ']')
}

const Color_1 = Color

var chroma = function() {
  let args = [], len = arguments.length
  while (len--) args[ len ] = arguments[ len ]

  return new (Function.prototype.bind.apply(chroma.Color, [ null ].concat(args)))
}

chroma.Color = Color_1
chroma.version = '2.0.3'

const chroma_1 = chroma

const unpack$1 = utils.unpack
const { max } = Math

const rgb2cmyk = function() {
  let args = [], len = arguments.length
  while (len--) args[ len ] = arguments[ len ]

  const ref = unpack$1(args, 'rgb')
  let r = ref[0]
  let g = ref[1]
  let b = ref[2]
  r /= 255
  g /= 255
  b /= 255
  const k = 1 - max(r, max(g, b))
  const f = k < 1 ? 1 / (1 - k) : 0
  const c = (1 - r - k) * f
  const m = (1 - g - k) * f
  const y = (1 - b - k) * f
  return [c, m, y, k]
}

const rgb2cmyk_1 = rgb2cmyk

const unpack$2 = utils.unpack

const cmyk2rgb = function() {
  let args = [], len = arguments.length
  while (len--) args[ len ] = arguments[ len ]

  args = unpack$2(args, 'cmyk')
  const c = args[0]
  const m = args[1]
  const y = args[2]
  const k = args[3]
  const alpha = args.length > 4 ? args[4] : 1
  if (k === 1)  return [0, 0, 0, alpha]
  return [
    c >= 1 ? 0 : 255 * (1 - c) * (1 - k), // r
    m >= 1 ? 0 : 255 * (1 - m) * (1 - k), // g
    y >= 1 ? 0 : 255 * (1 - y) * (1 - k), // b
    alpha
  ]
}

const cmyk2rgb_1 = cmyk2rgb

const unpack$3 = utils.unpack
const type$2 = utils.type

Color_1.prototype.cmyk = function() {
  return rgb2cmyk_1(this._rgb)
}

chroma_1.cmyk = function() {
  let args = [], len = arguments.length
  while (len--) args[ len ] = arguments[ len ]

  return new (Function.prototype.bind.apply(Color_1, [ null ].concat(args, ['cmyk'])))
}

input.format.cmyk = cmyk2rgb_1

input.autodetect.push({
  p: 2,
  test() {
    let args = [], len = arguments.length
    while (len--) args[ len ] = arguments[ len ]

    args = unpack$3(args, 'cmyk')
    if (type$2(args) === 'array' && args.length === 4)
      return 'cmyk'

  }
})

const unpack$4 = utils.unpack
const last$2 = utils.last
const rnd = function(a) { return Math.round(a * 100) / 100 }

/*
* supported arguments:
* - hsl2css(h,s,l)
* - hsl2css(h,s,l,a)
* - hsl2css([h,s,l], mode)
* - hsl2css([h,s,l,a], mode)
* - hsl2css({h,s,l,a}, mode)
*/
const hsl2css = function() {
  let args = [], len = arguments.length
  while (len--) args[ len ] = arguments[ len ]

  const hsla = unpack$4(args, 'hsla')
  let mode = last$2(args) || 'lsa'
  hsla[0] = rnd(hsla[0] || 0)
  hsla[1] = rnd(hsla[1] * 100) + '%'
  hsla[2] = rnd(hsla[2] * 100) + '%'
  if (mode === 'hsla' || (hsla.length > 3 && hsla[3] < 1)) {
    hsla[3] = hsla.length > 3 ? hsla[3] : 1
    mode = 'hsla'
  } else
    hsla.length = 3

  return (mode + '(' + (hsla.join(',')) + ')')
}

const hsl2css_1 = hsl2css

const unpack$5 = utils.unpack

/*
* supported arguments:
* - rgb2hsl(r,g,b)
* - rgb2hsl(r,g,b,a)
* - rgb2hsl([r,g,b])
* - rgb2hsl([r,g,b,a])
* - rgb2hsl({r,g,b,a})
*/
const rgb2hsl = function() {
  let args = [], len = arguments.length
  while (len--) args[ len ] = arguments[ len ]

  args = unpack$5(args, 'rgba')
  let r = args[0]
  let g = args[1]
  let b = args[2]

  r /= 255
  g /= 255
  b /= 255

  const min = Math.min(r, g, b)
  const max = Math.max(r, g, b)

  const l = (max + min) / 2
  let s, h

  if (max === min) {
    s = 0
    h = Number.NaN
  } else
    s = l < 0.5 ? (max - min) / (max + min) : (max - min) / (2 - max - min)

  if (r == max)  h = (g - b) / (max - min)
  else if (g == max)  h = 2 + (b - r) / (max - min)
  else if (b == max)  h = 4 + (r - g) / (max - min)

  h *= 60
  if (h < 0)  h += 360
  if (args.length > 3 && args[3] !== undefined)  return [h, s, l, args[3]]
  return [h, s, l]
}

const rgb2hsl_1 = rgb2hsl

const unpack$6 = utils.unpack
const last$3 = utils.last

const { round } = Math

/*
* supported arguments:
* - rgb2css(r,g,b)
* - rgb2css(r,g,b,a)
* - rgb2css([r,g,b], mode)
* - rgb2css([r,g,b,a], mode)
* - rgb2css({r,g,b,a}, mode)
*/
const rgb2css = function() {
  let args = [], len = arguments.length
  while (len--) args[ len ] = arguments[ len ]

  const rgba = unpack$6(args, 'rgba')
  let mode = last$3(args) || 'rgb'
  if (mode.substr(0, 3) == 'hsl')
    return hsl2css_1(rgb2hsl_1(rgba), mode)

  rgba[0] = round(rgba[0])
  rgba[1] = round(rgba[1])
  rgba[2] = round(rgba[2])
  if (mode === 'rgba' || (rgba.length > 3 && rgba[3] < 1)) {
    rgba[3] = rgba.length > 3 ? rgba[3] : 1
    mode = 'rgba'
  }
  return (mode + '(' + (rgba.slice(0, mode === 'rgb' ? 3 : 4).join(',')) + ')')
}

const rgb2css_1 = rgb2css

const unpack$7 = utils.unpack
const round$1 = Math.round

const hsl2rgb = function() {
  let assign

  let args = [], len = arguments.length
  while (len--) args[ len ] = arguments[ len ]
  args = unpack$7(args, 'hsl')
  const h = args[0]
  const s = args[1]
  const l = args[2]
  let r, g, b
  if (s === 0)
    r = g = b = l * 255
  else {
    const t3 = [0, 0, 0]
    const c = [0, 0, 0]
    const t2 = l < 0.5 ? l * (1 + s) : l + s - l * s
    const t1 = 2 * l - t2
    const h_ = h / 360
    t3[0] = h_ + 1 / 3
    t3[1] = h_
    t3[2] = h_ - 1 / 3
    for (let i = 0; i < 3; i++) {
      if (t3[i] < 0)  t3[i] += 1
      if (t3[i] > 1)  t3[i] -= 1
      if (6 * t3[i] < 1)
        c[i] = t1 + (t2 - t1) * 6 * t3[i]
      else if (2 * t3[i] < 1)
        c[i] = t2
      else if (3 * t3[i] < 2)
        c[i] = t1 + (t2 - t1) * ((2 / 3) - t3[i]) * 6
      else
        c[i] = t1
    }
    (assign = [round$1(c[0] * 255), round$1(c[1] * 255), round$1(c[2] * 255)], r = assign[0], g = assign[1], b = assign[2])
  }
  if (args.length > 3)
  // keep alpha channel
    return [r, g, b, args[3]]

  return [r, g, b, 1]
}

const hsl2rgb_1 = hsl2rgb

const RE_RGB = /^rgb\(\s*(-?\d+),\s*(-?\d+)\s*,\s*(-?\d+)\s*\)$/
const RE_RGBA = /^rgba\(\s*(-?\d+),\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*([01]|[01]?\.\d+)\)$/
const RE_RGB_PCT = /^rgb\(\s*(-?\d+(?:\.\d+)?)%,\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*\)$/
const RE_RGBA_PCT = /^rgba\(\s*(-?\d+(?:\.\d+)?)%,\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)$/
const RE_HSL = /^hsl\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*\)$/
const RE_HSLA = /^hsla\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)$/

const round$2 = Math.round

const css2rgb = function(css) {
  css = css.toLowerCase().trim()
  let m

  if (input.format.named)
    try {
      return input.format.named(css)
    } catch (e) {}

  // rgb(250,20,0)
  if ((m = css.match(RE_RGB))) {
    const rgb = m.slice(1, 4)
    for (let i = 0; i < 3; i++)
      rgb[i] = +rgb[i]

    rgb[3] = 1  // default alpha
    return rgb
  }

  // rgba(250,20,0,0.4)
  if ((m = css.match(RE_RGBA))) {
    const rgb$1 = m.slice(1, 5)
    for (let i$1 = 0; i$1 < 4; i$1++)
      rgb$1[i$1] = +rgb$1[i$1]

    return rgb$1
  }

  // rgb(100%,0%,0%)
  if ((m = css.match(RE_RGB_PCT))) {
    const rgb$2 = m.slice(1, 4)
    for (let i$2 = 0; i$2 < 3; i$2++)
      rgb$2[i$2] = round$2(rgb$2[i$2] * 2.55)

    rgb$2[3] = 1  // default alpha
    return rgb$2
  }

  // rgba(100%,0%,0%,0.4)
  if ((m = css.match(RE_RGBA_PCT))) {
    const rgb$3 = m.slice(1, 5)
    for (let i$3 = 0; i$3 < 3; i$3++)
      rgb$3[i$3] = round$2(rgb$3[i$3] * 2.55)

    rgb$3[3] = +rgb$3[3]
    return rgb$3
  }

  // hsl(0,100%,50%)
  if ((m = css.match(RE_HSL))) {
    const hsl = m.slice(1, 4)
    hsl[1] *= 0.01
    hsl[2] *= 0.01
    const rgb$4 = hsl2rgb_1(hsl)
    rgb$4[3] = 1
    return rgb$4
  }

  // hsla(0,100%,50%,0.5)
  if ((m = css.match(RE_HSLA))) {
    const hsl$1 = m.slice(1, 4)
    hsl$1[1] *= 0.01
    hsl$1[2] *= 0.01
    const rgb$5 = hsl2rgb_1(hsl$1)
    rgb$5[3] = +m[4]  // default alpha = 1
    return rgb$5
  }
}

css2rgb.test = function(s) {
  return RE_RGB.test(s) ||
      RE_RGBA.test(s) ||
      RE_RGB_PCT.test(s) ||
      RE_RGBA_PCT.test(s) ||
      RE_HSL.test(s) ||
      RE_HSLA.test(s)
}

const css2rgb_1 = css2rgb

const type$3 = utils.type

Color_1.prototype.css = function(mode) {
  return rgb2css_1(this._rgb, mode)
}

chroma_1.css = function() {
  let args = [], len = arguments.length
  while (len--) args[ len ] = arguments[ len ]

  return new (Function.prototype.bind.apply(Color_1, [ null ].concat(args, ['css'])))
}

input.format.css = css2rgb_1

input.autodetect.push({
  p: 5,
  test(h) {
    let rest = [], len = arguments.length - 1
    while (len-- > 0) rest[ len ] = arguments[ len + 1 ]

    if (!rest.length && type$3(h) === 'string' && css2rgb_1.test(h))
      return 'css'

  }
})

const unpack$8 = utils.unpack

input.format.gl = function() {
  let args = [], len = arguments.length
  while (len--) args[ len ] = arguments[ len ]

  const rgb = unpack$8(args, 'rgba')
  rgb[0] *= 255
  rgb[1] *= 255
  rgb[2] *= 255
  return rgb
}

chroma_1.gl = function() {
  let args = [], len = arguments.length
  while (len--) args[ len ] = arguments[ len ]

  return new (Function.prototype.bind.apply(Color_1, [ null ].concat(args, ['gl'])))
}

Color_1.prototype.gl = function() {
  const rgb = this._rgb
  return [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255, rgb[3]]
}

const unpack$9 = utils.unpack

const rgb2hcg = function() {
  let args = [], len = arguments.length
  while (len--) args[ len ] = arguments[ len ]

  const ref = unpack$9(args, 'rgb')
  const r = ref[0]
  const g = ref[1]
  const b = ref[2]
  const min = Math.min(r, g, b)
  const max = Math.max(r, g, b)
  const delta = max - min
  const c = delta * 100 / 255
  const _g = min / (255 - delta) * 100
  let h
  if (delta === 0)
    h = Number.NaN
  else {
    if (r === max)  h = (g - b) / delta
    if (g === max)  h = 2 + (b - r) / delta
    if (b === max)  h = 4 + (r - g) / delta
    h *= 60
    if (h < 0)  h += 360
  }
  return [h, c, _g]
}

const rgb2hcg_1 = rgb2hcg

const unpack$a = utils.unpack
const { floor } = Math

/*
* this is basically just HSV with some minor tweaks
*
* hue.. [0..360]
* chroma .. [0..1]
* grayness .. [0..1]
*/

const hcg2rgb = function() {
  let assign, assign$1, assign$2, assign$3, assign$4, assign$5

  let args = [], len = arguments.length
  while (len--) args[ len ] = arguments[ len ]
  args = unpack$a(args, 'hcg')
  let h = args[0]
  const c = args[1]
  let _g = args[2]
  let r, g, b
  _g *= 255
  const _c = c * 255
  if (c === 0)
    r = g = b = _g
  else {
    if (h === 360)  h = 0
    if (h > 360)  h -= 360
    if (h < 0)  h += 360
    h /= 60
    const i = floor(h)
    const f = h - i
    const p = _g * (1 - c)
    const q = p + _c * (1 - f)
    const t = p + _c * f
    const v = p + _c
    switch (i) {
      case 0: (assign = [v, t, p], r = assign[0], g = assign[1], b = assign[2]); break
      case 1: (assign$1 = [q, v, p], r = assign$1[0], g = assign$1[1], b = assign$1[2]); break
      case 2: (assign$2 = [p, v, t], r = assign$2[0], g = assign$2[1], b = assign$2[2]); break
      case 3: (assign$3 = [p, q, v], r = assign$3[0], g = assign$3[1], b = assign$3[2]); break
      case 4: (assign$4 = [t, p, v], r = assign$4[0], g = assign$4[1], b = assign$4[2]); break
      case 5: (assign$5 = [v, p, q], r = assign$5[0], g = assign$5[1], b = assign$5[2]); break
    }
  }
  return [r, g, b, args.length > 3 ? args[3] : 1]
}

const hcg2rgb_1 = hcg2rgb

const unpack$b = utils.unpack
const type$4 = utils.type

Color_1.prototype.hcg = function() {
  return rgb2hcg_1(this._rgb)
}

chroma_1.hcg = function() {
  let args = [], len = arguments.length
  while (len--) args[ len ] = arguments[ len ]

  return new (Function.prototype.bind.apply(Color_1, [ null ].concat(args, ['hcg'])))
}

input.format.hcg = hcg2rgb_1

input.autodetect.push({
  p: 1,
  test() {
    let args = [], len = arguments.length
    while (len--) args[ len ] = arguments[ len ]

    args = unpack$b(args, 'hcg')
    if (type$4(args) === 'array' && args.length === 3)
      return 'hcg'

  }
})

const unpack$c = utils.unpack
const last$4 = utils.last
const round$3 = Math.round

const rgb2hex = function() {
  let args = [], len = arguments.length
  while (len--) args[ len ] = arguments[ len ]

  const ref = unpack$c(args, 'rgba')
  let r = ref[0]
  let g = ref[1]
  let b = ref[2]
  let a = ref[3]
  let mode = last$4(args) || 'auto'
  if (a === undefined)  a = 1
  if (mode === 'auto')
    mode = a < 1 ? 'rgba' : 'rgb'

  r = round$3(r)
  g = round$3(g)
  b = round$3(b)
  const u = r << 16 | g << 8 | b
  let str = '000000' + u.toString(16) // #.toUpperCase();
  str = str.substr(str.length - 6)
  let hxa = '0' + round$3(a * 255).toString(16)
  hxa = hxa.substr(hxa.length - 2)
  switch (mode.toLowerCase()) {
    case 'rgba': return ('#' + str + hxa)
    case 'argb': return ('#' + hxa + str)
    default: return ('#' + str)
  }
}

const rgb2hex_1 = rgb2hex

const RE_HEX = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
const RE_HEXA = /^#?([A-Fa-f0-9]{8})$/

const hex2rgb = function(hex) {
  if (hex.match(RE_HEX)) {
    // remove optional leading #
    if (hex.length === 4 || hex.length === 7)
      hex = hex.substr(1)

    // expand short-notation to full six-digit
    if (hex.length === 3) {
      hex = hex.split('')
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
    }
    const u = parseInt(hex, 16)
    const r = u >> 16
    const g = u >> 8 & 0xFF
    const b = u & 0xFF
    return [r, g, b, 1]
  }

  // match rgba hex format, eg #FF000077
  if (hex.match(RE_HEXA)) {
    if (hex.length === 9)
    // remove optional leading #
      hex = hex.substr(1)

    const u$1 = parseInt(hex, 16)
    const r$1 = u$1 >> 24 & 0xFF
    const g$1 = u$1 >> 16 & 0xFF
    const b$1 = u$1 >> 8 & 0xFF
    const a = Math.round((u$1 & 0xFF) / 0xFF * 100) / 100
    return [r$1, g$1, b$1, a]
  }

  // we used to check for css colors here
  // if _input.css? and rgb = _input.css hex
  //     return rgb

  throw new Error(('unknown hex color: ' + hex))
}

const hex2rgb_1 = hex2rgb

const type$5 = utils.type

Color_1.prototype.hex = function(mode) {
  return rgb2hex_1(this._rgb, mode)
}

chroma_1.hex = function() {
  let args = [], len = arguments.length
  while (len--) args[ len ] = arguments[ len ]

  return new (Function.prototype.bind.apply(Color_1, [ null ].concat(args, ['hex'])))
}

input.format.hex = hex2rgb_1
input.autodetect.push({
  p: 4,
  test(h) {
    let rest = [], len = arguments.length - 1
    while (len-- > 0) rest[ len ] = arguments[ len + 1 ]

    if (!rest.length && type$5(h) === 'string' && [3, 4, 6, 7, 8, 9].includes(h.length))
      return 'hex'

  }
})

const unpack$d = utils.unpack
const { TWOPI } = utils
const { min } = Math
const { sqrt } = Math
const { acos } = Math

const rgb2hsi = function() {
  let args = [], len = arguments.length
  while (len--) args[ len ] = arguments[ len ]

  /*
  borrowed from here:
  http://hummer.stanford.edu/museinfo/doc/examples/humdrum/keyscape2/rgb2hsi.cpp
  */
  const ref = unpack$d(args, 'rgb')
  let r = ref[0]
  let g = ref[1]
  let b = ref[2]
  r /= 255
  g /= 255
  b /= 255
  let h
  const min_ = min(r, g, b)
  const i = (r + g + b) / 3
  const s = i > 0 ? 1 - min_ / i : 0
  if (s === 0)
    h = NaN
  else {
    h = ((r - g) + (r - b)) / 2
    h /= sqrt((r - g) * (r - g) + (r - b) * (g - b))
    h = acos(h)
    if (b > g)
      h = TWOPI - h

    h /= TWOPI
  }
  return [h * 360, s, i]
}

const rgb2hsi_1 = rgb2hsi

const unpack$e = utils.unpack
const limit$1 = utils.limit
const TWOPI$1 = utils.TWOPI
const { PITHIRD } = utils
const { cos } = Math

/*
* hue [0..360]
* saturation [0..1]
* intensity [0..1]
*/
const hsi2rgb = function() {
  let args = [], len = arguments.length
  while (len--) args[ len ] = arguments[ len ]

  /*
  borrowed from here:
  http://hummer.stanford.edu/museinfo/doc/examples/humdrum/keyscape2/hsi2rgb.cpp
  */
  args = unpack$e(args, 'hsi')
  let h = args[0]
  let s = args[1]
  const i = args[2]
  let r, g, b

  if (isNaN(h))  h = 0
  if (isNaN(s))  s = 0
  // normalize hue
  if (h > 360)  h -= 360
  if (h < 0)  h += 360
  h /= 360
  if (h < 1 / 3) {
    b = (1 - s) / 3
    r = (1 + s * cos(TWOPI$1 * h) / cos(PITHIRD - TWOPI$1 * h)) / 3
    g = 1 - (b + r)
  } else if (h < 2 / 3) {
    h -= 1 / 3
    r = (1 - s) / 3
    g = (1 + s * cos(TWOPI$1 * h) / cos(PITHIRD - TWOPI$1 * h)) / 3
    b = 1 - (r + g)
  } else {
    h -= 2 / 3
    g = (1 - s) / 3
    b = (1 + s * cos(TWOPI$1 * h) / cos(PITHIRD - TWOPI$1 * h)) / 3
    r = 1 - (g + b)
  }
  r = limit$1(i * r * 3)
  g = limit$1(i * g * 3)
  b = limit$1(i * b * 3)
  return [r * 255, g * 255, b * 255, args.length > 3 ? args[3] : 1]
}

const hsi2rgb_1 = hsi2rgb

const unpack$f = utils.unpack
const type$6 = utils.type

Color_1.prototype.hsi = function() {
  return rgb2hsi_1(this._rgb)
}

chroma_1.hsi = function() {
  let args = [], len = arguments.length
  while (len--) args[ len ] = arguments[ len ]

  return new (Function.prototype.bind.apply(Color_1, [ null ].concat(args, ['hsi'])))
}

input.format.hsi = hsi2rgb_1

input.autodetect.push({
  p: 2,
  test() {
    let args = [], len = arguments.length
    while (len--) args[ len ] = arguments[ len ]

    args = unpack$f(args, 'hsi')
    if (type$6(args) === 'array' && args.length === 3)
      return 'hsi'

  }
})

const unpack$g = utils.unpack
const type$7 = utils.type

Color_1.prototype.hsl = function() {
  return rgb2hsl_1(this._rgb)
}

chroma_1.hsl = function() {
  let args = [], len = arguments.length
  while (len--) args[ len ] = arguments[ len ]

  return new (Function.prototype.bind.apply(Color_1, [ null ].concat(args, ['hsl'])))
}

input.format.hsl = hsl2rgb_1

input.autodetect.push({
  p: 2,
  test() {
    let args = [], len = arguments.length
    while (len--) args[ len ] = arguments[ len ]

    args = unpack$g(args, 'hsl')
    if (type$7(args) === 'array' && args.length === 3)
      return 'hsl'

  }
})

const unpack$h = utils.unpack
const min$1 = Math.min
const max$1 = Math.max

/*
* supported arguments:
* - rgb2hsv(r,g,b)
* - rgb2hsv([r,g,b])
* - rgb2hsv({r,g,b})
*/
const rgb2hsl$1 = function() {
  let args = [], len = arguments.length
  while (len--) args[ len ] = arguments[ len ]

  args = unpack$h(args, 'rgb')
  const r = args[0]
  const g = args[1]
  const b = args[2]
  const min_ = min$1(r, g, b)
  const max_ = max$1(r, g, b)
  const delta = max_ - min_
  let h, s, v
  v = max_ / 255.0
  if (max_ === 0) {
    h = Number.NaN
    s = 0
  } else {
    s = delta / max_
    if (r === max_)  h = (g - b) / delta
    if (g === max_)  h = 2 + (b - r) / delta
    if (b === max_)  h = 4 + (r - g) / delta
    h *= 60
    if (h < 0)  h += 360
  }
  return [h, s, v]
}

const rgb2hsv = rgb2hsl$1

const unpack$i = utils.unpack
const floor$1 = Math.floor

const hsv2rgb = function() {
  let assign, assign$1, assign$2, assign$3, assign$4, assign$5

  let args = [], len = arguments.length
  while (len--) args[ len ] = arguments[ len ]
  args = unpack$i(args, 'hsv')
  let h = args[0]
  const s = args[1]
  let v = args[2]
  let r, g, b
  v *= 255
  if (s === 0)
    r = g = b = v
  else {
    if (h === 360)  h = 0
    if (h > 360)  h -= 360
    if (h < 0)  h += 360
    h /= 60

    const i = floor$1(h)
    const f = h - i
    const p = v * (1 - s)
    const q = v * (1 - s * f)
    const t = v * (1 - s * (1 - f))

    switch (i) {
      case 0: (assign = [v, t, p], r = assign[0], g = assign[1], b = assign[2]); break
      case 1: (assign$1 = [q, v, p], r = assign$1[0], g = assign$1[1], b = assign$1[2]); break
      case 2: (assign$2 = [p, v, t], r = assign$2[0], g = assign$2[1], b = assign$2[2]); break
      case 3: (assign$3 = [p, q, v], r = assign$3[0], g = assign$3[1], b = assign$3[2]); break
      case 4: (assign$4 = [t, p, v], r = assign$4[0], g = assign$4[1], b = assign$4[2]); break
      case 5: (assign$5 = [v, p, q], r = assign$5[0], g = assign$5[1], b = assign$5[2]); break
    }
  }
  return [r, g, b, args.length > 3 ? args[3] : 1]
}

const hsv2rgb_1 = hsv2rgb

const unpack$j = utils.unpack
const type$8 = utils.type

Color_1.prototype.hsv = function() {
  return rgb2hsv(this._rgb)
}

chroma_1.hsv = function() {
  let args = [], len = arguments.length
  while (len--) args[ len ] = arguments[ len ]

  return new (Function.prototype.bind.apply(Color_1, [ null ].concat(args, ['hsv'])))
}

input.format.hsv = hsv2rgb_1

input.autodetect.push({
  p: 2,
  test() {
    let args = [], len = arguments.length
    while (len--) args[ len ] = arguments[ len ]

    args = unpack$j(args, 'hsv')
    if (type$8(args) === 'array' && args.length === 3)
      return 'hsv'

  }
})

const labConstants = {
  // Corresponds roughly to RGB brighter/darker
  Kn: 18,

  // D65 standard referent
  Xn: 0.950470,
  Yn: 1,
  Zn: 1.088830,

  t0: 0.137931034,  // 4 / 29
  t1: 0.206896552,  // 6 / 29
  t2: 0.12841855,   // 3 * t1 * t1
  t3: 0.008856452,  // t1 * t1 * t1
}

const unpack$k = utils.unpack
const { pow } = Math

const rgb2lab = function() {
  let args = [], len = arguments.length
  while (len--) args[ len ] = arguments[ len ]

  const ref = unpack$k(args, 'rgb')
  const r = ref[0]
  const g = ref[1]
  const b = ref[2]
  const ref$1 = rgb2xyz(r, g, b)
  const x = ref$1[0]
  const y = ref$1[1]
  const z = ref$1[2]
  const l = 116 * y - 16
  return [l < 0 ? 0 : l, 500 * (x - y), 200 * (y - z)]
}

const rgb_xyz = function(r) {
  if ((r /= 255) <= 0.04045)  return r / 12.92
  return pow((r + 0.055) / 1.055, 2.4)
}

const xyz_lab = function(t) {
  if (t > labConstants.t3)  return pow(t, 1 / 3)
  return t / labConstants.t2 + labConstants.t0
}

var rgb2xyz = function(r, g, b) {
  r = rgb_xyz(r)
  g = rgb_xyz(g)
  b = rgb_xyz(b)
  const x = xyz_lab((0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / labConstants.Xn)
  const y = xyz_lab((0.2126729 * r + 0.7151522 * g + 0.0721750 * b) / labConstants.Yn)
  const z = xyz_lab((0.0193339 * r + 0.1191920 * g + 0.9503041 * b) / labConstants.Zn)
  return [x, y, z]
}

const rgb2lab_1 = rgb2lab

const unpack$l = utils.unpack
const pow$1 = Math.pow

/*
* L* [0..100]
* a [-100..100]
* b [-100..100]
*/
const lab2rgb = function() {
  let args = [], len = arguments.length
  while (len--) args[ len ] = arguments[ len ]

  args = unpack$l(args, 'lab')
  const l = args[0]
  const a = args[1]
  const b = args[2]
  let x, y, z, r, g, b_

  y = (l + 16) / 116
  x = isNaN(a) ? y : y + a / 500
  z = isNaN(b) ? y : y - b / 200

  y = labConstants.Yn * lab_xyz(y)
  x = labConstants.Xn * lab_xyz(x)
  z = labConstants.Zn * lab_xyz(z)

  r = xyz_rgb(3.2404542 * x - 1.5371385 * y - 0.4985314 * z)  // D65 -> sRGB
  g = xyz_rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z)
  b_ = xyz_rgb(0.0556434 * x - 0.2040259 * y + 1.0572252 * z)

  return [r, g, b_, args.length > 3 ? args[3] : 1]
}

var xyz_rgb = function(r) {
  return 255 * (r <= 0.00304 ? 12.92 * r : 1.055 * pow$1(r, 1 / 2.4) - 0.055)
}

var lab_xyz = function(t) {
  return t > labConstants.t1 ? t * t * t : labConstants.t2 * (t - labConstants.t0)
}

const lab2rgb_1 = lab2rgb

const unpack$m = utils.unpack
const type$9 = utils.type

Color_1.prototype.lab = function() {
  return rgb2lab_1(this._rgb)
}

chroma_1.lab = function() {
  let args = [], len = arguments.length
  while (len--) args[ len ] = arguments[ len ]

  return new (Function.prototype.bind.apply(Color_1, [ null ].concat(args, ['lab'])))
}

input.format.lab = lab2rgb_1

input.autodetect.push({
  p: 2,
  test() {
    let args = [], len = arguments.length
    while (len--) args[ len ] = arguments[ len ]

    args = unpack$m(args, 'lab')
    if (type$9(args) === 'array' && args.length === 3)
      return 'lab'

  }
})

const unpack$n = utils.unpack
const { RAD2DEG } = utils
const sqrt$1 = Math.sqrt
const { atan2 } = Math
const round$4 = Math.round

const lab2lch = function() {
  let args = [], len = arguments.length
  while (len--) args[ len ] = arguments[ len ]

  const ref = unpack$n(args, 'lab')
  const l = ref[0]
  const a = ref[1]
  const b = ref[2]
  const c = sqrt$1(a * a + b * b)
  let h = (atan2(b, a) * RAD2DEG + 360) % 360
  if (round$4(c * 10000) === 0)  h = Number.NaN
  return [l, c, h]
}

const lab2lch_1 = lab2lch

const unpack$o = utils.unpack

const rgb2lch = function() {
  let args = [], len = arguments.length
  while (len--) args[ len ] = arguments[ len ]

  const ref = unpack$o(args, 'rgb')
  const r = ref[0]
  const g = ref[1]
  const b = ref[2]
  const ref$1 = rgb2lab_1(r, g, b)
  const l = ref$1[0]
  const a = ref$1[1]
  const b_ = ref$1[2]
  return lab2lch_1(l, a, b_)
}

const rgb2lch_1 = rgb2lch

const unpack$p = utils.unpack
const { DEG2RAD } = utils
const { sin } = Math
const cos$1 = Math.cos

const lch2lab = function() {
  let args = [], len = arguments.length
  while (len--) args[ len ] = arguments[ len ]

  /*
  Convert from a qualitative parameter h and a quantitative parameter l to a 24-bit pixel.
  These formulas were invented by David Dalrymple to obtain maximum contrast without going
  out of gamut if the parameters are in the range 0-1.

  A saturation multiplier was added by Gregor Aisch
  */
  const ref = unpack$p(args, 'lch')
  const l = ref[0]
  const c = ref[1]
  let h = ref[2]
  if (isNaN(h))  h = 0
  h *= DEG2RAD
  return [l, cos$1(h) * c, sin(h) * c]
}

const lch2lab_1 = lch2lab

const unpack$q = utils.unpack

const lch2rgb = function() {
  let args = [], len = arguments.length
  while (len--) args[ len ] = arguments[ len ]

  args = unpack$q(args, 'lch')
  const l = args[0]
  const c = args[1]
  const h = args[2]
  const ref = lch2lab_1 (l, c, h)
  const L = ref[0]
  const a = ref[1]
  const b_ = ref[2]
  const ref$1 = lab2rgb_1 (L, a, b_)
  const r = ref$1[0]
  const g = ref$1[1]
  const b = ref$1[2]
  return [r, g, b, args.length > 3 ? args[3] : 1]
}

const lch2rgb_1 = lch2rgb

const unpack$r = utils.unpack

const hcl2rgb = function() {
  let args = [], len = arguments.length
  while (len--) args[ len ] = arguments[ len ]

  const hcl = unpack$r(args, 'hcl').reverse()
  return lch2rgb_1.apply(void 0, hcl)
}

const hcl2rgb_1 = hcl2rgb

const unpack$s = utils.unpack
const type$a = utils.type

Color_1.prototype.lch = function() { return rgb2lch_1(this._rgb) }
Color_1.prototype.hcl = function() { return rgb2lch_1(this._rgb).reverse() }

chroma_1.lch = function() {
  let args = [], len = arguments.length
  while (len--) args[ len ] = arguments[ len ]

  return new (Function.prototype.bind.apply(Color_1, [ null ].concat(args, ['lch'])))
}
chroma_1.hcl = function() {
  let args = [], len = arguments.length
  while (len--) args[ len ] = arguments[ len ]

  return new (Function.prototype.bind.apply(Color_1, [ null ].concat(args, ['hcl'])))
}

input.format.lch = lch2rgb_1
input.format.hcl = hcl2rgb_1;

['lch', 'hcl'].forEach(m => input.autodetect.push({
  p: 2,
  test() {
    let args = [], len = arguments.length
    while (len--) args[ len ] = arguments[ len ]

    args = unpack$s(args, m)
    if (type$a(args) === 'array' && args.length === 3)
      return m

  }
}))

/**
X11 color names

http://www.w3.org/TR/css3-color/#svg-color
*/

const w3cx11 = {
  aliceblue: '#f0f8ff',
  antiquewhite: '#faebd7',
  aqua: '#00ffff',
  aquamarine: '#7fffd4',
  azure: '#f0ffff',
  beige: '#f5f5dc',
  bisque: '#ffe4c4',
  black: '#000000',
  blanchedalmond: '#ffebcd',
  blue: '#0000ff',
  blueviolet: '#8a2be2',
  brown: '#a52a2a',
  burlywood: '#deb887',
  cadetblue: '#5f9ea0',
  chartreuse: '#7fff00',
  chocolate: '#d2691e',
  coral: '#ff7f50',
  cornflower: '#6495ed',
  cornflowerblue: '#6495ed',
  cornsilk: '#fff8dc',
  crimson: '#dc143c',
  cyan: '#00ffff',
  darkblue: '#00008b',
  darkcyan: '#008b8b',
  darkgoldenrod: '#b8860b',
  darkgray: '#a9a9a9',
  darkgreen: '#006400',
  darkgrey: '#a9a9a9',
  darkkhaki: '#bdb76b',
  darkmagenta: '#8b008b',
  darkolivegreen: '#556b2f',
  darkorange: '#ff8c00',
  darkorchid: '#9932cc',
  darkred: '#8b0000',
  darksalmon: '#e9967a',
  darkseagreen: '#8fbc8f',
  darkslateblue: '#483d8b',
  darkslategray: '#2f4f4f',
  darkslategrey: '#2f4f4f',
  darkturquoise: '#00ced1',
  darkviolet: '#9400d3',
  deeppink: '#ff1493',
  deepskyblue: '#00bfff',
  dimgray: '#696969',
  dimgrey: '#696969',
  dodgerblue: '#1e90ff',
  firebrick: '#b22222',
  floralwhite: '#fffaf0',
  forestgreen: '#228b22',
  fuchsia: '#ff00ff',
  gainsboro: '#dcdcdc',
  ghostwhite: '#f8f8ff',
  gold: '#ffd700',
  goldenrod: '#daa520',
  gray: '#808080',
  green: '#008000',
  greenyellow: '#adff2f',
  grey: '#808080',
  honeydew: '#f0fff0',
  hotpink: '#ff69b4',
  indianred: '#cd5c5c',
  indigo: '#4b0082',
  ivory: '#fffff0',
  khaki: '#f0e68c',
  laserlemon: '#ffff54',
  lavender: '#e6e6fa',
  lavenderblush: '#fff0f5',
  lawngreen: '#7cfc00',
  lemonchiffon: '#fffacd',
  lightblue: '#add8e6',
  lightcoral: '#f08080',
  lightcyan: '#e0ffff',
  lightgoldenrod: '#fafad2',
  lightgoldenrodyellow: '#fafad2',
  lightgray: '#d3d3d3',
  lightgreen: '#90ee90',
  lightgrey: '#d3d3d3',
  lightpink: '#ffb6c1',
  lightsalmon: '#ffa07a',
  lightseagreen: '#20b2aa',
  lightskyblue: '#87cefa',
  lightslategray: '#778899',
  lightslategrey: '#778899',
  lightsteelblue: '#b0c4de',
  lightyellow: '#ffffe0',
  lime: '#00ff00',
  limegreen: '#32cd32',
  linen: '#faf0e6',
  magenta: '#ff00ff',
  maroon: '#800000',
  maroon2: '#7f0000',
  maroon3: '#b03060',
  mediumaquamarine: '#66cdaa',
  mediumblue: '#0000cd',
  mediumorchid: '#ba55d3',
  mediumpurple: '#9370db',
  mediumseagreen: '#3cb371',
  mediumslateblue: '#7b68ee',
  mediumspringgreen: '#00fa9a',
  mediumturquoise: '#48d1cc',
  mediumvioletred: '#c71585',
  midnightblue: '#191970',
  mintcream: '#f5fffa',
  mistyrose: '#ffe4e1',
  moccasin: '#ffe4b5',
  navajowhite: '#ffdead',
  navy: '#000080',
  oldlace: '#fdf5e6',
  olive: '#808000',
  olivedrab: '#6b8e23',
  orange: '#ffa500',
  orangered: '#ff4500',
  orchid: '#da70d6',
  palegoldenrod: '#eee8aa',
  palegreen: '#98fb98',
  paleturquoise: '#afeeee',
  palevioletred: '#db7093',
  papayawhip: '#ffefd5',
  peachpuff: '#ffdab9',
  peru: '#cd853f',
  pink: '#ffc0cb',
  plum: '#dda0dd',
  powderblue: '#b0e0e6',
  purple: '#800080',
  purple2: '#7f007f',
  purple3: '#a020f0',
  rebeccapurple: '#663399',
  red: '#ff0000',
  rosybrown: '#bc8f8f',
  royalblue: '#4169e1',
  saddlebrown: '#8b4513',
  salmon: '#fa8072',
  sandybrown: '#f4a460',
  seagreen: '#2e8b57',
  seashell: '#fff5ee',
  sienna: '#a0522d',
  silver: '#c0c0c0',
  skyblue: '#87ceeb',
  slateblue: '#6a5acd',
  slategray: '#708090',
  slategrey: '#708090',
  snow: '#fffafa',
  springgreen: '#00ff7f',
  steelblue: '#4682b4',
  tan: '#d2b48c',
  teal: '#008080',
  thistle: '#d8bfd8',
  tomato: '#ff6347',
  turquoise: '#40e0d0',
  violet: '#ee82ee',
  wheat: '#f5deb3',
  white: '#ffffff',
  whitesmoke: '#f5f5f5',
  yellow: '#ffff00',
  yellowgreen: '#9acd32'
}

const w3cx11_1 = w3cx11

const type$b = utils.type

Color_1.prototype.name = function() {
  const hex = rgb2hex_1(this._rgb, 'rgb')
  for (let i = 0, list = Object.keys(w3cx11_1); i < list.length; i += 1) {
    const n = list[i]

    if (w3cx11_1[n] === hex)  return n.toLowerCase()
  }
  return hex
}

input.format.named = function(name) {
  name = name.toLowerCase()
  if (w3cx11_1[name])  return hex2rgb_1(w3cx11_1[name])
  throw new Error('unknown color name: ' + name)
}

input.autodetect.push({
  p: 5,
  test(h) {
    let rest = [], len = arguments.length - 1
    while (len-- > 0) rest[ len ] = arguments[ len + 1 ]

    if (!rest.length && type$b(h) === 'string' && w3cx11_1[h.toLowerCase()])
      return 'named'

  }
})

const unpack$t = utils.unpack

const rgb2num = function() {
  let args = [], len = arguments.length
  while (len--) args[ len ] = arguments[ len ]

  const ref = unpack$t(args, 'rgb')
  const r = ref[0]
  const g = ref[1]
  const b = ref[2]
  return (r << 16) + (g << 8) + b
}

const rgb2num_1 = rgb2num

const type$c = utils.type

const num2rgb = function(num) {
  if (type$c(num) == 'number' && num >= 0 && num <= 0xFFFFFF) {
    const r = num >> 16
    const g = (num >> 8) & 0xFF
    const b = num & 0xFF
    return [r, g, b, 1]
  }
  throw new Error('unknown num color: ' + num)
}

const num2rgb_1 = num2rgb

const type$d = utils.type

Color_1.prototype.num = function() {
  return rgb2num_1(this._rgb)
}

chroma_1.num = function() {
  let args = [], len = arguments.length
  while (len--) args[ len ] = arguments[ len ]

  return new (Function.prototype.bind.apply(Color_1, [ null ].concat(args, ['num'])))
}

input.format.num = num2rgb_1

input.autodetect.push({
  p: 5,
  test() {
    let args = [], len = arguments.length
    while (len--) args[ len ] = arguments[ len ]

    if (args.length === 1 && type$d(args[0]) === 'number' && args[0] >= 0 && args[0] <= 0xFFFFFF)
      return 'num'

  }
})

const unpack$u = utils.unpack
const type$e = utils.type
const round$5 = Math.round

Color_1.prototype.rgb = function(rnd) {
  if (rnd === void 0) rnd = true

  if (rnd === false)  return this._rgb.slice(0, 3)
  return this._rgb.slice(0, 3).map(round$5)
}

Color_1.prototype.rgba = function(rnd) {
  if (rnd === void 0) rnd = true

  return this._rgb.slice(0, 4).map((v, i) => i < 3 ? (rnd === false ? v : round$5(v)) : v)
}

chroma_1.rgb = function() {
  let args = [], len = arguments.length
  while (len--) args[ len ] = arguments[ len ]

  return new (Function.prototype.bind.apply(Color_1, [ null ].concat(args, ['rgb'])))
}

input.format.rgb = function() {
  let args = [], len = arguments.length
  while (len--) args[ len ] = arguments[ len ]

  const rgba = unpack$u(args, 'rgba')
  if (rgba[3] === undefined)  rgba[3] = 1
  return rgba
}

input.autodetect.push({
  p: 3,
  test() {
    let args = [], len = arguments.length
    while (len--) args[ len ] = arguments[ len ]

    args = unpack$u(args, 'rgba')
    if (type$e(args) === 'array' && (args.length === 3 ||
          args.length === 4 && type$e(args[3]) == 'number' && args[3] >= 0 && args[3] <= 1))
      return 'rgb'

  }
})

/*
* Based on implementation by Neil Bartlett
* https://github.com/neilbartlett/color-temperature
*/

const { log } = Math

const temperature2rgb = function(kelvin) {
  const temp = kelvin / 100
  let r, g, b
  if (temp < 66) {
    r = 255
    g = -155.25485562709179 - 0.44596950469579133 * (g = temp - 2) + 104.49216199393888 * log(g)
    b = temp < 20 ? 0 : -254.76935184120902 + 0.8274096064007395 * (b = temp - 10) + 115.67994401066147 * log(b)
  } else {
    r = 351.97690566805693 + 0.114206453784165 * (r = temp - 55) - 40.25366309332127 * log(r)
    g = 325.4494125711974 + 0.07943456536662342 * (g = temp - 50) - 28.0852963507957 * log(g)
    b = 255
  }
  return [r, g, b, 1]
}

const temperature2rgb_1 = temperature2rgb

/*
* Based on implementation by Neil Bartlett
* https://github.com/neilbartlett/color-temperature
**/

const unpack$v = utils.unpack
const round$6 = Math.round

const rgb2temperature = function() {
  let args = [], len = arguments.length
  while (len--) args[ len ] = arguments[ len ]

  const rgb = unpack$v(args, 'rgb')
  const r = rgb[0], b = rgb[2]
  let minTemp = 1000
  let maxTemp = 40000
  const eps = 0.4
  let temp
  while (maxTemp - minTemp > eps) {
    temp = (maxTemp + minTemp) * 0.5
    const rgb$1 = temperature2rgb_1(temp)
    if ((rgb$1[2] / rgb$1[0]) >= (b / r))
      maxTemp = temp
    else
      minTemp = temp

  }
  return round$6(temp)
}

const rgb2temperature_1 = rgb2temperature

Color_1.prototype.temp =
Color_1.prototype.kelvin =
Color_1.prototype.temperature = function() {
  return rgb2temperature_1(this._rgb)
}

chroma_1.temp =
chroma_1.kelvin =
chroma_1.temperature = function() {
  let args = [], len = arguments.length
  while (len--) args[ len ] = arguments[ len ]

  return new (Function.prototype.bind.apply(Color_1, [ null ].concat(args, ['temp'])))
}

input.format.temp =
input.format.kelvin =
input.format.temperature = temperature2rgb_1

const type$f = utils.type

Color_1.prototype.alpha = function(a, mutate) {
  if (mutate === void 0) mutate = false

  if (a !== undefined && type$f(a) === 'number') {
    if (mutate) {
      this._rgb[3] = a
      return this
    }
    return new Color_1([this._rgb[0], this._rgb[1], this._rgb[2], a], 'rgb')
  }
  return this._rgb[3]
}

Color_1.prototype.clipped = function() {
  return this._rgb._clipped || false
}

Color_1.prototype.darken = function(amount) {
  if (amount === void 0) amount = 1

  const me = this
  const lab = me.lab()
  lab[0] -= labConstants.Kn * amount
  return new Color_1(lab, 'lab').alpha(me.alpha(), true)
}

Color_1.prototype.brighten = function(amount) {
  if (amount === void 0) amount = 1

  return this.darken(-amount)
}

Color_1.prototype.darker = Color_1.prototype.darken
Color_1.prototype.brighter = Color_1.prototype.brighten

Color_1.prototype.get = function(mc) {
  const ref = mc.split('.')
  const mode = ref[0]
  const channel = ref[1]
  const src = this[mode]()
  if (channel) {
    const i = mode.indexOf(channel)
    if (i > -1)  return src[i]
    throw new Error(('unknown channel ' + channel + ' in mode ' + mode))
  } else
    return src

}

const type$g = utils.type
const pow$2 = Math.pow

const EPS = 1e-7
const MAX_ITER = 20

Color_1.prototype.luminance = function(lum) {
  if (lum !== undefined && type$g(lum) === 'number') {
    if (lum === 0)
    // return pure black
      return new Color_1([0, 0, 0, this._rgb[3]], 'rgb')

    if (lum === 1)
    // return pure white
      return new Color_1([255, 255, 255, this._rgb[3]], 'rgb')

    // compute new color using...
    const cur_lum = this.luminance()
    const mode = 'rgb'
    let max_iter = MAX_ITER

    var test = function(low, high) {
      const mid = low.interpolate(high, 0.5, mode)
      const lm = mid.luminance()
      if (Math.abs(lum - lm) < EPS || !max_iter--)
      // close enough
        return mid

      return lm > lum ? test(low, mid) : test(mid, high)
    }

    const rgb = (cur_lum > lum ? test(new Color_1([0, 0, 0]), this) : test(this, new Color_1([255, 255, 255]))).rgb()
    return new Color_1(rgb.concat([this._rgb[3]]))
  }
  return rgb2luminance.apply(void 0, (this._rgb).slice(0, 3))
}

var rgb2luminance = function(r, g, b) {
  // relative luminance
  // see http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
  r = luminance_x(r)
  g = luminance_x(g)
  b = luminance_x(b)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

var luminance_x = function(x) {
  x /= 255
  return x <= 0.03928 ? x / 12.92 : pow$2((x + 0.055) / 1.055, 2.4)
}

const interpolator = {}

const type$h = utils.type

const mix = function(col1, col2, f) {
  if (f === void 0) f = 0.5
  let rest = [], len = arguments.length - 3
  while (len-- > 0) rest[ len ] = arguments[ len + 3 ]

  let mode = rest[0] || 'lrgb'
  if (!interpolator[mode] && !rest.length)
  // fall back to the first supported mode
    mode = Object.keys(interpolator)[0]

  if (!interpolator[mode])
    throw new Error(('interpolation mode ' + mode + ' is not defined'))

  if (type$h(col1) !== 'object')  col1 = new Color_1(col1)
  if (type$h(col2) !== 'object')  col2 = new Color_1(col2)
  return interpolator[mode](col1, col2, f)
    .alpha(col1.alpha() + f * (col2.alpha() - col1.alpha()))
}

Color_1.prototype.mix =
Color_1.prototype.interpolate = function(col2, f) {
  if (f === void 0) f = 0.5
  let rest = [], len = arguments.length - 2
  while (len-- > 0) rest[ len ] = arguments[ len + 2 ]

  return mix.apply(void 0, [ this, col2, f ].concat(rest))
}

Color_1.prototype.premultiply = function(mutate) {
  if (mutate === void 0) mutate = false

  const rgb = this._rgb
  const a = rgb[3]
  if (mutate) {
    this._rgb = [rgb[0] * a, rgb[1] * a, rgb[2] * a, a]
    return this
  }
  return new Color_1([rgb[0] * a, rgb[1] * a, rgb[2] * a, a], 'rgb')

}

Color_1.prototype.saturate = function(amount) {
  if (amount === void 0) amount = 1

  const me = this
  const lch = me.lch()
  lch[1] += labConstants.Kn * amount
  if (lch[1] < 0)  lch[1] = 0
  return new Color_1(lch, 'lch').alpha(me.alpha(), true)
}

Color_1.prototype.desaturate = function(amount) {
  if (amount === void 0) amount = 1

  return this.saturate(-amount)
}

const type$i = utils.type

Color_1.prototype.set = function(mc, value, mutate) {
  if (mutate === void 0) mutate = false

  const ref = mc.split('.')
  const mode = ref[0]
  const channel = ref[1]
  const src = this[mode]()
  if (channel) {
    const i = mode.indexOf(channel)
    if (i > -1) {
      if (type$i(value) == 'string')
        switch (value.charAt(0)) {
          case '+': src[i] += +value; break
          case '-': src[i] += +value; break
          case '*': src[i] *= +(value.substr(1)); break
          case '/': src[i] /= +(value.substr(1)); break
          default: src[i] = +value
        }
      else if (type$i(value) === 'number')
        src[i] = value
      else
        throw new Error('unsupported value for Color.set')

      const out = new Color_1(src, mode)
      if (mutate) {
        this._rgb = out._rgb
        return this
      }
      return out
    }
    throw new Error(('unknown channel ' + channel + ' in mode ' + mode))
  } else
    return src

}

const rgb$1 = function(col1, col2, f) {
  const xyz0 = col1._rgb
  const xyz1 = col2._rgb
  return new Color_1(
    xyz0[0] + f * (xyz1[0] - xyz0[0]),
    xyz0[1] + f * (xyz1[1] - xyz0[1]),
    xyz0[2] + f * (xyz1[2] - xyz0[2]),
    'rgb'
  )
}

// register interpolator
interpolator.rgb = rgb$1

const sqrt$2 = Math.sqrt
const pow$3 = Math.pow

const lrgb = function(col1, col2, f) {
  const ref = col1._rgb
  const x1 = ref[0]
  const y1 = ref[1]
  const z1 = ref[2]
  const ref$1 = col2._rgb
  const x2 = ref$1[0]
  const y2 = ref$1[1]
  const z2 = ref$1[2]
  return new Color_1(
    sqrt$2(pow$3(x1, 2) * (1 - f) + pow$3(x2, 2) * f),
    sqrt$2(pow$3(y1, 2) * (1 - f) + pow$3(y2, 2) * f),
    sqrt$2(pow$3(z1, 2) * (1 - f) + pow$3(z2, 2) * f),
    'rgb'
  )
}

// register interpolator
interpolator.lrgb = lrgb

const lab$1 = function(col1, col2, f) {
  const xyz0 = col1.lab()
  const xyz1 = col2.lab()
  return new Color_1(
    xyz0[0] + f * (xyz1[0] - xyz0[0]),
    xyz0[1] + f * (xyz1[1] - xyz0[1]),
    xyz0[2] + f * (xyz1[2] - xyz0[2]),
    'lab'
  )
}

// register interpolator
interpolator.lab = lab$1

const _hsx = function(col1, col2, f, m) {
  let assign, assign$1

  let xyz0, xyz1
  if (m === 'hsl') {
    xyz0 = col1.hsl()
    xyz1 = col2.hsl()
  } else if (m === 'hsv') {
    xyz0 = col1.hsv()
    xyz1 = col2.hsv()
  } else if (m === 'hcg') {
    xyz0 = col1.hcg()
    xyz1 = col2.hcg()
  } else if (m === 'hsi') {
    xyz0 = col1.hsi()
    xyz1 = col2.hsi()
  } else if (m === 'lch' || m === 'hcl') {
    m = 'hcl'
    xyz0 = col1.hcl()
    xyz1 = col2.hcl()
  }

  let hue0, hue1, sat0, sat1, lbv0, lbv1
  if (m.substr(0, 1) === 'h') {
    (assign = xyz0, hue0 = assign[0], sat0 = assign[1], lbv0 = assign[2]);
    (assign$1 = xyz1, hue1 = assign$1[0], sat1 = assign$1[1], lbv1 = assign$1[2])
  }

  let sat, hue, lbv, dh

  if (!isNaN(hue0) && !isNaN(hue1)) {
    // both colors have hue
    if (hue1 > hue0 && hue1 - hue0 > 180)
      dh = hue1 - (hue0 + 360)
    else if (hue1 < hue0 && hue0 - hue1 > 180)
      dh = hue1 + 360 - hue0
    else
      dh = hue1 - hue0

    hue = hue0 + f * dh
  } else if (!isNaN(hue0)) {
    hue = hue0
    if ((lbv1 == 1 || lbv1 == 0) && m != 'hsv')  sat = sat0
  } else if (!isNaN(hue1)) {
    hue = hue1
    if ((lbv0 == 1 || lbv0 == 0) && m != 'hsv')  sat = sat1
  } else
    hue = Number.NaN

  if (sat === undefined)  sat = sat0 + f * (sat1 - sat0)
  lbv = lbv0 + f * (lbv1 - lbv0)
  return new Color_1([hue, sat, lbv], m)
}

const lch$1 = function(col1, col2, f) {
  return _hsx(col1, col2, f, 'lch')
}

// register interpolator
interpolator.lch = lch$1
interpolator.hcl = lch$1

const num$1 = function(col1, col2, f) {
  const c1 = col1.num()
  const c2 = col2.num()
  return new Color_1(c1 + f * (c2 - c1), 'num')
}

// register interpolator
interpolator.num = num$1

const hcg$1 = function(col1, col2, f) {
  return _hsx(col1, col2, f, 'hcg')
}

// register interpolator
interpolator.hcg = hcg$1

const hsi$1 = function(col1, col2, f) {
  return _hsx(col1, col2, f, 'hsi')
}

// register interpolator
interpolator.hsi = hsi$1

const hsl$1 = function(col1, col2, f) {
  return _hsx(col1, col2, f, 'hsl')
}

// register interpolator
interpolator.hsl = hsl$1

const hsv$1 = function(col1, col2, f) {
  return _hsx(col1, col2, f, 'hsv')
}

// register interpolator
interpolator.hsv = hsv$1

const clip_rgb$2 = utils.clip_rgb
const pow$4 = Math.pow
const sqrt$3 = Math.sqrt
const PI$1 = Math.PI
const cos$2 = Math.cos
const sin$1 = Math.sin
const atan2$1 = Math.atan2

const average = function(colors, mode) {
  if (mode === void 0) mode = 'lrgb'

  const l = colors.length
  // convert colors to Color objects
  colors = colors.map(c => new Color_1(c))
  if (mode === 'lrgb')
    return _average_lrgb(colors)

  const first = colors.shift()
  const xyz = first.get(mode)
  const cnt = []
  let dx = 0
  let dy = 0
  // initial color
  for (let i = 0; i < xyz.length; i++) {
    xyz[i] = xyz[i] || 0
    cnt.push(isNaN(xyz[i]) ? 0 : 1)
    if (mode.charAt(i) === 'h' && !isNaN(xyz[i])) {
      const A = xyz[i] / 180 * PI$1
      dx += cos$2(A)
      dy += sin$1(A)
    }
  }

  let alpha = first.alpha()
  colors.forEach(c => {
    const xyz2 = c.get(mode)
    alpha += c.alpha()
    for (let i = 0; i < xyz.length; i++)
      if (!isNaN(xyz2[i])) {
        cnt[i]++
        if (mode.charAt(i) === 'h') {
          const A = xyz2[i] / 180 * PI$1
          dx += cos$2(A)
          dy += sin$1(A)
        } else
          xyz[i] += xyz2[i]

      }

  })

  for (let i$1 = 0; i$1 < xyz.length; i$1++)
    if (mode.charAt(i$1) === 'h') {
      let A$1 = atan2$1(dy / cnt[i$1], dx / cnt[i$1]) / PI$1 * 180
      while (A$1 < 0)  A$1 += 360
      while (A$1 >= 360)  A$1 -= 360
      xyz[i$1] = A$1
    } else
      xyz[i$1] = xyz[i$1] / cnt[i$1]

  alpha /= l
  return (new Color_1(xyz, mode)).alpha(alpha > 0.99999 ? 1 : alpha, true)
}

var _average_lrgb = function(colors) {
  const l = colors.length
  const f = 1 / l
  const xyz = [0, 0, 0, 0]
  for (let i = 0, list = colors; i < list.length; i += 1) {
    const col = list[i]

    const rgb = col._rgb
    xyz[0] += pow$4(rgb[0], 2) * f
    xyz[1] += pow$4(rgb[1], 2) * f
    xyz[2] += pow$4(rgb[2], 2) * f
    xyz[3] += rgb[3] * f
  }
  xyz[0] = sqrt$3(xyz[0])
  xyz[1] = sqrt$3(xyz[1])
  xyz[2] = sqrt$3(xyz[2])
  if (xyz[3] > 0.9999999)  xyz[3] = 1
  return new Color_1(clip_rgb$2(xyz))
}

// minimal multi-purpose interface

// @requires utils color analyze

const type$j = utils.type

const pow$5 = Math.pow

const scale = function(colors) {

  // constructor
  let _mode = 'rgb'
  let _nacol = chroma_1('#ccc')
  let _spread = 0
  // const _fixed = false;
  let _domain = [0, 1]
  let _pos = []
  let _padding = [0, 0]
  let _classes = false
  let _colors = []
  let _out = false
  let _min = 0
  let _max = 1
  let _correctLightness = false
  let _colorCache = {}
  let _useCache = true
  let _gamma = 1

  // private methods

  const setColors = function(colors) {
    colors = colors || ['#fff', '#000']
    if (colors && type$j(colors) === 'string' && chroma_1.brewer &&
          chroma_1.brewer[colors.toLowerCase()])
      colors = chroma_1.brewer[colors.toLowerCase()]

    if (type$j(colors) === 'array') {
      // handle single color
      if (colors.length === 1)
        colors = [colors[0], colors[0]]

      // make a copy of the colors
      colors = colors.slice(0)
      // convert to chroma classes
      for (let c = 0; c < colors.length; c++)
        colors[c] = chroma_1(colors[c])

      // auto-fill color position
      _pos.length = 0
      for (let c$1 = 0; c$1 < colors.length; c$1++)
        _pos.push(c$1 / (colors.length - 1))

    }
    resetCache()
    return _colors = colors
  }

  const getClass = function(value) {
    if (_classes != null) {
      const n = _classes.length - 1
      let i = 0
      while (i < n && value >= _classes[i])
        i++

      return i - 1
    }
    return 0
  }

  let tmap = function(t) { return t }

  // const classifyValue = function(value) {
  //     let val = value;
  //     if (_classes.length > 2) {
  //         const n = _classes.length-1;
  //         const i = getClass(value);
  //         const minc = _classes[0] + ((_classes[1]-_classes[0]) * (0 + (_spread * 0.5)));  // center of 1st class
  //         const maxc = _classes[n-1] + ((_classes[n]-_classes[n-1]) * (1 - (_spread * 0.5)));  // center of last class
  //         val = _min + ((((_classes[i] + ((_classes[i+1] - _classes[i]) * 0.5)) - minc) / (maxc-minc)) * (_max - _min));
  //     }
  //     return val;
  // };

  const getColor = function(val, bypassMap) {
    let col, t
    if (bypassMap == null)  bypassMap = false
    if (isNaN(val) || (val === null))  return _nacol
    if (!bypassMap)
      if (_classes && (_classes.length > 2)) {
        // find the class
        const c = getClass(val)
        t = c / (_classes.length - 2)
      } else if (_max !== _min)
      // just interpolate between min/max
        t = (val - _min) / (_max - _min)
      else
        t = 1

    else
      t = val

    if (!bypassMap)
      t = tmap(t)  // lightness correction

    if (_gamma !== 1)  t = pow$5(t, _gamma)

    t = _padding[0] + (t * (1 - _padding[0] - _padding[1]))

    t = Math.min(1, Math.max(0, t))

    const k = Math.floor(t * 10000)

    if (_useCache && _colorCache[k])
      col = _colorCache[k]
    else {
      if (type$j(_colors) === 'array')
      // for i in [0.._pos.length-1]
        for (let i = 0; i < _pos.length; i++) {
          const p = _pos[i]
          if (t <= p) {
            col = _colors[i]
            break
          }
          if ((t >= p) && (i === (_pos.length - 1))) {
            col = _colors[i]
            break
          }
          if (t > p && t < _pos[i + 1]) {
            t = (t - p) / (_pos[i + 1] - p)
            col = chroma_1.interpolate(_colors[i], _colors[i + 1], t, _mode)
            break
          }
        }
      else if (type$j(_colors) === 'function')
        col = _colors(t)

      if (_useCache)  _colorCache[k] = col
    }
    return col
  }

  var resetCache = function() { return _colorCache = {} }

  setColors(colors)

  // public interface

  const f = function(v) {
    const c = chroma_1(getColor(v))
    if (_out && c[_out])  return c[_out]();   return c
  }

  f.classes = function(classes) {
    if (classes != null) {
      if (type$j(classes) === 'array') {
        _classes = classes
        _domain = [classes[0], classes[classes.length - 1]]
      } else {
        const d = chroma_1.analyze(_domain)
        if (classes === 0)
          _classes = [d.min, d.max]
        else
          _classes = chroma_1.limits(d, 'e', classes)

      }
      return f
    }
    return _classes
  }

  f.domain = function(domain) {
    if (!arguments.length)
      return _domain

    _min = domain[0]
    _max = domain[domain.length - 1]
    _pos = []
    const k = _colors.length
    if ((domain.length === k) && (_min !== _max))
    // update positions
      for (let i = 0, list = Array.from(domain); i < list.length; i += 1) {
        const d = list[i]

        _pos.push((d - _min) / (_max - _min))
      }
    else
      for (let c = 0; c < k; c++)
        _pos.push(c / (k - 1))

    _domain = [_min, _max]
    return f
  }

  f.mode = function(_m) {
    if (!arguments.length)
      return _mode

    _mode = _m
    resetCache()
    return f
  }

  f.range = function(colors, _pos) {
    setColors(colors, _pos)
    return f
  }

  f.out = function(_o) {
    _out = _o
    return f
  }

  f.spread = function(val) {
    if (!arguments.length)
      return _spread

    _spread = val
    return f
  }

  f.correctLightness = function(v) {
    if (v == null)  v = true
    _correctLightness = v
    resetCache()
    if (_correctLightness)
      tmap = function(t) {
        const L0 = getColor(0, true).lab()[0]
        const L1 = getColor(1, true).lab()[0]
        const pol = L0 > L1
        let L_actual = getColor(t, true).lab()[0]
        const L_ideal = L0 + ((L1 - L0) * t)
        let L_diff = L_actual - L_ideal
        let t0 = 0
        let t1 = 1
        let max_iter = 20
        while ((Math.abs(L_diff) > 1e-2) && (max_iter-- > 0))
          (function() {
            if (pol)  L_diff *= -1
            if (L_diff < 0) {
              t0 = t
              t += (t1 - t) * 0.5
            } else {
              t1 = t
              t += (t0 - t) * 0.5
            }
            L_actual = getColor(t, true).lab()[0]
            return L_diff = L_actual - L_ideal
          })()

        return t
      }
    else
      tmap = function(t) { return t }

    return f
  }

  f.padding = function(p) {
    if (p != null) {
      if (type$j(p) === 'number')
        p = [p, p]

      _padding = p
      return f
    }
    return _padding

  }

  f.colors = function(numColors, out) {
    // If no arguments are given, return the original colors that were provided
    if (arguments.length < 2)  out = 'hex'
    let result = []

    if (arguments.length === 0)
      result = _colors.slice(0)

    else if (numColors === 1)
      result = [f(0.5)]

    else if (numColors > 1) {
      const dm = _domain[0]
      const dd = _domain[1] - dm
      result = __range__(0, numColors, false).map(i => f(dm + ((i / (numColors - 1)) * dd)))

    } else { // returns all colors based on the defined classes
      colors = []
      let samples = []
      if (_classes && (_classes.length > 2))
        for (let i = 1, end = _classes.length, asc = end >= 1; asc ? i < end : i > end; asc ? i++ : i--)
          samples.push((_classes[i - 1] + _classes[i]) * 0.5)

      else
        samples = _domain

      result = samples.map(v => f(v))
    }

    if (chroma_1[out])
      result = result.map(c => c[out]())

    return result
  }

  f.cache = function(c) {
    if (c != null) {
      _useCache = c
      return f
    }
    return _useCache

  }

  f.gamma = function(g) {
    if (g != null) {
      _gamma = g
      return f
    }
    return _gamma

  }

  f.nodata = function(d) {
    if (d != null) {
      _nacol = chroma_1(d)
      return f
    }
    return _nacol

  }

  return f
}

function __range__(left, right, inclusive) {
  const range = []
  const ascending = left < right
  const end = !inclusive ? right : ascending ? right + 1 : right - 1
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--)
    range.push(i)

  return range
}

//
// interpolates between a set of colors uzing a bezier spline
//

// @requires utils lab

var bezier = function(colors) {
  let assign, assign$1, assign$2

  let I, lab0, lab1, lab2
  colors = colors.map(c => new Color_1(c))
  if (colors.length === 2) {
    // linear interpolation
    (assign = colors.map(c => c.lab()), lab0 = assign[0], lab1 = assign[1])
    I = function(t) {
      const lab = ([0, 1, 2].map(i => lab0[i] + (t * (lab1[i] - lab0[i]))))
      return new Color_1(lab, 'lab')
    }
  } else if (colors.length === 3) {
    // quadratic bezier interpolation
    (assign$1 = colors.map(c => c.lab()), lab0 = assign$1[0], lab1 = assign$1[1], lab2 = assign$1[2])
    I = function(t) {
      const lab = ([0, 1, 2].map(i => ((1 - t) * (1 - t) * lab0[i]) + (2 * (1 - t) * t * lab1[i]) + (t * t * lab2[i])))
      return new Color_1(lab, 'lab')
    }
  } else if (colors.length === 4) {
    // cubic bezier interpolation
    let lab3;
    (assign$2 = colors.map(c => c.lab()), lab0 = assign$2[0], lab1 = assign$2[1], lab2 = assign$2[2], lab3 = assign$2[3])
    I = function(t) {
      const lab = ([0, 1, 2].map(i => ((1 - t) * (1 - t) * (1 - t) * lab0[i]) + (3 * (1 - t) * (1 - t) * t * lab1[i]) + (3 * (1 - t) * t * t * lab2[i]) + (t * t * t * lab3[i])))
      return new Color_1(lab, 'lab')
    }
  } else if (colors.length === 5) {
    const I0 = bezier(colors.slice(0, 3))
    const I1 = bezier(colors.slice(2, 5))
    I = function(t) {
      if (t < 0.5)
        return I0(t * 2)

      return I1((t - 0.5) * 2)

    }
  }
  return I
}

const bezier_1 = function(colors) {
  const f = bezier(colors)
  f.scale = function() { return scale(f) }
  return f
}

/*
* interpolates between a set of colors uzing a bezier spline
* blend mode formulas taken from http://www.venture-ware.com/kevin/coding/lets-learn-math-photoshop-blend-modes/
*/

var blend = function(bottom, top, mode) {
  if (!blend[mode])
    throw new Error('unknown blend mode ' + mode)

  return blend[mode](bottom, top)
}

const blend_f = function(f) { return function(bottom, top) {
  const c0 = chroma_1(top).rgb()
  const c1 = chroma_1(bottom).rgb()
  return chroma_1.rgb(f(c0, c1))
} }

const each = function(f) { return function(c0, c1) {
  const out = []
  out[0] = f(c0[0], c1[0])
  out[1] = f(c0[1], c1[1])
  out[2] = f(c0[2], c1[2])
  return out
} }

const normal = function(a) { return a }
const multiply = function(a, b) { return a * b / 255 }
const darken$1 = function(a, b) { return a > b ? b : a }
const lighten = function(a, b) { return a > b ? a : b }
const screen = function(a, b) { return 255 * (1 - (1 - a / 255) * (1 - b / 255)) }
const overlay = function(a, b) { return b < 128 ? 2 * a * b / 255 : 255 * (1 - 2 * (1 - a / 255) * (1 - b / 255)) }
const burn = function(a, b) { return 255 * (1 - (1 - b / 255) / (a / 255)) }
const dodge = function(a, b) {
  if (a === 255)  return 255
  a = 255 * (b / 255) / (1 - a / 255)
  return a > 255 ? 255 : a
}

// # add = (a,b) ->
// #     if (a + b > 255) then 255 else a + b

blend.normal = blend_f(each(normal))
blend.multiply = blend_f(each(multiply))
blend.screen = blend_f(each(screen))
blend.overlay = blend_f(each(overlay))
blend.darken = blend_f(each(darken$1))
blend.lighten = blend_f(each(lighten))
blend.dodge = blend_f(each(dodge))
blend.burn = blend_f(each(burn))
// blend.add = blend_f(each(add));

const blend_1 = blend

// cubehelix interpolation
// based on D.A. Green "A colour scheme for the display of astronomical intensity images"
// http://astron-soc.in/bulletin/11June/289392011.pdf

const type$k = utils.type
const clip_rgb$3 = utils.clip_rgb
const TWOPI$2 = utils.TWOPI
const pow$6 = Math.pow
const sin$2 = Math.sin
const cos$3 = Math.cos

const cubehelix = function(start, rotations, hue, gamma, lightness) {
  if (start === void 0) start = 300
  if (rotations === void 0) rotations = -1.5
  if (hue === void 0) hue = 1
  if (gamma === void 0) gamma = 1
  if (lightness === void 0) lightness = [0, 1]

  let dh = 0, dl
  if (type$k(lightness) === 'array')
    dl = lightness[1] - lightness[0]
  else {
    dl = 0
    lightness = [lightness, lightness]
  }

  const f = function(fract) {
    const a = TWOPI$2 * (((start + 120) / 360) + (rotations * fract))
    const l = pow$6(lightness[0] + (dl * fract), gamma)
    const h = dh !== 0 ? hue[0] + (fract * dh) : hue
    const amp = (h * l * (1 - l)) / 2
    const cos_a = cos$3(a)
    const sin_a = sin$2(a)
    const r = l + (amp * ((-0.14861 * cos_a) + (1.78277 * sin_a)))
    const g = l + (amp * ((-0.29227 * cos_a) - (0.90649 * sin_a)))
    const b = l + (amp * (+1.97294 * cos_a))
    return chroma_1(clip_rgb$3([r * 255, g * 255, b * 255, 1]))
  }

  f.start = function(s) {
    if ((s == null))  return start
    start = s
    return f
  }

  f.rotations = function(r) {
    if ((r == null))  return rotations
    rotations = r
    return f
  }

  f.gamma = function(g) {
    if ((g == null))  return gamma
    gamma = g
    return f
  }

  f.hue = function(h) {
    if ((h == null))  return hue
    hue = h
    if (type$k(hue) === 'array') {
      dh = hue[1] - hue[0]
      if (dh === 0)  hue = hue[1]
    } else
      dh = 0

    return f
  }

  f.lightness = function(h) {
    if ((h == null))  return lightness
    if (type$k(h) === 'array') {
      lightness = h
      dl = h[1] - h[0]
    } else {
      lightness = [h, h]
      dl = 0
    }
    return f
  }

  f.scale = function() { return chroma_1.scale(f) }

  f.hue(hue)

  return f
}

const digits = '0123456789abcdef'

const floor$2 = Math.floor
const { random } = Math

const random_1 = function() {
  let code = '#'
  for (let i = 0; i < 6; i++)
    code += digits.charAt(floor$2(random() * 16))

  return new Color_1(code, 'hex')
}

const log$1 = Math.log
const pow$7 = Math.pow
const floor$3 = Math.floor
const { abs } = Math

const analyze = function(data, key) {
  if (key === void 0) key = null

  const r = {
    min: Number.MAX_VALUE,
    max: Number.MAX_VALUE * -1,
    sum: 0,
    values: [],
    count: 0
  }
  if (type(data) === 'object')
    data = Object.values(data)

  data.forEach(val => {
    if (key && type(val) === 'object')  val = val[key]
    if (val !== undefined && val !== null && !isNaN(val)) {
      r.values.push(val)
      r.sum += val
      if (val < r.min)  r.min = val
      if (val > r.max)  r.max = val
      r.count += 1
    }
  })

  r.domain = [r.min, r.max]

  r.limits = function(mode, num) { return limits(r, mode, num) }

  return r
}

var limits = function(data, mode, num) {
  if (mode === void 0) mode = 'equal'
  if (num === void 0) num = 7

  if (type(data) == 'array')
    data = analyze(data)

  const { min } = data
  const { max } = data
  const values = data.values.sort((a, b) => a - b)

  if (num === 1)  return [min, max]

  const limits = []

  if (mode.substr(0, 1) === 'c') { // continuous
    limits.push(min)
    limits.push(max)
  }

  if (mode.substr(0, 1) === 'e') { // equal interval
    limits.push(min)
    for (let i = 1; i < num; i++)
      limits.push(min + ((i / num) * (max - min)))

    limits.push(max)
  }

  else if (mode.substr(0, 1) === 'l') { // log scale
    if (min <= 0)
      throw new Error('Logarithmic scales are only possible for values > 0')

    const min_log = Math.LOG10E * log$1(min)
    const max_log = Math.LOG10E * log$1(max)
    limits.push(min)
    for (let i$1 = 1; i$1 < num; i$1++)
      limits.push(pow$7(10, min_log + ((i$1 / num) * (max_log - min_log))))

    limits.push(max)
  }

  else if (mode.substr(0, 1) === 'q') { // quantile scale
    limits.push(min)
    for (let i$2 = 1; i$2 < num; i$2++) {
      const p = ((values.length - 1) * i$2) / num
      const pb = floor$3(p)
      if (pb === p)
        limits.push(values[pb])
      else { // p > pb
        const pr = p - pb
        limits.push((values[pb] * (1 - pr)) + (values[pb + 1] * pr))
      }
    }
    limits.push(max)

  }

  else if (mode.substr(0, 1) === 'k') { // k-means clustering
    /*
      implementation based on
      http://code.google.com/p/figue/source/browse/trunk/figue.js#336
      simplified for 1-d input values
      */
    let cluster
    const n = values.length
    const assignments = new Array(n)
    const clusterSizes = new Array(num)
    let repeat = true
    let nb_iters = 0
    let centroids = null

    // get seed values
    centroids = []
    centroids.push(min)
    for (let i$3 = 1; i$3 < num; i$3++)
      centroids.push(min + ((i$3 / num) * (max - min)))

    centroids.push(max)

    while (repeat) {
      // assignment step
      for (let j = 0; j < num; j++)
        clusterSizes[j] = 0

      for (let i$4 = 0; i$4 < n; i$4++) {
        const value = values[i$4]
        let mindist = Number.MAX_VALUE
        let best = (void 0)
        for (let j$1 = 0; j$1 < num; j$1++) {
          const dist = abs(centroids[j$1] - value)
          if (dist < mindist) {
            mindist = dist
            best = j$1
          }
          clusterSizes[best]++
          assignments[i$4] = best
        }
      }

      // update centroids step
      const newCentroids = new Array(num)
      for (let j$2 = 0; j$2 < num; j$2++)
        newCentroids[j$2] = null

      for (let i$5 = 0; i$5 < n; i$5++) {
        cluster = assignments[i$5]
        if (newCentroids[cluster] === null)
          newCentroids[cluster] = values[i$5]
        else
          newCentroids[cluster] += values[i$5]

      }
      for (let j$3 = 0; j$3 < num; j$3++)
        newCentroids[j$3] *= 1 / clusterSizes[j$3]

      // check convergence
      repeat = false
      for (let j$4 = 0; j$4 < num; j$4++)
        if (newCentroids[j$4] !== centroids[j$4]) {
          repeat = true
          break
        }

      centroids = newCentroids
      nb_iters++

      if (nb_iters > 200)
        repeat = false

    }

    // finished k-means clustering
    // the next part is borrowed from gabrielflor.it
    const kClusters = {}
    for (let j$5 = 0; j$5 < num; j$5++)
      kClusters[j$5] = []

    for (let i$6 = 0; i$6 < n; i$6++) {
      cluster = assignments[i$6]
      kClusters[cluster].push(values[i$6])
    }
    let tmpKMeansBreaks = []
    for (let j$6 = 0; j$6 < num; j$6++) {
      tmpKMeansBreaks.push(kClusters[j$6][0])
      tmpKMeansBreaks.push(kClusters[j$6][kClusters[j$6].length - 1])
    }
    tmpKMeansBreaks = tmpKMeansBreaks.sort((a, b) => a - b)
    limits.push(tmpKMeansBreaks[0])
    for (let i$7 = 1; i$7 < tmpKMeansBreaks.length; i$7 += 2) {
      const v = tmpKMeansBreaks[i$7]
      if (!isNaN(v) && (limits.indexOf(v) === -1))
        limits.push(v)

    }
  }
  return limits
}

const analyze_1 = { analyze, limits }

const contrast = function(a, b) {
  // WCAG contrast ratio
  // see http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef
  a = new Color_1(a)
  b = new Color_1(b)
  const l1 = a.luminance()
  const l2 = b.luminance()
  return l1 > l2 ? (l1 + 0.05) / (l2 + 0.05) : (l2 + 0.05) / (l1 + 0.05)
}

const sqrt$4 = Math.sqrt
const atan2$2 = Math.atan2
const abs$1 = Math.abs
const cos$4 = Math.cos
const PI$2 = Math.PI

const deltaE = function(a, b, L, C) {
  if (L === void 0) L = 1
  if (C === void 0) C = 1

  // Delta E (CMC)
  // see http://www.brucelindbloom.com/index.html?Eqn_DeltaE_CMC.html
  a = new Color_1(a)
  b = new Color_1(b)
  const ref = Array.from(a.lab())
  const L1 = ref[0]
  const a1 = ref[1]
  const b1 = ref[2]
  const ref$1 = Array.from(b.lab())
  const L2 = ref$1[0]
  const a2 = ref$1[1]
  const b2 = ref$1[2]
  const c1 = sqrt$4((a1 * a1) + (b1 * b1))
  const c2 = sqrt$4((a2 * a2) + (b2 * b2))
  const sl = L1 < 16.0 ? 0.511 : (0.040975 * L1) / (1.0 + (0.01765 * L1))
  const sc = ((0.0638 * c1) / (1.0 + (0.0131 * c1))) + 0.638
  let h1 = c1 < 0.000001 ? 0.0 : (atan2$2(b1, a1) * 180.0) / PI$2
  while (h1 < 0)  h1 += 360
  while (h1 >= 360)  h1 -= 360
  const t = (h1 >= 164.0) && (h1 <= 345.0) ? (0.56 + abs$1(0.2 * cos$4((PI$2 * (h1 + 168.0)) / 180.0))) : (0.36 + abs$1(0.4 * cos$4((PI$2 * (h1 + 35.0)) / 180.0)))
  const c4 = c1 * c1 * c1 * c1
  const f = sqrt$4(c4 / (c4 + 1900.0))
  const sh = sc * (((f * t) + 1.0) - f)
  const delL = L1 - L2
  const delC = c1 - c2
  const delA = a1 - a2
  const delB = b1 - b2
  const dH2 = ((delA * delA) + (delB * delB)) - (delC * delC)
  const v1 = delL / (L * sl)
  const v2 = delC / (C * sc)
  const v3 = sh
  return sqrt$4((v1 * v1) + (v2 * v2) + (dH2 / (v3 * v3)))
}

// simple Euclidean distance
const distance = function(a, b, mode) {
  if (mode === void 0) mode = 'lab'

  // Delta E (CIE 1976)
  // see http://www.brucelindbloom.com/index.html?Equations.html
  a = new Color_1(a)
  b = new Color_1(b)
  const l1 = a.get(mode)
  const l2 = b.get(mode)
  let sum_sq = 0
  for (const i in l1) {
    const d = (l1[i] || 0) - (l2[i] || 0)
    sum_sq += d * d
  }
  return Math.sqrt(sum_sq)
}

const valid = function() {
  let args = [], len = arguments.length
  while (len--) args[ len ] = arguments[ len ]

  try {
    new (Function.prototype.bind.apply(Color_1, [ null ].concat(args)))
    return true
  } catch (e) {
    return false
  }
}

// some pre-defined color scales:

const scales = {
  cool: function cool() { return scale([chroma_1.hsl(180, 1, .9), chroma_1.hsl(250, .7, .4)]) },
  hot: function hot() { return scale(['#000', '#f00', '#ff0', '#fff'], [0, .25, .75, 1]).mode('rgb') }
}

/**
  ColorBrewer colors for chroma.js

  Copyright (c) 2002 Cynthia Brewer, Mark Harrower, and The
  Pennsylvania State University.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed
  under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
  CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
*/

const colorbrewer = {
  // sequential
  OrRd: ['#fff7ec', '#fee8c8', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f', '#b30000', '#7f0000'],
  PuBu: ['#fff7fb', '#ece7f2', '#d0d1e6', '#a6bddb', '#74a9cf', '#3690c0', '#0570b0', '#045a8d', '#023858'],
  BuPu: ['#f7fcfd', '#e0ecf4', '#bfd3e6', '#9ebcda', '#8c96c6', '#8c6bb1', '#88419d', '#810f7c', '#4d004b'],
  Oranges: ['#fff5eb', '#fee6ce', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#a63603', '#7f2704'],
  BuGn: ['#f7fcfd', '#e5f5f9', '#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#006d2c', '#00441b'],
  YlOrBr: ['#ffffe5', '#fff7bc', '#fee391', '#fec44f', '#fe9929', '#ec7014', '#cc4c02', '#993404', '#662506'],
  YlGn: ['#ffffe5', '#f7fcb9', '#d9f0a3', '#addd8e', '#78c679', '#41ab5d', '#238443', '#006837', '#004529'],
  Reds: ['#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15', '#67000d'],
  RdPu: ['#fff7f3', '#fde0dd', '#fcc5c0', '#fa9fb5', '#f768a1', '#dd3497', '#ae017e', '#7a0177', '#49006a'],
  Greens: ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b'],
  YlGnBu: ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58'],
  Purples: ['#fcfbfd', '#efedf5', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#54278f', '#3f007d'],
  GnBu: ['#f7fcf0', '#e0f3db', '#ccebc5', '#a8ddb5', '#7bccc4', '#4eb3d3', '#2b8cbe', '#0868ac', '#084081'],
  Greys: ['#ffffff', '#f0f0f0', '#d9d9d9', '#bdbdbd', '#969696', '#737373', '#525252', '#252525', '#000000'],
  YlOrRd: ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026'],
  PuRd: ['#f7f4f9', '#e7e1ef', '#d4b9da', '#c994c7', '#df65b0', '#e7298a', '#ce1256', '#980043', '#67001f'],
  Blues: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'],
  PuBuGn: ['#fff7fb', '#ece2f0', '#d0d1e6', '#a6bddb', '#67a9cf', '#3690c0', '#02818a', '#016c59', '#014636'],
  Viridis: ['#440154', '#482777', '#3f4a8a', '#31678e', '#26838f', '#1f9d8a', '#6cce5a', '#b6de2b', '#fee825'],

  // diverging

  Spectral: ['#9e0142', '#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#e6f598', '#abdda4', '#66c2a5', '#3288bd', '#5e4fa2'],
  RdYlGn: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850', '#006837'],
  RdBu: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#f7f7f7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac', '#053061'],
  PiYG: ['#8e0152', '#c51b7d', '#de77ae', '#f1b6da', '#fde0ef', '#f7f7f7', '#e6f5d0', '#b8e186', '#7fbc41', '#4d9221', '#276419'],
  PRGn: ['#40004b', '#762a83', '#9970ab', '#c2a5cf', '#e7d4e8', '#f7f7f7', '#d9f0d3', '#a6dba0', '#5aae61', '#1b7837', '#00441b'],
  RdYlBu: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695'],
  BrBG: ['#543005', '#8c510a', '#bf812d', '#dfc27d', '#f6e8c3', '#f5f5f5', '#c7eae5', '#80cdc1', '#35978f', '#01665e', '#003c30'],
  RdGy: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#ffffff', '#e0e0e0', '#bababa', '#878787', '#4d4d4d', '#1a1a1a'],
  PuOr: ['#7f3b08', '#b35806', '#e08214', '#fdb863', '#fee0b6', '#f7f7f7', '#d8daeb', '#b2abd2', '#8073ac', '#542788', '#2d004b'],

  // qualitative

  Set2: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#e5c494', '#b3b3b3'],
  Accent: ['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0', '#f0027f', '#bf5b17', '#666666'],
  Set1: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'],
  Set3: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd', '#ccebc5', '#ffed6f'],
  Dark2: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d', '#666666'],
  Paired: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928'],
  Pastel2: ['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9', '#fff2ae', '#f1e2cc', '#cccccc'],
  Pastel1: ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6', '#ffffcc', '#e5d8bd', '#fddaec', '#f2f2f2'],
}

// add lowercase aliases for case-insensitive matches
for (let i$1 = 0, list$1 = Object.keys(colorbrewer); i$1 < list$1.length; i$1 += 1) {
  const key = list$1[i$1]

  colorbrewer[key.toLowerCase()] = colorbrewer[key]
}

const colorbrewer_1 = colorbrewer

// feel free to comment out anything to rollup
// a smaller chroma.js built

// io --> convert colors

// operators --> modify existing Colors

// interpolators

// generators -- > create new colors
chroma_1.average = average
chroma_1.bezier = bezier_1
chroma_1.blend = blend_1
chroma_1.cubehelix = cubehelix
chroma_1.mix = chroma_1.interpolate = mix
chroma_1.random = random_1
chroma_1.scale = scale

// other utility methods
chroma_1.analyze = analyze_1.analyze
chroma_1.contrast = contrast
chroma_1.deltaE = deltaE
chroma_1.distance = distance
chroma_1.limits = analyze_1.limits
chroma_1.valid = valid

// scale
chroma_1.scales = scales

// colors
chroma_1.colors = w3cx11_1
chroma_1.brewer = colorbrewer_1

const chroma_js = chroma_1

export default chroma_js
