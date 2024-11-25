import { NextResponse } from 'next/server'
import axios from 'axios'
import cheerio from 'cheerio'
import natural from 'natural'

export async function GET() {
  try {
    const response = await axios.get('https://example-news-site.com')
    const $ = cheerio.load(response.data)
    
    const text = $('body').text()
    const tokenizer = new natural.WordTokenizer()
    const tokens = tokenizer.tokenize(text)

    const stopwords = ['the', 'a', 'an', 'in', 'on', 'at', 'for', 'to', 'of', 'and', 'or', 'but']
    const filteredTokens = tokens.filter(token => !stopwords.includes(token.toLowerCase()))

    const frequencyDist = new natural.FrequencyDist(filteredTokens)
    const keywords = frequencyDist.getKeyValuePairs()
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }))

    return NextResponse.json(keywords)
  } catch (error) {
    console.error('Failed to analyze keywords:', error)
    return NextResponse.json({ error: 'Failed to analyze keywords' }, { status: 500 })
  }
}

