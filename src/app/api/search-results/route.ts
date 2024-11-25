import { NextResponse } from 'next/server'
import axios from 'axios'

const NAVER_SEARCH_API_URL = 'https://openapi.naver.com/v1/search/news.json'
const CLIENT_ID = process.env.NAVER_CLIENT_ID
const CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  try {
    const response = await axios.get(NAVER_SEARCH_API_URL, {
      params: {
        query,
        display: 10,
        sort: 'date',
      },
      headers: {
        'X-Naver-Client-Id': CLIENT_ID,
        'X-Naver-Client-Secret': CLIENT_SECRET,
      },
    })

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Failed to fetch search results:', error)
    return NextResponse.json({ error: 'Failed to fetch search results' }, { status: 500 })
  }
}

