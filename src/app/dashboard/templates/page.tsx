import { createServerClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import { Mail, MessageSquare, Sparkles } from 'lucide-react'

export default async function TemplatesPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: userData } = await supabase
    .from('users').select('org_id').eq('id', user!.id).single()

  const { data: templates } = await supabase
    .from('message_templates')
    .select('*')
    .eq('org_id', userData?.org_id ?? '')
    .order('is_default', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Message Templates</h1>
          <p className="text-muted-foreground">Email and SMS templates for recovery sequences</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {!templates || templates.length === 0 ? (
          <Card className="sm:col-span-2">
            <CardContent className="py-8 text-center text-muted-foreground">
              No templates yet. Default templates will be created automatically.
            </CardContent>
          </Card>
        ) : (
          templates.map((template) => (
            <Card key={template.id}>
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="flex items-center gap-2">
                  {template.type === 'email'
                    ? <Mail className="w-4 h-4 text-muted-foreground" />
                    : <MessageSquare className="w-4 h-4 text-muted-foreground" />}
                  <CardTitle className="text-base">{template.name}</CardTitle>
                </div>
                <div className="flex gap-1">
                  {template.ai_enhanced && (
                    <Badge variant="secondary" className="gap-1">
                      <Sparkles className="w-3 h-3" />AI
                    </Badge>
                  )}
                  {template.is_default && <Badge variant="outline">Default</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {template.subject && (
                  <p className="text-sm font-medium">{template.subject}</p>
                )}
                <p className="text-sm text-muted-foreground line-clamp-2">{template.body}</p>
                <p className="text-xs text-muted-foreground">Updated {formatDate(template.updated_at)}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
