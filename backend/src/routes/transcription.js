import express from 'express'
import { pipeline } from '@xenova/transformers'

const router = express.Router()

let transcriber = null
let isInitialized = false

// Initialize Whisper model
async function initWhisper() {
  if (isInitialized) return transcriber
  
  try {
    console.log('Loading Whisper model on server...')
    transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-base')
    isInitialized = true
    console.log('Whisper model loaded successfully on server!')
    return transcriber
  } catch (error) {
    console.error('Failed to load Whisper model:', error)
    throw error
  }
}

// Health check
router.get('/status', async (req, res) => {
  res.json({ 
    status: isInitialized ? 'ready' : 'loading',
    model: 'whisper-base'
  })
})

// Transcribe audio chunk
router.post('/transcribe', async (req, res) => {
  try {
    if (!transcriber) {
      return res.status(503).json({ error: 'Transcription model not ready' })
    }

    const { audio, sampleRate } = req.body // base64 encoded audio
    if (!audio) {
      return res.status(400).json({ error: 'No audio provided' })
    }

    const audioBuffer = Buffer.from(audio, 'base64')
    
    // For WAV files, skip the header (44 bytes) and get the PCM data
    let pcmData
    if (audioBuffer.length > 44 && audioBuffer.toString('ascii', 0, 4) === 'RIFF') {
      pcmData = audioBuffer.slice(44)
    } else {
      pcmData = audioBuffer
    }
    
    // Convert Int16 PCM to Float32
    const float32Data = new Float32Array(pcmData.length / 2)
    const view = new DataView(pcmData.buffer, pcmData.byteOffset, pcmData.byteLength)
    for (let i = 0; i < float32Data.length; i++) {
      float32Data[i] = view.getInt16(i * 2, true) / 32768
    }
    
    const result = await transcriber(float32Data, {
      task: 'transcribe',
      language: 'en',
    })

    res.json({ 
      text: result.text || '',
      segments: result.segments || []
    })
  } catch (error) {
    console.error('Transcription error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Initialize on module load
initWhisper().catch(console.error)

export default router