'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase'

export default function CreatePost() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: user } = await supabase.auth.getUser()
    if (!user) {
      console.error('User not logged in')
      return
    }

    const { error } = await supabase.from('posts').insert({
      title,
      content,
      user_id: user.id,
    })

    if (error) {
      console.error('Error creating post:', error)
    } else {
      setTitle('')
      setContent('')
      // TODO: Refresh post list or navigate to the new post
    }
  }

  return (
    <Card className="bg-gray-800">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-blue-400">새 게시글 작성</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="bg-gray-700 text-gray-100"
          />
          <Textarea
            placeholder="내용"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="bg-gray-700 text-gray-100"
          />
          <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">게시하기</Button>
        </form>
      </CardContent>
    </Card>
  )
}

