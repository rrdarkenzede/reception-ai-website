import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Trash2, Edit2 } from 'lucide-react'
import { toast } from 'sonner'

interface KnowledgeItem {
  id: string
  question: string
  answer: string
  category: string | null
  is_active: boolean
}

export function KnowledgeBaseEditor({ profileId }: { profileId: string }) {
  const [items, setItems] = useState<KnowledgeItem[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'qa',
    is_active: true,
  })

  useEffect(() => {
    fetchItems()
  }, [profileId])

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .eq('profile_id', profileId)
        .order('created_at', { ascending: false })

      if (error) throw error
      if (data) setItems(data as KnowledgeItem[])
    } catch (error) {
      console.error('Error fetching knowledge base:', error)
      toast.error('Erreur lors du chargement')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingId) {
        const { error } = await supabase
          .from('knowledge_base')
          .update(formData)
          .eq('id', editingId)

        if (error) throw error
        toast.success('Question mise à jour')
      } else {
        const { error } = await supabase
          .from('knowledge_base')
          .insert([{ ...formData, profile_id: profileId }])

        if (error) throw error
        toast.success('Question ajoutée')
      }

      setFormData({ question: '', answer: '', category: 'qa', is_active: true })
      setEditingId(null)
      fetchItems()
    } catch (error) {
      console.error('Error saving knowledge base item:', error)
      toast.error('Erreur lors de la sauvegarde')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette question ?')) return

    try {
      const { error } = await supabase.from('knowledge_base').delete().eq('id', id)
      if (error) throw error
      toast.success('Question supprimée')
      fetchItems()
    } catch (error) {
      console.error('Error deleting item:', error)
      toast.error('Erreur lors de la suppression')
    }
  }

  const handleEdit = (item: KnowledgeItem) => {
    setEditingId(item.id)
    setFormData({
      question: item.question,
      answer: item.answer,
      category: item.category || 'qa',
      is_active: item.is_active,
    })
  }

  return (
    <div className="space-y-6">
      <Card className="glass-card border-border/30">
        <CardHeader>
          <CardTitle>Base de connaissances (AI Brain)</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <Input
                  id="question"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="Do we have parking?"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="qa">Q&A</SelectItem>
                    <SelectItem value="business_hours">Horaires</SelectItem>
                    <SelectItem value="policies">Politiques</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="answer">Réponse</Label>
              <Textarea
                id="answer"
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                placeholder="Yes, we have a parking lot..."
                required
                rows={3}
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label>Actif</Label>
              </div>
              <Button type="submit">{editingId ? 'Mettre à jour' : 'Ajouter'}</Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={() => setEditingId(null)}>
                  Annuler
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="glass-card border-border/30">
        <CardHeader>
          <CardTitle>Questions existantes ({items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="p-4 glass-card rounded-lg border-border/30">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{item.question}</span>
                      <span className="text-xs bg-secondary/50 px-2 py-0.5 rounded">{item.category}</span>
                      {!item.is_active && <span className="text-xs text-muted-foreground">(Inactif)</span>}
                    </div>
                    <p className="text-sm text-muted-foreground">{item.answer}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="text-center text-muted-foreground py-8">Aucune question pour le moment</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
