import { LearningD3 } from '@/components/learning-d3'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/learnD3')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div className='min-h-screen w-full bg-gray-100'>
        <LearningD3 />
    </div>
}
