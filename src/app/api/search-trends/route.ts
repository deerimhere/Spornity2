import { NextResponse } from 'next/server'
import axios from 'axios'

const NAVER_API_URL = 'https://openapi.naver.com/v1/datalab/search'
const CLIENT_ID = process.env.NAVER_CLIENT_ID
const CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET

export async function GET() {
  try {
    const response = await axios.post(
      NAVER_API_URL,
      {
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        timeUnit: 'month',
        keywordGroups: [
          { groupName: '축구', keywords: ['축구', '월드컵', 'FIFA'] },
          { groupName: '야구', keywords: ['야구', 'MLB', 'KBO'] },
          { groupName: '농구', keywords: ['농구', 'NBA', 'KBL'] },
        ],
      },
      {
        headers: {
          'X-Naver-Client-Id': CLIENT_ID,
          'X-Naver-Client-Secret': CLIENT_SECRET,
          'Content-Type': 'application/json',
        },
      }
    )

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Failed to fetch search trends:', error)
    return NextResponse.json({ error: 'Failed to fetch search trends' }, { status: 500 })
  }
}

