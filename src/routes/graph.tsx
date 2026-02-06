import Sankey from '@/components/Sankey'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/graph')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div className='flex-1 min-h-screen w-full bg-gray-100'>
        <Sankey />
    </div>
}
