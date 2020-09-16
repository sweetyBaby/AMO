let code = ''
let lastTime,
  nextTime,
  lastCode,
  nextCode

const scanEvent = (e, cb) => {
  nextCode = e.which
  nextTime = new Date().getTime()
  if (lastCode != null && lastTime != null && nextTime - lastTime <= 30) {
    code += String.fromCharCode(lastCode)
  } else if (lastCode != null && lastTime != null && nextTime - lastTime > 100) {
    code = ''
  }
  // else if ( nextCode > 64 && nextCode < 123){
  //   // console.info(222);
  //   code += String.fromCharCode(nextCode);
  // }

  lastCode = nextCode
  lastTime = nextTime
  // console.info('---',lastCode);
  if (e.which === 13) {
    cb(code)
    code = ''
  }
}

export { scanEvent }
