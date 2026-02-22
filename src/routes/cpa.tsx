import { ResultCalculation } from '@/pages/resultCalculation'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/cpa')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ResultCalculation />
}
