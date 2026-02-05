import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Building2, 
  Clock, 
  Brain,
  Save,
  Plus,
  Trash2,
  MapPin,
  Phone,
  Users
} from 'lucide-react';
import { Profile, TableConfig, KnowledgeItem } from '@/lib/types';
import { canAccessFeature } from '@/lib/tier-access';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';

interface DashboardContext {
  user: Profile;
}

type TabType = 'general' | 'tables' | 'hours' | 'knowledge';

const DAYS = [
  { key: 'mon', label: 'Lundi' },
  { key: 'tue', label: 'Mardi' },
  { key: 'wed', label: 'Mercredi' },
  { key: 'thu', label: 'Jeudi' },
  { key: 'fri', label: 'Vendredi' },
  { key: 'sat', label: 'Samedi' },
  { key: 'sun', label: 'Dimanche' },
];

export function SettingsPage() {
  const { user } = useOutletContext<DashboardContext>();
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [generalSettings, setGeneralSettings] = useState({
    name: user.company_name || '',
    address: '123 Avenue des Champs-Élysées, 75008 Paris',
    phone: '+33 1 40 69 60 50',
    welcomeMessage: user.settings?.restaurant_config?.welcome_message || '',
    fallbackMessage: user.settings?.restaurant_config?.fallback_message || '',
    quotaIa: user.settings?.restaurant_config?.quota_ia || 20,
  });

  const [tables, setTables] = useState<TableConfig[]>(
    user.settings?.restaurant_config?.tables || []
  );

  const [businessHours, setBusinessHours] = useState<Record<string, { open: string; close: string; active: boolean }>>(
    user.settings?.business_hours || {
      mon: { open: '11:30', close: '23:00', active: true },
      tue: { open: '11:30', close: '23:00', active: true },
      wed: { open: '11:30', close: '23:00', active: true },
      thu: { open: '11:30', close: '23:00', active: true },
      fri: { open: '11:30', close: '00:00', active: true },
      sat: { open: '11:30', close: '00:00', active: true },
      sun: { open: '12:00', close: '22:00', active: true },
    }
  );

  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeItem[]>(
    user.settings?.ai_knowledge || []
  );

  const [newKnowledge, setNewKnowledge] = useState({ trigger: '', response: '' });

  const canEditKnowledge = canAccessFeature(user.tier, 'richKnowledgeBase');

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    toast.success('Paramètres enregistrés');
    setIsSaving(false);
  };

  const addTable = () => {
    const newTable: TableConfig = {
      id: `T${tables.length + 1}`,
      name: `Table ${tables.length + 1}`,
      seats: 2,
      is_online_reservable: true,
    };
    setTables([...tables, newTable]);
  };

  const updateTable = (index: number, updates: Partial<TableConfig>) => {
    const newTables = [...tables];
    newTables[index] = { ...newTables[index], ...updates };
    setTables(newTables);
  };

  const removeTable = (index: number) => {
    setTables(tables.filter((_, i) => i !== index));
  };

  const addKnowledge = () => {
    if (!newKnowledge.trigger || !newKnowledge.response) {
      toast.error('Remplissez tous les champs');
      return;
    }
    const newItem: KnowledgeItem = {
      id: `k-${Date.now()}`,
      ...newKnowledge,
    };
    setKnowledgeBase([...knowledgeBase, newItem]);
    setNewKnowledge({ trigger: '', response: '' });
    toast.success('Question ajoutée');
  };

  const removeKnowledge = (id: string) => {
    setKnowledgeBase(knowledgeBase.filter(k => k.id !== id));
  };

  const tabs = [
    { id: 'general' as const, label: 'Général', icon: Building2 },
    { id: 'tables' as const, label: 'Salle & Tables', icon: Users },
    { id: 'hours' as const, label: 'Horaires', icon: Clock },
    { id: 'knowledge' as const, label: 'IA Knowledge', icon: Brain },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="w-7 h-7 text-cyan-400" />
            Paramètres
          </h1>
          <p className="text-muted-foreground">Configurez votre établissement et l'IA</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="btn-primary flex items-center gap-2"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Enregistrer
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 rounded-full whitespace-nowrap transition-all flex items-center gap-2",
              activeTab === tab.id
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                : "glass-card hover:bg-white/5"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl p-6"
      >
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium">Nom de l'établissement</label>
                <input
                  type="text"
                  value={generalSettings.name}
                  onChange={e => setGeneralSettings({ ...generalSettings, name: e.target.value })}
                  className="input-field mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground mt-0.5" />
                  <input
                    type="tel"
                    value={generalSettings.phone}
                    onChange={e => setGeneralSettings({ ...generalSettings, phone: e.target.value })}
                    className="input-field mt-1 pl-10"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Adresse</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground mt-0.5" />
                <input
                  type="text"
                  value={generalSettings.address}
                  onChange={e => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                  className="input-field mt-1 pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Message d'accueil IA</label>
              <textarea
                value={generalSettings.welcomeMessage}
                onChange={e => setGeneralSettings({ ...generalSettings, welcomeMessage: e.target.value })}
                className="input-field mt-1 min-h-[80px] resize-none"
                placeholder="Bienvenue chez [Nom]. Comment puis-je vous aider ?"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Ce message sera prononcé par l'IA au début de chaque appel
              </p>
            </div>

            <div>
              <label className="text-sm font-medium">Message de repli</label>
              <textarea
                value={generalSettings.fallbackMessage}
                onChange={e => setGeneralSettings({ ...generalSettings, fallbackMessage: e.target.value })}
                className="input-field mt-1 min-h-[80px] resize-none"
                placeholder="Je suis désolé, je ne peux pas répondre à cette demande..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                Utilisé quand l'IA ne peut pas traiter une demande
              </p>
            </div>

            <div>
              <label className="text-sm font-medium">Quota d'appels IA / jour</label>
              <input
                type="number"
                min="1"
                max="1000"
                value={generalSettings.quotaIa}
                onChange={e => setGeneralSettings({ ...generalSettings, quotaIa: parseInt(e.target.value) })}
                className="input-field mt-1 w-32"
              />
            </div>
          </div>
        )}

        {activeTab === 'tables' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Configuration des tables</h3>
              <button onClick={addTable} className="btn-secondary flex items-center gap-2">
                <Plus className="w-4 h-4" /> Ajouter une table
              </button>
            </div>

            {tables.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucune table configurée
              </div>
            ) : (
              <div className="space-y-3">
                {tables.map((table, index) => (
                  <div key={table.id} className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
                    <div className="flex-1 grid grid-cols-4 gap-4">
                      <div>
                        <label className="text-xs text-muted-foreground">ID</label>
                        <input
                          type="text"
                          value={table.id}
                          onChange={e => updateTable(index, { id: e.target.value })}
                          className="input-field mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Nom</label>
                        <input
                          type="text"
                          value={table.name}
                          onChange={e => updateTable(index, { name: e.target.value })}
                          className="input-field mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Places</label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={table.seats}
                          onChange={e => updateTable(index, { seats: parseInt(e.target.value) })}
                          className="input-field mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Réservable en ligne</label>
                        <div className="mt-2">
                          <button
                            onClick={() => updateTable(index, { is_online_reservable: !table.is_online_reservable })}
                            className={cn("toggle-switch", table.is_online_reservable && "active")}
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeTable(index)}
                      className="p-2 rounded-lg hover:bg-red-500/20 text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'hours' && (
          <div className="space-y-4">
            <h3 className="font-semibold">Horaires d'ouverture</h3>
            
            {DAYS.map(day => (
              <div key={day.key} className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
                <div className="w-24 font-medium">{day.label}</div>
                <button
                  onClick={() => setBusinessHours({
                    ...businessHours,
                    [day.key]: { ...businessHours[day.key], active: !businessHours[day.key]?.active }
                  })}
                  className={cn("toggle-switch", businessHours[day.key]?.active && "active")}
                />
                {businessHours[day.key]?.active ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="time"
                      value={businessHours[day.key]?.open || ''}
                      onChange={e => setBusinessHours({
                        ...businessHours,
                        [day.key]: { ...businessHours[day.key], open: e.target.value }
                      })}
                      className="input-field w-32"
                    />
                    <span className="text-muted-foreground">à</span>
                    <input
                      type="time"
                      value={businessHours[day.key]?.close || ''}
                      onChange={e => setBusinessHours({
                        ...businessHours,
                        [day.key]: { ...businessHours[day.key], close: e.target.value }
                      })}
                      className="input-field w-32"
                    />
                  </div>
                ) : (
                  <span className="text-muted-foreground">Fermé</span>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'knowledge' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Base de connaissances IA</h3>
                <p className="text-sm text-muted-foreground">
                  Configurez les réponses automatiques de l'IA
                </p>
              </div>
              {!canEditKnowledge && (
                <span className="badge badge-yellow">Enterprise uniquement</span>
              )}
            </div>

            {/* Add new knowledge */}
            <div className="p-4 rounded-lg bg-white/5 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Mot-clé déclencheur</label>
                  <input
                    type="text"
                    value={newKnowledge.trigger}
                    onChange={e => setNewKnowledge({ ...newKnowledge, trigger: e.target.value })}
                    className="input-field mt-1"
                    placeholder="parking, wifi, allergies..."
                    disabled={!canEditKnowledge}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Réponse de l'IA</label>
                  <input
                    type="text"
                    value={newKnowledge.response}
                    onChange={e => setNewKnowledge({ ...newKnowledge, response: e.target.value })}
                    className="input-field mt-1"
                    placeholder="Parking gratuit disponible..."
                    disabled={!canEditKnowledge}
                  />
                </div>
              </div>
              <button 
                onClick={addKnowledge} 
                className="btn-secondary flex items-center gap-2"
                disabled={!canEditKnowledge}
              >
                <Plus className="w-4 h-4" /> Ajouter
              </button>
            </div>

            {/* Knowledge list */}
            {knowledgeBase.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucune entrée dans la base de connaissances
              </div>
            ) : (
              <div className="space-y-3">
                {knowledgeBase.map(item => (
                  <div key={item.id} className="flex items-start gap-4 p-4 rounded-lg bg-white/5">
                    <div className="flex-1">
                      <div className="badge badge-cyan mb-2">{item.trigger}</div>
                      <p className="text-sm text-muted-foreground">{item.response}</p>
                    </div>
                    <button
                      onClick={() => removeKnowledge(item.id)}
                      className="p-2 rounded-lg hover:bg-red-500/20 text-red-400"
                      disabled={!canEditKnowledge}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
