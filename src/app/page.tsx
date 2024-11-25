import Navigation from '@/components/Navigation'
import NewsList from '@/components/NewsList'
import KeywordAnalysis from '@/components/KeywordAnalysis'
import TrendingTopics from '@/components/TrendingTopics'
import PostList from '@/components/PostList'
import CreatePost from '@/components/CreatePost'
import KakaoLogin from '@/components/KakaoLogin'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <header className="bg-gray-800 p-4">
        <h1 className="text-3xl font-bold text-center text-blue-400">Spornity</h1>
      </header>
      <Navigation />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <KakaoLogin />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">최신 뉴스</h2>
            <NewsList />
          </div>
          <div>
            <KeywordAnalysis />
            <div className="mt-8">
              <TrendingTopics />
            </div>
          </div>
        </div>
        <div className="mt-8">
          <CreatePost />
        </div>
        <div className="mt-8">
          <PostList />
        </div>
      </main>
      <footer className="bg-gray-800 p-4 text-center text-gray-400">
        <p>&copy; 2023 Spornity. All rights reserved.</p>
      </footer>
    </div>
  )
}

