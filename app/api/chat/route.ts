// Mock response generator
const getMockResponse = async (message: string) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  const lowerMsg = message.toLowerCase()
  
  if (lowerMsg.includes('cluster') || lowerMsg.includes('high-value')) {
    return `I've identified 3 high-value clusters in the Alpha quadrant. Focusing on the primary cluster now. These data points show a 45% increase in activity over the last cycle.`
  } else if (lowerMsg.includes('reset') || lowerMsg.includes('home')) {
    return `Resetting view to galactic center. All systems nominal.`
  } else {
    return `I'm analyzing the dataset based on your query "${message}". I can help you visualize clusters, outliers, or specific data ranges.`
  }
}

export async function POST(req: Request) {
  const { messages } = await req.json()
  const lastMessage = messages[messages.length - 1]
  
  const responseText = await getMockResponse(lastMessage.content)
  
  // Create a stream from the mock text
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      const words = responseText.split(' ')
      
      for (const word of words) {
        controller.enqueue(encoder.encode(word + ' '))
        await new Promise(resolve => setTimeout(resolve, 50)) // Typewriter effect
      }
      controller.close()
    }
  })

  return new Response(stream)
}
