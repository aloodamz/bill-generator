// Tiny synthesized SFX via the Web Audio API — no audio assets, no deps.
let ctx = null

function getContext() {
  if (typeof window === 'undefined') return null
  try {
    ctx ??= new (window.AudioContext || window.webkitAudioContext)()
    if (ctx.state === 'suspended') ctx.resume()
    return ctx
  } catch {
    return null
  }
}

// Call synchronously inside a click handler — Safari requires the
// AudioContext to be created/resumed within a user-gesture call stack, and
// the sound calls elsewhere in this module fire from inside setTimeout
// chains that are too far removed from the original click.
export function primeAudio() {
  getContext()
}

function tone({ freq, duration, type = 'sine', gain = 0.05, delay = 0 }) {
  const audio = getContext()
  if (!audio) return
  const osc = audio.createOscillator()
  const amp = audio.createGain()
  osc.type = type
  osc.frequency.value = freq
  amp.gain.value = 0
  osc.connect(amp)
  amp.connect(audio.destination)
  const start = audio.currentTime + delay
  amp.gain.setValueAtTime(0, start)
  amp.gain.linearRampToValueAtTime(gain, start + 0.01)
  amp.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  osc.start(start)
  osc.stop(start + duration + 0.02)
}

export function playPaymentSuccess() {
  tone({ freq: 880, duration: 0.09, type: 'sine', gain: 0.06 })
  tone({ freq: 1320, duration: 0.14, type: 'sine', gain: 0.06, delay: 0.09 })
}

export function playPrinterBuzz(durationSec = 1.4) {
  const audio = getContext()
  if (!audio) return
  const bufferSize = Math.floor(audio.sampleRate * durationSec)
  const buffer = audio.createBuffer(1, bufferSize, audio.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.5
  }
  const noise = audio.createBufferSource()
  noise.buffer = buffer

  const bandpass = audio.createBiquadFilter()
  bandpass.type = 'bandpass'
  bandpass.frequency.value = 220
  bandpass.Q.value = 0.9

  const amp = audio.createGain()
  const now = audio.currentTime
  amp.gain.setValueAtTime(0.05, now)
  amp.gain.setValueAtTime(0.05, now + durationSec - 0.15)
  amp.gain.linearRampToValueAtTime(0, now + durationSec)

  noise.connect(bandpass)
  bandpass.connect(amp)
  amp.connect(audio.destination)
  noise.start(now)
  noise.stop(now + durationSec)
}

export function playTap() {
  tone({ freq: 520, duration: 0.05, type: 'square', gain: 0.03 })
}
