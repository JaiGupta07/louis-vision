import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { imageBase64 } = req.body
  if (!imageBase64) {
    return res.status(400).json({ error: 'Missing imageBase64' })
  }

  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 150,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: imageBase64,
              },
            },
            {
              type: 'text',
              text: 'You are describing a scene for a blind user in 1–2 short spoken sentences. Be concrete and useful: what\'s directly ahead, obstacles, people, doorways, text on signs. No preamble, no "I see". Just the description.',
            },
          ],
        },
      ],
    })

    const description = message.content[0].text
    res.status(200).json({ description })
  } catch (err) {
    console.error(`Claude API error ${err.status}: ${err.message}`)
    res.status(500).json({ error: 'Failed to get description' })
  }
}
