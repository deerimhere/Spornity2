'use client'

import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

export default function KakaoLogin() {
  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
      })
      if (error) throw error
    } catch (error) {
      console.error('Error logging in:', error)
    }
  }

  return (
    <Button onClick={handleLogin} className="bg-yellow-400 text-black hover:bg-yellow-500">
      Kakao로 로그인
    </Button>
  )
}

