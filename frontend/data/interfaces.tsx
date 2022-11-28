export interface UserInterface {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  about: string;
  birth_date: string;
  hometown: string;
  present_location: string;
  website: string;
  gender: string;
  interests: string;
  avatar: string;
  is_moderator: boolean;
  is_administrator: boolean;
  is_banned: boolean;
  password: string;
}

export interface LoggedUser {
  user: UserInterface;
  token: string;
}

export interface Topic {
  id: number;
  author: number;
  title: string;
}

export interface Board {
  id: number;
  author: number;
  title: string;
  topic: number;
  description: string;
  // URL to image
  image: string;
  threads_count: number;
  posts_count: number;
}

export interface Thread {
  id: number;
  author: number;
  title: string;
  board: number;
  is_locked: boolean;
  is_sticky: boolean;
  last_reply_date: string | null;
  last_reply_poster_name: string | null;
  last_reply_poster_id: number | null;
}

export interface Post {
  id: number;
  author: number;
  author_name: string;
  author_avatar: string;
  thread: number;
  created_at: string;
  message: string;
}

export interface PostsResponse {
  count: number;
  next: string | null;
  previous?: string | null;
  results: Post[] | null;
}

export interface ThreadsResponse {
  count: number;
  next: string | null;
  previous?: string | null;
  results: Thread[] | null;
}

export interface BoardFormInterface {
  title: string;
  description: string;
  topic: number;
  image: string;
}
