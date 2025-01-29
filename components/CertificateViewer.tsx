import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { translations } from "../utils/translations"
import { Award, Download } from "lucide-react"

interface CertificateViewerProps {
  certification: {
    title: string
    id: string
  }
}

export function CertificateViewer({ certification }: CertificateViewerProps) {
  const currentDate = new Date().toLocaleDateString()

  const handleDownload = () => {
    // Implement certificate download logic here
    console.log("Downloading certificate...")
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">{translations.certification.certificateOfCompletion}</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <Award className="w-24 h-24 mx-auto text-primary" />
        <h2 className="text-2xl font-bold">{certification.title}</h2>
        <p>{translations.certification.awardedTo}</p>
        <p className="text-xl font-semibold">[User Name]</p>
        <p>{translations.certification.completionDate.replace("{date}", currentDate)}</p>
        <p className="text-sm text-muted-foreground">
          {translations.certification.certificateId.replace("{id}", certification.id)}
        </p>
        <Button onClick={handleDownload}>
          <Download className="w-4 h-4 mr-2" />
          {translations.certification.downloadCertificate}
        </Button>
      </CardContent>
    </Card>
  )
}

