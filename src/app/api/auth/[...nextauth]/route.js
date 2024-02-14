import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import { connect } from "../../../../../server/index.js"; 
import User from "../../../../../server/models/user.model.js";
import GoogleUser from "../../../../../server/models/googleUser.model.js";
import axios from 'axios'
import CredentialsProvider from "next-auth/providers/credentials";
import Post from "../../../../../server/models/post.model.js";

const authOptions = {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
      }),
      CredentialsProvider ({
        name:"Credentials",
        credentials: {
          username:{
            label: "Username:",
            type: "text",
            placeholder: "Enter your username"
          },
          password:{
            label: "Password:",
            type: "password",
            placeholder: "Enter your password"
          }
        },
        async authorize(credentials){
          // const user = await User.findOne({username : credentials.username});
          const data = {username: credentials?.username, password:credentials?.password}
          const user = await axios.post('http://localhost:8008/auth/login', data)
                                .then((res)=> console.log(res));
          // if (credentials?.username === res.data.username && credentials?.password === res.data.password ) return user;
          if(user)console.log('user found')
        else return null;
        },
      })
    ],
    session:{
      strategy: 'jwt'
    },
    secret:"vygcdrdre8798723cgfcdzty",
    callbacks: {
      async signIn({user, account}){
        const {email, name} = user;
        const data = {
          email,
          username:name
        }
        if(account.provider === 'google'){
          try {
            await connect()
            var id = '65ca066b915cad8a0fb22002'
             await GoogleUser.findById(id)
            .then((res) =>{
              console.log('this is the response')
            })
            if(!emailExists){
              console.log('email does not exist')
              const res = await axios.post('http://localhost:8008/user/googleUser', data)
              if(res.ok) {
                console.log(res, 'the response i am looking for')
                return user
              }
            }else console.log('this email exists')
          } catch (error) {
            console.log( 'the error i dont want')
          }
        }
        return user;
      }
    }
    
}
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
