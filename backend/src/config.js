import dotenv from 'dotenv'
dotenv.config()

export const config = {
  minimaxApiKey: process.env.MINIMAX_API_KEY || '',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  googleApiKey: process.env.GOOGLE_API_KEY || '',
  nodeEnv: process.env.NODE_ENV || 'development'
}

export const AI_PROVIDERS = {
  minimax: {
    name: 'MiniMax',
    enabled: !!config.minimaxApiKey,
    icon: '🔵'
  },
  openai: {
    name: 'OpenAI',
    enabled: !!config.openaiApiKey,
    icon: '🟢'
  },
  anthropic: {
    name: 'Claude',
    enabled: !!config.anthropicApiKey,
    icon: '🟠'
  },
  google: {
    name: 'Gemini',
    enabled: !!config.googleApiKey,
    icon: '🔴'
  }
}