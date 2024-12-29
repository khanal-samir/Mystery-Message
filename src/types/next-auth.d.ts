import "next-auth";
import { DefaultSession } from "next-auth";
//adding type saftey in  package
declare module "next-auth" {
  interface User {
    //user
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessage?: boolean;
    username?: string;
  }
  interface Session {
    user: {
      //session
      _id?: string;
      isVerified?: boolean;
      isAcceptingMessage?: boolean;
      username?: string;
    } & DefaultSession["user"]; // there should be user key to prevent user
  }
}
declare module "next-auth/jwt" {
  //token
  interface JWT {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessage?: boolean;
    username?: string;
  }
}
