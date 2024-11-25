'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import SearchResults from './SearchResults'

interface TrendData {
  period: string
  ratio: number
}

interface Trend {
  title: string
  data: TrendData[]
}

interface SearchResult {
  title: string
  link: string
  description: string
  pubDate: string
}

export default function TrendingTopics() {
  const [trends, setTrends] = useState<Trend[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTrend, setSelectedTrend] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])

  useEffect(() => {
    fetchTrends()
  }, [])

  const fetchTrends = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/search-trends')
      if (!response.ok) {
        throw new Error('Failed to fetch trends')
      }
      const data = await response.json()
      const formattedTrends = data.results.map((result: any) => ({
        title: result.title,
        data: result.data,
      }))
      setTrends(formattedTrends)
    } catch (err) {
      setError('Failed to load trending topics')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSearchResults = async (query: string) => {
    try {
      const response = await fetch(`/api/search-results?query=${encodeURIComponent(query)}`)
      if (!response.ok) {
        throw new Error('Failed to fetch search results')
      }
      const data = await response.json()
      setSearchResults(data.items)
    } catch (err) {
      console.error('Failed to fetch search results:', err)
      setSearchResults([])
    }
  }

  const handleTrendClick = (trend: string) => {
    setSelectedTrend(trend)
    fetchSearchResults(trend)
  }

  if (isLoading) {
    return <div className="text-center text-gray-400">Loading trending topics...</div>
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  return (
    <Card className="bg-gray-800">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-blue-400">트렌딩 토픽</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trends[0]?.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="period" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
            <Legend />
            {trends.map((trend, index) => (
              <Line
                key={trend.title}
                type="monotone"
                dataKey="ratio"
                data={trend.data}
                name={trend.title}
                stroke={`hsl(${index * 120}, 70%, 50%)`}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 flex flex-wrap gap-2">
          {trends.map((trend) => (
            <Dialog key={trend.title}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
                  onClick={() => handleTrendClick(trend.title)}
                >
                  {trend.title}
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 text-gray-100">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-blue-400">{trend.title} 검색 결과</DialogTitle>
                </DialogHeader>
                <SearchResults results={searchResults} />
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

