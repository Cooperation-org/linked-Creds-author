import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { setCookie } from '../../../utils/cookie'

declare module 'next-auth' {
  interface Session {
    accessToken?: string
    refreshToken?: string
    expires?: number
    error?: string
    user?: {
      id?: string
      name?: string
      email?: string
      image?: string
    }
  }

  interface Token {
    accessToken?: string
    refreshToken?: string
    expires?: number
    error?: string
    user?: {
      id?: string
      name?: string
      email?: string
      image?: string
    }
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          scope:
            'openid email profile https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.appdata',
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      // Initial sign-in
      if (account && user) {
        const accessToken = account.access_token
        const refreshToken = account.refresh_token

        setCookie('accessToken', accessToken as string, { expires: 60 * 60 * 24 * 30 }) // Expire in 30 days
        setCookie('refreshToken', refreshToken as string, { expires: 60 * 60 * 24 * 30 })

        return {
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expires: Date.now() + (account.expires_in as number) * 1000,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image
          }
        }
      }

      // Return previous token if the access token has not expired yet

      if (
        token.expires &&
        typeof token.expires === 'number' &&
        Date.now() < token.expires
      ) {
        return token
      }

      //if the Access token has expired
      return await refreshAccessToken(token)
    },
    async session({ session, token }: { session: any; token: any }) {
      if (typeof token.accessToken === 'string') {
        session.accessToken = token.accessToken
      }
      if (typeof token.refreshToken === 'string') {
        session.refreshToken = token.refreshToken
      }
      if (typeof token.expires === 'number') {
        session.expires = token.expires
      }
      if (typeof token.error === 'string') {
        session.error = token.error
      }
      session.user = token.user

      return session
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 7, // 2 days
    updateAge: 60 * 60 * 24 // 1 day
  }
})

async function refreshAccessToken(token: any) {
  try {
    const url = 'https://oauth2.googleapis.com/token'

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '',
        client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET ?? '',
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken
      })
    })

    const refreshedTokens = await response.json()
    console.log(':  refreshAccessToken  refreshedTokens', refreshedTokens)

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      expires: Date.now() + refreshedTokens.expires_in * 1000,
      // If no new refresh token is returned, keep the old one
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken
    }
  } catch (error) {
    console.error('Error refreshing access token', error)

    return {
      ...token,
      error: 'RefreshAccessTokenError'
    }
  }
}

export { handler as GET, handler as POST }
