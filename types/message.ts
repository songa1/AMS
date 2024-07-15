import { User } from "./user";

export interface Message {
  id: string;
  message: string;
  sender: User;
  receiverId: string;
  receiver: User;
  senderId: string;
  createdAt: string;
}
