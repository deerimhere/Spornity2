'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase'
import Navigation from '@/components/Navigation'

interface Post {
  id: number
  title: string
  content: string
  created_at: string
  user_id: string
}

interface Comment {
  id: number
  content: string
  created_at: string
  user_id: string
}

export default function PostDetail() {
  const { id } = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    fetchPost()
    fetchComments()
    fetchUser()
  }, [id])

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching post:', error)
    } else {
      setPost(data)
    }
  }

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', id)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching comments:', error)
    } else {
      setComments(data || [])
    }
  }

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const { error } = await supabase.from('comments').insert({
      post_id: id,
      user_id: user.id,
      content: newComment,
    })

    if (error) {
      console.error('Error creating comment:', error)
    } else {
      setNewComment('')
      fetchComments()
    }
  }

  if (!post) return <div>Loading...</div>

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <header className="bg-gray-800 p-4">
        <h1 className="text-3xl font-bold text-center text-blue-400">Spornity</h1>
      </header>
      <Navigation />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="bg-gray-800 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-blue-400">{post.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">{post.content}</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-blue-400">댓글</CardTitle>
          </CardHeader>
          <CardContent>
            {comments.map((comment) => (
              <Card key={comment.id} className="mb-4 bg-gray-700">
                <CardContent className="p-4">
                  <p className="text-gray-300">{comment.content}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {new Date(comment.created_at).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))}

            {user && (
              <form onSubmit={handleCommentSubmit} className="mt-4">
                <Textarea
                  placeholder="댓글을 입력하세요"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                  className="bg-gray-700 text-gray-100 mb-2"
                />
                <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">댓글 작성</Button>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
      <footer className="bg-gray-800 p-4 text-center">
        <p>&copy; 2023 Spornity. All rights reserved.</p>
      </footer>
    </div>
  )
}

