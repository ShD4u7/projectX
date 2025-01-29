import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { translations } from "../utils/translations"

export function SystemSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  const [language, setLanguage] = useState("ru")
  const [sessionTimeout, setSessionTimeout] = useState(30)

  const handleSave = () => {
    // Here you would typically save the settings to your backend
    console.log("Settings saved:", {
      emailNotifications,
      pushNotifications,
      darkMode,
      fontSize,
      language,
      sessionTimeout,
    })
  }

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <h1 className="text-3xl font-bold text-foreground">{translations.systemSettings.title}</h1>
      <Tabs defaultValue="notifications">
        <TabsList>
          <TabsTrigger value="notifications">{translations.systemSettings.notifications}</TabsTrigger>
          <TabsTrigger value="interface">{translations.systemSettings.interface}</TabsTrigger>
          <TabsTrigger value="security">{translations.systemSettings.security}</TabsTrigger>
          <TabsTrigger value="general">{translations.systemSettings.general}</TabsTrigger>
        </TabsList>
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>{translations.systemSettings.notificationSettings}</CardTitle>
              <CardDescription>{translations.systemSettings.notificationDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">{translations.systemSettings.emailNotifications}</Label>
                <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications">{translations.systemSettings.pushNotifications}</Label>
                <Switch id="push-notifications" checked={pushNotifications} onCheckedChange={setPushNotifications} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="interface">
          <Card>
            <CardHeader>
              <CardTitle>{translations.systemSettings.interfaceSettings}</CardTitle>
              <CardDescription>{translations.systemSettings.interfaceDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode">{translations.systemSettings.darkMode}</Label>
                <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="font-size">{translations.systemSettings.fontSize}</Label>
                <Slider
                  id="font-size"
                  min={12}
                  max={24}
                  step={1}
                  value={[fontSize]}
                  onValueChange={(value) => setFontSize(value[0])}
                />
                <p className="text-sm text-muted-foreground">{fontSize}px</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">{translations.systemSettings.language}</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder={translations.systemSettings.selectLanguage} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ru">{translations.systemSettings.russian}</SelectItem>
                    <SelectItem value="en">{translations.systemSettings.english}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>{translations.systemSettings.securitySettings}</CardTitle>
              <CardDescription>{translations.systemSettings.securityDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="session-timeout">{translations.systemSettings.sessionTimeout}</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="session-timeout"
                    type="number"
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(Number(e.target.value))}
                    className="w-20"
                  />
                  <span>{translations.systemSettings.minutes}</span>
                </div>
              </div>
              <Button variant="outline">{translations.systemSettings.changePassword}</Button>
              <Button variant="outline">{translations.systemSettings.enable2FA}</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>{translations.systemSettings.generalSettings}</CardTitle>
              <CardDescription>{translations.systemSettings.generalDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">{translations.systemSettings.timezone}</Label>
                <Select>
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder={translations.systemSettings.selectTimezone} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc+3">{translations.systemSettings.moscowTime}</SelectItem>
                    <SelectItem value="utc+0">{translations.systemSettings.utc}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date-format">{translations.systemSettings.dateFormat}</Label>
                <Select>
                  <SelectTrigger id="date-format">
                    <SelectValue placeholder={translations.systemSettings.selectDateFormat} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dd.mm.yyyy">DD.MM.YYYY</SelectItem>
                    <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Button onClick={handleSave}>{translations.systemSettings.saveChanges}</Button>
    </div>
  )
}

