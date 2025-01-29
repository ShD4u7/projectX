"use client"

import { useMediaQuery } from "react-responsive"
import { useState, useEffect } from "react"
import { useAuth } from "../../components/auth/AuthProvider"
import { ProtectedRoute } from "../../components/auth/protected-route"
import { Sidebar } from "../../components/sidebar"
import { updateProfile } from "firebase/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUserProfile, updateUserProfile } from "../../services/firebaseService"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { UserProfile } from "../../types/user"
import { translations } from "../../utils/translations"

const regions = [
  "Алматы",
  "Нур-Султан",
  "Шымкент",
  "Акмолинская область",
  "Актюбинская область",
  "Алматинская область",
  "Атырауская область",
  "Восточно-Казахстанская область",
  "Жамбылская область",
  "Западно-Казахстанская область",
  "Карагандинская область",
  "Костанайская область",
  "Кызылординская область",
  "Мангистауская область",
  "Павлодарская область",
  "Северо-Казахстанская область",
  "Туркестанская область",
]

export default function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile>({
    id: "",
    displayName: "",
    lastName: "",
    middleName: "",
    dateOfBirth: "",
    position: "",
    department: "",
    workPhone: "",
    personalPhone: "",
    email: "",
    hireDate: "",
    iin: "",
    address: "",
    city: "",
    region: "",
    education: "",
    languages: [],
    skills: [],
  })
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("personal")
  const isMobile = useMediaQuery({ maxWidth: 768 })

  useEffect(() => {
    if (user) {
      getUserProfile(user.uid).then((userProfile) => {
        if (userProfile) {
          setProfile(userProfile)
        } else {
          setProfile((prev) => ({ ...prev, email: user.email || "" }))
        }
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleArrayChange = (name: string, value: string) => {
    setProfile((prev) => ({ ...prev, [name]: value.split(",").map((item) => item.trim()) }))
  }

  const handleSave = async () => {
    if (user) {
      try {
        await updateUserProfile(user.uid, profile)
        await updateProfile(user, { displayName: profile.displayName })
        setIsEditing(false)
        setError(null)
      } catch (error) {
        setError("Не удалось обновить профиль. Пожалуйста, попробуйте еще раз.")
      }
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background">
        {!isMobile && <Sidebar />}
        <main className="flex-1 py-8 px-6">
          <div className="max-w-[800px] mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>{translations.profile.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {error && <p className="text-destructive mb-4">{error}</p>}
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profile.avatar} alt={profile.displayName} />
                    <AvatarFallback>{profile.displayName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{`${profile.lastName} ${profile.displayName} ${profile.middleName}`}</h2>
                    <p className="text-muted-foreground">{profile.position}</p>
                  </div>
                </div>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="personal">{translations.profile.personalInfo}</TabsTrigger>
                    <TabsTrigger value="work">{translations.profile.workInfo}</TabsTrigger>
                    <TabsTrigger value="additional">{translations.profile.additionalInfo}</TabsTrigger>
                  </TabsList>
                  <TabsContent value="personal">
                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="lastName">{translations.profile.lastName}</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={profile.lastName}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="displayName">{translations.profile.firstName}</Label>
                          <Input
                            id="displayName"
                            name="displayName"
                            value={profile.displayName}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="middleName">{translations.profile.middleName}</Label>
                        <Input
                          id="middleName"
                          name="middleName"
                          value={profile.middleName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="dateOfBirth">{translations.profile.dateOfBirth}</Label>
                        <Input
                          id="dateOfBirth"
                          name="dateOfBirth"
                          type="date"
                          value={profile.dateOfBirth}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="iin">{translations.profile.iin}</Label>
                        <Input
                          id="iin"
                          name="iin"
                          value={profile.iin}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="address">{translations.profile.address}</Label>
                        <Input
                          id="address"
                          name="address"
                          value={profile.address}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">{translations.profile.city}</Label>
                          <Input
                            id="city"
                            name="city"
                            value={profile.city}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="region">{translations.profile.region}</Label>
                          <Select
                            value={profile.region}
                            onValueChange={(value) => handleSelectChange("region", value)}
                            disabled={!isEditing}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={translations.profile.selectRegion} />
                            </SelectTrigger>
                            <SelectContent>
                              {regions.map((region) => (
                                <SelectItem key={region} value={region}>
                                  {region}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="work">
                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor="position">{translations.profile.position}</Label>
                        <Input
                          id="position"
                          name="position"
                          value={profile.position}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="department">{translations.profile.department}</Label>
                        <Input
                          id="department"
                          name="department"
                          value={profile.department}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="workPhone">{translations.profile.workPhone}</Label>
                        <Input
                          id="workPhone"
                          name="workPhone"
                          value={profile.workPhone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">{translations.profile.email}</Label>
                        <Input id="email" name="email" value={profile.email} disabled />
                      </div>
                      <div>
                        <Label htmlFor="hireDate">{translations.profile.hireDate}</Label>
                        <Input
                          id="hireDate"
                          name="hireDate"
                          type="date"
                          value={profile.hireDate}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="additional">
                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor="personalPhone">{translations.profile.personalPhone}</Label>
                        <Input
                          id="personalPhone"
                          name="personalPhone"
                          value={profile.personalPhone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="education">{translations.profile.education}</Label>
                        <Textarea
                          id="education"
                          name="education"
                          value={profile.education}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="languages">{translations.profile.languages}</Label>
                        <Input
                          id="languages"
                          name="languages"
                          value={profile.languages.join(", ")}
                          onChange={(e) => handleArrayChange("languages", e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="skills">{translations.profile.skills}</Label>
                        <Input
                          id="skills"
                          name="skills"
                          value={profile.skills.join(", ")}
                          onChange={(e) => handleArrayChange("skills", e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-end">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave} className="mr-2">
                      {translations.common.save}
                    </Button>
                    <Button onClick={() => setIsEditing(false)} variant="outline">
                      {translations.common.cancel}
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>{translations.profile.edit}</Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}

