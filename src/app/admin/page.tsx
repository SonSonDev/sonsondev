import { redirect } from 'next/navigation'
import { routes } from '@/routes'

export default function AdminPage() {
  redirect(routes.AdminPost)
}
