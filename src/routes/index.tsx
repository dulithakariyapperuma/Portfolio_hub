import { createFileRoute } from '@tanstack/react-router'
import { BrainInterface } from '../components/brain/BrainInterface'

export const Route = createFileRoute('/')({ component: BrainInterface })
