'use client'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { TrendingUpIcon, TrendingDownIcon, MinusIcon } from 'lucide-react'

export interface MetricCardData {
  title: string
  value: string
  trend?: 'up' | 'down' | 'neutral'
  trendLabel?: string
  description?: string
}

interface SectionCardsProps {
  metrics: MetricCardData[]
  className?: string
  cardSize?: 'default' | 'sm' | 'lg'
}

export function SectionCards({ metrics, className, cardSize = 'default' }: SectionCardsProps) {
  return (
    <div className={cn('flex flex-row gap-4 items-start', className)}>
      {metrics.map((m, i) => (
        <Card
          key={i}
          size={cardSize}
          className="@container/card flex-1 min-w-0"
          style={{ paddingBottom: 0 }}
        >
          <CardHeader>
            <CardDescription>{m.title}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {m.value}
            </CardTitle>
            {m.trend && (
              <CardAction>
                <Badge variant="outline">
                  {m.trend === 'up' ? (
                    <TrendingUpIcon />
                  ) : m.trend === 'down' ? (
                    <TrendingDownIcon />
                  ) : (
                    <MinusIcon />
                  )}
                  {m.trendLabel}
                </Badge>
              </CardAction>
            )}
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            {m.description && (
              <div className="line-clamp-1 flex gap-2 font-medium">{m.description}</div>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
