import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { translations } from "../utils/translations"
import { FileText, Link, Video } from "lucide-react"

interface Material {
  type: "video" | "document" | "link"
  title: string
  url: string
}

interface AdditionalMaterialsProps {
  materials: Material[]
}

export function AdditionalMaterials({ materials }: AdditionalMaterialsProps) {
  const getIcon = (type: Material["type"]) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4" />
      case "document":
        return <FileText className="w-4 h-4" />
      case "link":
        return <Link className="w-4 h-4" />
    }
  }

  if (!materials || materials.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{translations.onboarding.additionalMaterials.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {materials.map((material, index) => (
            <li key={index}>
              <Button variant="outline" asChild className="w-full justify-start">
                <a href={material.url} target="_blank" rel="noopener noreferrer">
                  {getIcon(material.type)}
                  <span className="ml-2">{material.title}</span>
                </a>
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

