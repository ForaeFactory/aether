import { useState, FormEvent, ChangeEvent } from 'react'

/**
 * A custom hook for a mock chat interface.
 * This hook manages the chat messages, input, and loading state.
 * It also simulates a network delay and provides mock AI responses.
 */
export function useMockChat() {
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Handles the change event for the chat input.
   * @param {ChangeEvent<HTMLInputElement>} e - The change event.
   */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  /**
   * Handles the submit event for the chat form.
   * This function adds the user's message to the chat and simulates a response from the AI.
   * @param {FormEvent} e - The form event.
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate a network delay to make the chat feel more realistic.
    setTimeout(() => {
      let responseText = "I'm analyzing the dataset based on your query. I can help you visualize clusters, outliers, or specific data ranges."
      
      // Provide mock AI responses based on the user's input.
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
