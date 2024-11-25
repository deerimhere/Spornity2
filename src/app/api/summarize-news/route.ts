import { NextResponse } from 'next/server'
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export async function POST(req: Request) {
  try {
    const { content } = await req.json()
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that summarizes news articles." },
        { role: "user", content: `Summarize the following news article in 3 sentences:

${content}` }
      ],
    })

    const summary = completion.data.choices[0].message?.content

    return NextResponse.json({ summary })
  } catch (error) {
    console.error('Failed to summarize news:', error)
    return NextResponse.json({ error: 'Failed to summarize news' }, { status: 500 })
  }
}

