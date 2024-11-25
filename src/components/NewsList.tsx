'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import NewsSummary from './NewsSummary'

interface NewsItem {
  id: number
  title: string
  content: string
  url: string
  pubDate: string
}

export default function NewsList() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [summary, setSummary] = useState<string>('')

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/crawl-news')
      const data = await response.json()
      setNews(data)
    } catch (error) {
      console.error('Failed to fetch news:', error)
    }
  }

  const summarizeNews = async (newsItem: NewsItem) => {
    setSelectedNews(newsItem)
    try {
      const response = await fetch('/api/summarize-news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newsItem.content }),
      })
      const data = await response.json()
      setSummary(data.summary)
    } catch (error) {
      console.error('Failed to summarize news:', error)
    }
  }

  return (
    <div className="space-y-4">
      {news.map((item) => (
        <Card key={item.id} className="bg-gray-800 hover:bg-gray-700 transition-colors duration-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-blue-400">
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {item.title}
              </a>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-2">{item.content}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">
                {new Date(item.pubDate).toLocaleDateString()}
              </span>
              <Button onClick={() => summarizeNews(item)} className="bg-blue-500 hover:bg-blue-600">요약</Button>
            </div>
          </CardContent>
        </Card>
      ))}
      {selectedNews && summary && (
        <NewsSummary summary={summary} />
      )}
    </div>
  )
}

