// Currently serve no purpose

import { XCircle } from 'lucide-react'
import GeneralPage from '@/components/layouts/general-page'

type CancelPageProps = {
  searchParams: Record<string, string | undefined>
}

export default function CancelPage({ searchParams }: CancelPageProps) {
  const sessionId = searchParams.session_id

  return (
    <GeneralPage
      title="Payment Cancelled"
      message="Your subscription or payment was not completed."
    >
      <XCircle className="mx-auto h-12 w-12 text-red-600" />
    </GeneralPage>
  )
}
