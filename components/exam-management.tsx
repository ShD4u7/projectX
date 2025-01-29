import { translations } from "../utils/translations"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { CheckSquare, CircleDot, FileText, ThumbsUp, Upload, Video, Volume2, Star, BarChart3 } from "lucide-react"
import { theme } from "../styles/theme"

export function ExamManagement() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{translations.examManagement.title}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">{translations.examManagement.description}</p>
      </div>

      <div className="flex justify-between items-center">
        <Button variant="default" style={{ backgroundColor: theme.colors.primary }}>
          {translations.examManagement.selectContent}
        </Button>
        <div className="flex items-center gap-4">
          <span className="text-gray-700 dark:text-gray-300">{translations.examManagement.manualWeighting}</span>
          <Switch />
          <span className="text-gray-700 dark:text-gray-300">
            {translations.examManagement.totalWeight.replace("{weight}", "100")}
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-2">{translations.examManagement.smmTools}</h3>
            <p className="text-gray-600 dark:text-gray-400">Описание SMM инструментов и их применения</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-2">{translations.examManagement.specificActions}</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Конкретные действия для улучшения клиентоориентированности
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-2">{translations.examManagement.smmToolsTesting}</h3>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-gray-700 dark:text-gray-300">{translations.examManagement.weight}: 50%</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-700 dark:text-gray-300">{translations.examManagement.shuffleQuestions}</span>
                <Switch />
              </div>
              <span className="text-gray-700 dark:text-gray-300">
                {translations.examManagement.display}: 100 из 100 вопросов
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-2">{translations.examManagement.serviceStandards}</h3>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-700 dark:text-gray-300">{translations.examManagement.shuffleQuestions}</span>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Добавить вопрос</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>{translations.examManagement.questionTypes.title}</DialogTitle>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-4">
              <h3 className="font-medium">{translations.examManagement.questionTypes.basic}</h3>
              <Button variant="outline" className="w-full justify-start">
                <CheckSquare className="mr-2 h-4 w-4" style={{ color: theme.colors.primary }} />
                {translations.examManagement.questionTypes.multipleChoice}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CircleDot className="mr-2 h-4 w-4" style={{ color: theme.colors.primary }} />
                {translations.examManagement.questionTypes.oneChoice}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" style={{ color: theme.colors.primary }} />
                {translations.examManagement.questionTypes.writtenAnswer}
              </Button>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium">{translations.examManagement.questionTypes.advanced}</h3>
              <Button variant="outline" className="w-full justify-start">
                <ThumbsUp className="mr-2 h-4 w-4" style={{ color: theme.colors.secondary }} />
                {translations.examManagement.questionTypes.yesNo}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="mr-2 h-4 w-4" style={{ color: theme.colors.secondary }} />
                {translations.examManagement.questionTypes.nps}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Star className="mr-2 h-4 w-4" style={{ color: theme.colors.secondary }} />
                {translations.examManagement.questionTypes.rate}
              </Button>
            </div>
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Upload className="mr-2 h-4 w-4" style={{ color: theme.colors.accent }} />
                {translations.examManagement.questionTypes.fileUpload}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Video className="mr-2 h-4 w-4" style={{ color: theme.colors.accent }} />
                {translations.examManagement.questionTypes.video}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Volume2 className="mr-2 h-4 w-4" style={{ color: theme.colors.accent }} />
                {translations.examManagement.questionTypes.audio}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

