import { Message } from "@/model/User";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean; // doesnt need in signup so optional
  messages?: Array<Message>; // for dashboard
}
