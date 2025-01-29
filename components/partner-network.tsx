import { translations } from "../utils/translations"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileUp, Monitor, Image, Music, Grid, Video, Code, Printer, RotateCcw, Download } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export default function PartnerNetwork() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{translations.partner.title}</h1>
      </div>

      <div className="flex gap-4">
        <Button variant="outline">
          <FileUp className="mr-2 h-4 w-4" />
          {translations.partner.uploadPdf}
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <Image className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Monitor className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Grid className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Music className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Grid className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Code className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span>{translations.partner.dynamicContent}</span>
            <Switch />
          </div>
          <Button variant="default">{translations.partner.save}</Button>
        </div>
      </Card>

      <div className="flex gap-4">
        <Button variant="default">{translations.partner.addLesson}</Button>
        <Button variant="default">{translations.partner.addQuiz}</Button>
      </div>
    </div>
  )
}

