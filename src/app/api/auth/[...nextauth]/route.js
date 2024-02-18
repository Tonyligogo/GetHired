import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import { connect } from "../../../../../server/index.js"; 
import User from "../../../../../server/models/user.model.js";
import GoogleUser from "../../../../../server/models/googleUser.model.js";
import axios from 'axios'
import CredentialsProvider from "next-auth/providers/credentials";
import Post from "../../../../../server/models/post.model.js";
import bcrypt from 'bcryptjs'
import server from '@/server.js'

export const authOptions = {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        // authorization: {
        //   params: {
        //     prompt: "consent",
        //     access_type: "offline",
        //     response_type: "code"
        //   }
        // }
      }),
      CredentialsProvider ({
        name:"credentials",
        credentials: {},
        async authorize(credentials){
          await connect(process.env.MONGO_URL)
          try {
            const user = await User.findOne({username : credentials.username});
            if(!user){
              console.log('user not found')
              return null;
            }
  
            const passwordMatch = await bcrypt.compare(credentials.password, user.password);
            if(!passwordMatch){
              return null;
            }
            return user;
          } catch (error) {
            console.log(error, 'from nextauth route js')
          }
        },
      })
    ],
    session:{
      strategy: 'jwt'
    },
    secret:process.env.NEXTAUTH_SECRET,
    pages:{
      signIn: "/login"
    },
    callbacks: {
      async signIn({user, account}){
        const {email, name, id} = user;
        const hash = bcrypt.hashSync(id, 5)
        const data = {
          email,
          username:name,
          password:hash
        }
        if(account.provider === 'google'){
          try {
            await connect(process.env.MONGO_URL)
            let user = await User.findOne({email})
            console.log(user)
            if(!user){
              console.log('email does not exist')
              // const res = await axios.post(`${server}auth/register`, data)
              user = User.create({
                username:data.username,
                email:data.email,
                password:data.password
              })
            };
            return user
          } catch (error) {
            console.log('Error from next auth route',error)
          }
        }
        return user;
      },
      async jwt({token, user, session, account}){
        if (account) {
          token.accessToken = account.access_token
        }
        if(user){
          //pass user id and username to token
          return{
            ...token,
            id: user._id,
            name: user.username,
          };
        };
        return token
      },
      async session({session, user, token}){
        const sessionUser = await User.findOne({email:session.user.email});
        session.accessToken = token.accessToken
        // session.user.id = sessionUser._id,
        // session.user.name = sessionUser.username
        // console.log({session, user, token})
        return{
          // pass in user id and username
          ...session,
          user:{
            ...session.user,
            id:token.id || sessionUser._id,
            name:token.username || sessionUser.username
          }
        }
      },
      
    }
    
}
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
