import { translations } from "../utils/translations"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function CompanyHierarchy() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Структура компании</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Директор */}
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>МД</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{translations.hierarchy.founder}</div>
              <div className="text-sm text-muted-foreground">{translations.common.company}</div>
            </div>
          </div>

          {/* Отделы продаж */}
          <div className="ml-6 space-y-4">
            <div className="font-medium">{translations.hierarchy.salesDepartments}</div>
            <div className="ml-6 grid gap-4">
              {/* Пример отдела */}
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>РО</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">Руководитель отдела</div>
                    <div className="text-sm text-muted-foreground">Отдел продаж #1</div>
                  </div>
                </div>

                {/* Менеджеры и наставники */}
                <div className="ml-6 space-y-2">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>НС</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">Наставник</div>
                      <div className="text-sm text-muted-foreground">Старший менеджер</div>
                    </div>
                  </div>

                  {/* Стажеры */}
                  <div className="ml-6 space-y-2">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>СТ</AvatarFallback>
                      </Avatar>
                      <div className="font-medium text-sm">Стажер</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

