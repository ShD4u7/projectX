import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  {
    name: "Продажи",
    total: 85,
  },
  {
    name: "Обслуживание клиентов",
    total: 78,
  },
  {
    name: "Знание продукта",
    total: 92,
  },
  {
    name: "Коммуникация",
    total: 88,
  },
  {
    name: "Работа в команде",
    total: 95,
  },
  {
    name: "Знание рынка Казахстана",
    total: 82,
  },
]

export function PerformanceChart() {
  return (
    <ChartContainer
      config={{
        total: {
          label: "Оценка",
          color: "hsl(var(--primary))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

