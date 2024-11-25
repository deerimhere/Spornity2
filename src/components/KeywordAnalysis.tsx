'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Keyword {
  word: string
  count: number
}

export default function KeywordAnalysis() {
  const [keywords, setKeywords] = useState<Keyword[]>([])

  useEffect(() => {
    fetchKeywords()
  }, [])

  const fetchKeywords = async () => {
    try {
      const response = await fetch('/api/analyze-keywords')
      const data = await response.json()
      setKeywords(data)
    } catch (error) {
      console.error('Failed to fetch keywords:', error)
    }
  }

  return (
    <Card className="bg-gray-800">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-blue-400">키워드 분석</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {keywords.map((keyword, index) => (
            <li key={index} className="flex justify-between items-center">
              <span className="text-gray-300">{keyword.word}</span>
              <span className="font-semibold text-blue-400">{keyword.count}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

