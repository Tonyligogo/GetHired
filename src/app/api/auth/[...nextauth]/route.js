import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
      CredentialsProvider ({
        name:"credentials",
        credentials: {},
        async authorize(credentials){
          const authResponse = await fetch('http://localhost:8008/auth/login', {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials),
          })
  
          if (!authResponse.ok) {
            return null
          }
  
          const user = await authResponse.json()
  
          return user
        },
      })
    ],
    session:{
      strategy: 'jwt',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret:process.env.NEXTAUTH_SECRET,
    pages:{
      signIn: "/login"
    },
    callbacks: {
      async jwt({token, user, session, account}){
        
        if (account) {
          token.accessToken = account.access_token
        }
        if(user){
          //pass user id and username to token
          return{
            ...token,
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            niche: user.niche
          };
        };
        return token
      },
      async session({session, user, token}){
        session.accessToken = token.accessToken
        return{
          // pass in user id and username
          ...session,
          user:{
            ...session.user,
            id:token.id,
            firstName:token.firstName,
            lastName:token.lastName,
            role:token.role,
            niche:token.niche
          }
        }
      },
      
    }
    
}
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
