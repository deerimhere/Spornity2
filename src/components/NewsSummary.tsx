import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface NewsSummaryProps {
  summary: string
}

export default function NewsSummary({ summary }: NewsSummaryProps) {
  return (
    <Card className="bg-gray-800">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-blue-400">뉴스 요약</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300">{summary}</p>
      </CardContent>
    </Card>
  )
}

