'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Post {
  id: number
  title: string
  content: string
  created_at: string
  user_id: string
}

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [user, setUser] = useState<any>(null)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [page, setPage] = useState(1)
  const postsPerPage = 5

  useEffect(() => {
    fetchPosts()
    fetchUser()
  }, [page])

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .range((page - 1) * postsPerPage, page * postsPerPage - 1)

    if (error) {
      console.error('Error fetching posts:', error)
    } else {
      setPosts(data || [])
    }
  }

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  const handleEdit = (post: Post) => {
    setEditingPost(post)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPost) return

    const { error } = await supabase
      .from('posts')
      .update({ title: editingPost.title, content: editingPost.content })
      .eq('id', editingPost.id)

    if (error) {
      console.error('Error updating post:', error)
    } else {
      setEditingPost(null)
      fetchPosts()
    }
  }

  const handleDelete = async (id: number) => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting post:', error)
    } else {
      fetchPosts()
    }
  }

  return (
    <Card className="bg-gray-800">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-blue-400">커뮤니티 게시글</CardTitle>
      </CardHeader>
      <CardContent>
        {posts.map((post) => (
          <Card key={post.id} className="mb-4 bg-gray-700">
            <CardHeader>
              <CardTitle>
                <Link href={`/posts/${post.id}`} className="text-blue-400 hover:underline">
                  {post.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">{post.content.substring(0, 100)}...</p>
              {user && user.id === post.user_id && (
                <div className="mt-2">
                  <Button onClick={() => handleEdit(post)} className="mr-2 bg-blue-500 hover:bg-blue-600">수정</Button>
                  <Button onClick={() => handleDelete(post.id)} variant="destructive">삭제</Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {editingPost && (
          <form onSubmit={handleUpdate} className="mt-4">
            <Input
              value={editingPost.title}
              onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
              className="mb-2 bg-gray-700 text-gray-100"
            />
            <Textarea
              value={editingPost.content}
              onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
              className="mb-2 bg-gray-700 text-gray-100"
            />
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600">수정 완료</Button>
          </form>
        )}

        <div className="flex justify-between mt-4">
          <Button onClick={() => setPage(page - 1)} disabled={page === 1} className="bg-blue-500 hover:bg-blue-600">이전</Button>
          <Button onClick={() => setPage(page + 1)} className="bg-blue-500 hover:bg-blue-600">다음</Button>
        </div>
      </CardContent>
    </Card>
  )
}

