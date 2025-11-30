import { useState, FormEvent, ChangeEvent } from 'react'

export function useMockChat() {
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate network delay
    setTimeout(() => {
      let responseText = "I'm analyzing the dataset based on your query. I can help you visualize clusters, outliers, or specific data ranges."
      
      const lowerMsg = userMessage.content.toLowerCase()
      if (lowerMsg.includes('cluster') || lowerMsg.includes('high-value')) {
        responseText = "I've identified 3 high-value clusters in the Alpha quadrant. Focusing on the primary cluster now."
      } else if (lowerMsg.includes('reset') || lowerMsg.includes('home')) {
        responseText = "Resetting view to galactic center. All systems nominal."
      }

      const aiMessage = { role: 'assistant', content: responseText }
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500)
  }

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading
  }
}
