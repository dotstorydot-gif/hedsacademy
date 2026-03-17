'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Loader2, Upload, X, Plus, Globe, Github, Twitter, Linkedin, Save } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function InstructorProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [fullName, setFullName] = useState('')
  const [title, setTitle] = useState('')
  const [bio, setBio] = useState('')
  const [expertise, setExpertise] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [socialLinks, setSocialLinks] = useState<any>({
    website: '',
    github: '',
    twitter: '',
    linkedin: ''
  })

  const supabase = createClient()

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profile) {
          setUser(profile)
          setFullName(profile.full_name || '')
          setTitle(profile.title || '')
          setBio(profile.bio || '')
          setExpertise(profile.expertise || [])
          setAvatarUrl(profile.avatar_url || '')
          setSocialLinks({
            website: profile.social_links?.website || '',
            github: profile.social_links?.github || '',
            twitter: profile.social_links?.twitter || '',
            linkedin: profile.social_links?.linkedin || ''
          })
        }
      }
      setLoading(false)
    }

    fetchProfile()
  }, [supabase])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('course-media')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('course-media')
        .getPublicUrl(filePath)

      setAvatarUrl(publicUrl)
      toast.success('Avatar uploaded successfully')
    } catch (error: any) {
      toast.error('Error uploading avatar: ' + error.message)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: fullName,
          title: title,
          bio: bio,
          expertise: expertise,
          avatar_url: avatarUrl,
          social_links: socialLinks,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error
      toast.success('Profile updated successfully')
    } catch (error: any) {
      toast.error('Error updating profile: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const addTag = () => {
    if (newTag && !expertise.includes(newTag)) {
      setExpertise([...expertise, newTag])
      setNewTag('')
    }
  }

  const removeTag = (tag: string) => {
    setExpertise(expertise.filter(t => t !== tag))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Instructor Profile</h2>
          <p className="text-muted-foreground">Manage your public identity and instructor credentials.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground">
          {saving ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Basic Info */}
        <div className="md:col-span-1 space-y-6">
          <Card className="border-2">
            <CardHeader className="text-center">
              <div className="relative group mx-auto w-32 h-32 mb-4">
                <Avatar className="w-full h-full border-4 border-muted shadow-xl cursor-pointer">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="text-4xl font-bold bg-primary/10 text-primary">
                    {fullName?.charAt(0) || user?.email?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Label htmlFor="avatar-upload" className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Upload className="size-6" />
                </Label>
                <Input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </div>
              <CardTitle className="text-xl">{fullName || 'Assign Name'}</CardTitle>
              <CardDescription className="italic font-medium text-primary">{title || 'Instructor Title'}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Sarah Johnson" />
              </div>
              <div className="space-y-2">
                <Label>Current Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Reactor Engineer" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg">Expertise & Skills</CardTitle>
              <CardDescription>Tags shown on your public profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {expertise.map(tag => (
                  <Badge key={tag} variant="secondary" className="px-3 py-1 bg-primary/5 text-primary border-primary/20 flex items-center gap-2">
                    {tag}
                    <X className="size-3 cursor-pointer hover:text-destructive" onClick={() => removeTag(tag)} />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Add skill..." onKeyPress={(e) => e.key === 'Enter' && addTag()} />
                <Button size="icon" variant="outline" onClick={addTag}><Plus className="size-4" /></Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Bio & Social */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-2 shadow-sm min-h-[400px]">
            <CardHeader>
              <CardTitle className="text-xl">Biography</CardTitle>
              <CardDescription>Tell your students about your experience and background</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                value={bio} 
                onChange={(e) => setBio(e.target.value)} 
                placeholder="Write a professional bio..." 
                className="min-h-[250px] resize-none text-base leading-relaxed"
              />
            </CardContent>
          </Card>

          <Card className="border-2 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Social Platforms</CardTitle>
              <CardDescription>Connect with students outside the classroom</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 font-bold"><Globe className="size-4" /> Personal Website</Label>
                <Input 
                  value={socialLinks.website} 
                  onChange={(e) => setSocialLinks({...socialLinks, website: e.target.value})} 
                  placeholder="https://sarah.io" 
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 font-bold"><Linkedin className="size-4" /> LinkedIn</Label>
                <Input 
                  value={socialLinks.linkedin} 
                  onChange={(e) => setSocialLinks({...socialLinks, linkedin: e.target.value})} 
                  placeholder="linkedin.com/in/sarah" 
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 font-bold"><Twitter className="size-4" /> Twitter / X</Label>
                <Input 
                  value={socialLinks.twitter} 
                  onChange={(e) => setSocialLinks({...socialLinks, twitter: e.target.value})} 
                  placeholder="twitter.com/sarahcodes" 
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 font-bold"><Github className="size-4" /> GitHub</Label>
                <Input 
                  value={socialLinks.github} 
                  onChange={(e) => setSocialLinks({...socialLinks, github: e.target.value})} 
                  placeholder="github.com/sarahj" 
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
