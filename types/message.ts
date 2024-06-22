import { User } from "./user";

export interface Message {
  id: string;
  message: string;
  sender: User;
  senderId: string;
  createdAt: string;
}
