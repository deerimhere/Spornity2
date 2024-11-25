import { NextResponse } from 'next/server'
import axios from 'axios'

const NAVER_SEARCH_API_URL = 'https://openapi.naver.com/v1/search/news.json'
const CLIENT_ID = process.env.NAVER_CLIENT_ID
const CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query') || '스포츠'

  try {
    const response = await axios.get(NAVER_SEARCH_API_URL, {
      params: {
        query,
        display: 20,
        sort: 'date',
      },
      headers: {
        'X-Naver-Client-Id': CLIENT_ID,
        'X-Naver-Client-Secret': CLIENT_SECRET,
      },
    })

    const newsItems = response.data.items.map((item: any, index: number) => ({
      id: index,
      title: item.title.replace(/<\/?b>/g, ''),
      content: item.description.replace(/<\/?b>/g, ''),
      url: item.link,
      pubDate: item.pubDate,
    }))

    return NextResponse.json(newsItems)
  } catch (error) {
    console.error('Failed to fetch news:', error)
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 })
  }
}

