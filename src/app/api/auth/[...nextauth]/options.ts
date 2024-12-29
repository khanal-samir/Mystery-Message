import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        // makes html form
        email: { label: "Email", type: "text", placeholder: "........" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              // indentifier may be email or username
              { email: credentials.indentifier },
              {
                username: credentials.indentifier,
              },
            ],
          });

          if (!user) {
            throw new Error("No user found with this email");
          }
          if (!user.isVerified) {
            throw new Error("Please verify your account");
          }
          const isPassCorrect = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (isPassCorrect) {
            return user;
          } else {
            throw new Error("Password is incorrect");
          }
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    //modify so not calling db often
    async session({ session, token }) {
      if (token) {
        if (token) {
          session.user._id = token._id;
          session.user.isVerified = token.isVerified;
          session.user.isAcceptingMessage = token.isAcceptingMessage;
          session.user.username = token.username;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      // user from providers
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username = user.username;
      }

      return token;
    },
  },
  pages: {
    signIn: "/sign-in", // designs frontend too
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
