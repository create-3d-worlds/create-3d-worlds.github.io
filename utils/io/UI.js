const baseControls = {
  '←': 'left',
  '→': 'right',
  '↑': 'forward',
  '↓': 'backward',
  // 'Space:': 'jump',
  // 'Enter:': 'attack',
  // 'CapsLock:': 'run',
}

export default class UI {
  constructor({ controls = baseControls } = {}) {
    this.controls = controls
    this.addUIControls(controls)
  }

  addUIControls(controls) {
    const div = document.createElement('div')
    div.className = 'controls'

    const closedTitle = 'CONTROLS &#9660;'
    const openTitle = 'CONTROLS &#9654;'

    const button = document.createElement('button')
    // button.className = 'rpgui-button'
    button.innerHTML = closedTitle

    const content = document.createElement('div')
    content.className = 'rpgui-container framed'
    content.innerHTML = Object.keys(controls).map(key =>
      `<p><b>${key}</b> ${controls[key]}</p>`
    ).join('')
    content.style.display = 'none'

    button.addEventListener('click', () => {
      content.style.display = content.style.display == 'none' ? 'block' : 'none'
      button.innerHTML = content.style.display == 'none' ? closedTitle : openTitle
    })

    div.appendChild(button)
    div.appendChild(content)
    document.body.appendChild(div)
  }

  addStartScreen({ title, innerHTML, callback, className = 'rpgui-container framed' } = {}) {
    const div = document.createElement('div')
    div.className = `central-screen pointer ${className}`
    if (title) div.innerHTML = `<h2>${title}</h2>`

    if (innerHTML) {
      const selectDiv = document.createElement('div')
      selectDiv.className = 'central-screen-select'
      selectDiv.innerHTML = innerHTML
      div.appendChild(selectDiv)
    }

    div.addEventListener('click', e => {
      if (callback) callback(e, div)
      else div.style.display = 'none'
    })

    document.body.appendChild(div)
  }
}