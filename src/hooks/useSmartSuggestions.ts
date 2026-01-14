import { useState, useEffect } from 'react'
import { useNotifications } from '@/contexts/NotificationContext'

interface KnowledgeNode {
  id: string
  trigger: string
  response: string
  category: 'parking' | 'dietary' | 'payment' | 'hours' | 'services' | 'general'
  priority: number
  used: boolean
  lastUsed?: Date
}

interface SmartSuggestion {
  id: string
  nodeId: string
  trigger: string
  response: string
  confidence: number
  category: string
}

export function useSmartSuggestions() {
  const { addNotification } = useNotifications()
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([])
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0)

  // Base knowledge nodes for restaurant
  const baseKnowledgeNodes: KnowledgeNode[] = [
    // Parking
    { id: 'parking_1', trigger: 'parking', response: 'Oui, nous avons un parking privé gratuit pour nos clients avec 15 places disponibles juste devant le restaurant.', category: 'parking', priority: 1, used: false },
    { id: 'parking_2', trigger: 'stationnement', response: 'Le stationnement est facile et gratuit devant notre établissement. Vous pouvez également garer dans la rue voisine.', category: 'parking', priority: 1, used: false },
    { id: 'parking_3', trigger: 'où se garer', response: 'Nous avons un parking privé de 15 places. Si plein, la rue du Commerce a des places gratuites le soir.', category: 'parking', priority: 1, used: false },
    
    // Dietary/Halal
    { id: 'dietary_1', trigger: 'halal', response: 'Tous nos plats sont certifiés Halal. Notre viande provient de fournisseurs agréés et nous respectons toutes les normes.', category: 'dietary', priority: 1, used: false },
    { id: 'dietary_2', trigger: 'cacher', response: 'Nous proposons des options casher sur demande. Veuillez nous prévenir 24h à l\'avance pour les repas de groupe.', category: 'dietary', priority: 1, used: false },
    { id: 'dietary_3', trigger: 'végétarien', response: 'Nous avons plusieurs options végétariennes : salades composées, falafel, et plats de légumes de saison.', category: 'dietary', priority: 1, used: false },
    { id: 'dietary_4', trigger: 'sans gluten', response: 'Nous pouvons préparer des plats sans gluten sur réservation. Merci de nous le préciser lors de la commande.', category: 'dietary', priority: 1, used: false },
    
    // Payment
    { id: 'payment_1', trigger: 'paiement', response: 'Nous acceptons les cartes bancaires, PayPal, et la monnaie locale. Un minimum de 10€ est requis pour les cartes.', category: 'payment', priority: 1, used: false },
    { id: 'payment_2', trigger: 'carte bleue', response: 'Oui, nous acceptons toutes les cartes bancaires. Le paiement sans contact est disponible jusqu\'à 50€.', category: 'payment', priority: 1, used: false },
    { id: 'payment_3', trigger: 'espèces', response: 'Bien sûr, nous acceptons les paiements en espèces. Nous vous rendons la monnaie exacte quand possible.', category: 'payment', priority: 1, used: false },
    
    // Hours
    { id: 'hours_1', trigger: 'horaires', response: 'Nous sommes ouverts du mardi au dimanche de 11h à 23h. Fermeture le lundi. Service continu le week-end.', category: 'hours', priority: 1, used: false },
    { id: 'hours_2', trigger: 'ouvert', response: 'Nous ouvrons à 11h aujourd\'hui et fermerons à 23h. Le service cuisine est assuré jusqu\'à 22h30.', category: 'hours', priority: 1, used: false },
    
    // Services
    { id: 'services_1', trigger: 'livraison', response: 'Oui, nous livrons à domicile dans un rayon de 3km. Commandes minimales de 15€. Livraison gratuite à partir de 25€.', category: 'services', priority: 1, used: false },
    { id: 'services_2', trigger: 'emporter', response: 'Vous pouvez commander à emporter directement sur place ou par téléphone. Les commandes sont prêtes en 15-20 minutes.', category: 'services', priority: 1, used: false },
    { id: 'services_3', trigger: 'terrasse', response: 'Nous avons une terrasse de 20 places avec chauffage d\'extérieur. Réservation recommandée le week-end.', category: 'services', priority: 1, used: false },
    
    // General
    { id: 'general_1', trigger: 'menu enfant', response: 'Nous avons un menu enfant à 8€ avec plat principal, boisson et dessert. Portions adaptées pour les moins de 12 ans.', category: 'general', priority: 1, used: false },
    { id: 'general_2', trigger: 'groupe', response: 'Pour les groupes de plus de 10 personnes, merci de nous contacter 48h à l\'avance. Menu spécial disponible sur demande.', category: 'general', priority: 1, used: false },
    { id: 'general_3', trigger: 'anniversaire', response: 'Nous organisons des anniversaires avec menu spécial, gâteau offert et décoration. Forfait 25€ par personne.', category: 'general', priority: 1, used: false },
  ]

  // Generate suggestions based on keywords
  const generateSuggestions = (text: string): SmartSuggestion[] => {
    const keywords = text.toLowerCase().split(' ')
    const foundSuggestions: SmartSuggestion[] = []

    baseKnowledgeNodes.forEach(node => {
      const triggerWords = node.trigger.toLowerCase().split(' ')
      const matchCount = triggerWords.filter(word => 
        keywords.some(keyword => keyword.includes(word) || word.includes(keyword))
      ).length

      if (matchCount > 0) {
        const confidence = matchCount / triggerWords.length
        foundSuggestions.push({
          id: `${node.id}_${Date.now()}`,
          nodeId: node.id,
          trigger: node.trigger,
          response: node.response,
          confidence,
          category: node.category
        })
      }
    })

    // Sort by confidence and limit to top 5
    return foundSuggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5)
  }

  // Auto-suggest every 20 seconds when idle
  useEffect(() => {
    const interval = setInterval(() => {
      const randomTriggers = [
        'parking disponible',
        'menu halal certifié',
        'horaires d\'ouverture',
        'livraison à domicile',
        'réservation groupe',
        'options végétariennes',
        'paiement carte',
        'terrasse chauffée',
        'formule anniversaire'
      ]

      const randomTrigger = randomTriggers[Math.floor(Math.random() * randomTriggers.length)]
      const suggestions = generateSuggestions(randomTrigger)

      if (suggestions.length > 0) {
        const bestSuggestion = suggestions[0]
        
        // Add notification
        addNotification({
          type: 'knowledge',
          title: '💡 Suggestion IA',
          message: `Question fréquente détectée : "${bestSuggestion.trigger}"`,
          actionUrl: `/knowledge/${bestSuggestion.nodeId}`
        })

        // Add to suggestions queue
        setSuggestions(prev => [...prev, bestSuggestion])
      }
    }, 20000) // Every 20 seconds

    return () => clearInterval(interval)
  }, [addNotification])

  // Process user input for real-time suggestions
  const processInput = (text: string) => {
    const newSuggestions = generateSuggestions(text)
    
    if (newSuggestions.length > 0) {
      setSuggestions(prev => [...prev, ...newSuggestions])
      setCurrentSuggestionIndex(0)

      // Notify about new suggestions
      addNotification({
        type: 'knowledge',
        title: '🤖 Propositions IA',
        message: `${newSuggestions.length} proposition(s) trouvée(s) pour "${text}"`,
        actionUrl: '/suggestions'
      })
    }
  }

  const getNextSuggestion = () => {
    if (currentSuggestionIndex < suggestions.length - 1) {
      setCurrentSuggestionIndex(prev => prev + 1)
      return suggestions[currentSuggestionIndex + 1]
    }
    return null
  }

  const markSuggestionAsUsed = (suggestionId: string) => {
    // Mark the underlying knowledge node as used
    const nodeId = suggestions.find(s => s.id === suggestionId)?.nodeId
    if (nodeId) {
      const node = baseKnowledgeNodes.find(n => n.id === nodeId)
      if (node) {
        node.used = true
        node.lastUsed = new Date()
      }
    }
    
    // Remove from suggestions
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId))
  }

  return {
    suggestions,
    currentSuggestion: suggestions[currentSuggestionIndex] || null,
    processInput,
    getNextSuggestion,
    markSuggestionAsUsed,
    clearSuggestions: () => setSuggestions([])
  }
}
