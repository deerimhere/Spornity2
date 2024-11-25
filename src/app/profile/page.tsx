'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'
import Navigation from '@/components/Navigation'

interface Profile {
  id: string
  username: string
  avatar_url: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [username, setUsername] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
      } else {
        setProfile(data)
        setUsername(data?.username || '')
      }
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, username })

      if (error) {
        console.error('Error updating profile:', error)
      } else {
        fetchProfile()
      }
    }
  }

  if (!profile) return <div>Loading...</div>

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <header className="bg-gray-800 p-4">
        <h1 className="text-3xl font-bold text-center text-blue-400">Spornity</h1>
      </header>
      <Navigation />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="bg-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-blue-400">프로필</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                  사용자 이름
                </label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-gray-700 text-gray-100"
                />
              </div>
              <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">프로필 업데이트</Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <footer className="bg-gray-800 p-4 text-center">
        <p>&copy; 2023 Spornity. All rights reserved.</p>
      </footer>
    </div>
  )
}

