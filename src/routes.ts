export const routes = {
  Home: '/',
  Posts: '/posts',
  Post: (slug: string) => `/post/${slug}`,
  Login: '/login',
  Admin: '/admin',
  AdminPosts: '/admin/posts',
  AdminNewPost: '/admin/posts/new',
  AdminEditPost: (id: string) => `/admin/posts/${id}/edit`,
} as const
