import { useQuery } from "react-query";
import { useHttp } from "./http";

export interface User {
  id: number;
  name: string;
  email?: string;
  title?: string;
  organization?: string;
  token?: string;
}

export const useUsers = () => {
  const client = useHttp();
  return useQuery<User[]>(["users"], () => client(["users", {}]));
};
