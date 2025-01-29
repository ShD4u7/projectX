import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { name: "Янв", total: 120000000 },
  { name: "Фев", total: 180000000 },
  { name: "Мар", total: 220000000 },
  { name: "Апр", total: 260000000 },
  { name: "Май", total: 320000000 },
  { name: "Июн", total: 380000000 },
  { name: "Июл", total: 420000000 },
]

export function SalesChart() {
  return (
    <ChartContainer
      config={{
        total: {
          label: "Продажи",
          color: "hsl(var(--primary))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `₸${(value / 1000000).toFixed(0)}M`}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Line type="monotone" dataKey="total" strokeWidth={2} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

