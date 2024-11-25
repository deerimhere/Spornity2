import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SearchResult {
  title: string
  link: string
  description: string
  pubDate: string
}

interface SearchResultsProps {
  results: SearchResult[]
}

export default function SearchResults({ results }: SearchResultsProps) {
  return (
    <div className="space-y-4">
      {results.map((result, index) => (
        <Card key={index} className="bg-gray-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              <a href={result.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                {result.title.replace(/<\/?b>/g, '')}
              </a>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">{result.description.replace(/<\/?b>/g, '')}</p>
            <p className="text-sm text-gray-400 mt-2">{new Date(result.pubDate).toLocaleDateString()}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

