import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { text, apiKey } = await request.json()

    if (!text || !apiKey) {
      return NextResponse.json(
        { error: 'Missing text or API key' },
        { status: 400 }
      )
    }

   
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
     
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that summarizes GitHub repository descriptions. Provide a clear, concise 3-line summary that highlights the key features and purpose.',
          },
          {
            role: 'user',
            content: `Summarize this repository description in exactly 3 lines:\n\n${text}`,
          },
        ],
        // Temperature controls randomness (0 = focused, 2 = creative)
        temperature: 0.5,
        // Max tokens to keep the response concise
        max_tokens: 150,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Groq API error:', error)
      
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Invalid API key. Please check your Groq API key in settings.' },
          { status: 401 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to generate summary' },
        { status: response.status }
      )
    }

    const data = await response.json()

 
    const summary = data.choices[0]?.message?.content?.trim()

    if (!summary) {
      throw new Error('No summary generated')
    }

    return NextResponse.json({ summary })
  } catch (error) {
    console.error('Error in summarize API:', error)
    return NextResponse.json(
      {
        error: 'Failed to summarize',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

