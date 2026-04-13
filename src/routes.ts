export const routes = {
  Home: '/',
  PostList: '/post',
  Post: (slug: string) => `/post/${slug}`,
  Login: '/login',
  Admin: '/admin',
  AdminPost: '/admin/post',
  AdminNewPost: '/admin/post/new',
  AdminEditPost: (id: string) => `/admin/post/${id}/edit`,
} as const
