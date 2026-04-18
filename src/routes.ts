export const routes = {
  Home: '/',
  PostList: '/post',
  TodoList: '/todo',
  Post: (slug: string) => `/post/${slug}`,
  Login: '/login',
  Admin: '/admin',
  AdminPost: '/admin/post',
  AdminTag: '/admin/tag',
  AdminNewPost: '/admin/post/new',
  AdminEditPost: (id: string) => `/admin/post/edit?id=${id}`,
  AdminViewPost: (id: string) => `/admin/post/view?id=${id}`,
  AdminMedia: '/admin/media',
} as const
