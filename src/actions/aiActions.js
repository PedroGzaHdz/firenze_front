'use server';

import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Sin NEXT_PUBLIC_ para mantener la key segura
});

export async function generateAIResponseAction(chatHistory) {
  try {

    // Buscar si el último mensaje del usuario tiene documento
    const lastUserMsgWithDoc = [...chatHistory].reverse().find(
      (msg) => msg.type === 'user' && msg.document
    );

    let docContext = '';
    if (lastUserMsgWithDoc && lastUserMsgWithDoc.document) {
      const doc = lastUserMsgWithDoc.document;
      // Adjuntar todos los campos relevantes
      docContext = `\n\nDocument Context:` +
        `\n- Name: ${doc.name}` +
        (doc.vendor ? `\n- Vendor: ${doc.vendor}` : '') +
        (doc.type ? `\n- Type: ${doc.type}` : '') +
        (doc.amount ? `\n- Amount: ${doc.amount}` : '') +
        (doc.status ? `\n- Status: ${doc.status}` : '') +
        (doc.url ? `\n- URL: ${doc.url}` : '') +
        (doc.hash ? `\n- Hash: ${doc.hash}` : '') +
        (doc.date ? `\n- Date: ${doc.date}` : '') +
        (doc.confidenceScore ? `\n- Confidence Score: ${doc.confidenceScore}` : '') +
        (doc.lineItems && Array.isArray(doc.lineItems) ? `\n- Line Items: ${JSON.stringify(doc.lineItems)}` : '');
    }

    const firstMessagePrompt = {
      role: 'system',
      content:
        'You are a highly skilled Business Operations Assistant. Your role is to support the user in managing all aspects of their business efficiently. You will:\n' +
        '\n' +
        'Analyze and optimize operations (processes, workflows, logistics).\n' +
        '\n' +
        'Assist with sales strategies, customer interactions, and revenue growth.\n' +
        '\n' +
        'Manage and monitor inventory control, ensuring accurate stock tracking and forecasting.\n' +
        '\n' +
        'Provide insights and recommendations for business decision-making.\n' +
        '\n' +
        'Instructions:\n' +
        '\n' +
        'Always ask clarifying questions if the context is not detailed enough.\n' +
        '\n' +
        'Use the context provided by the user (e.g., sales data, inventory records, operational challenges) to give tailored, actionable advice.\n' +
        '\n' +
        'Respond with structured outputs (e.g., bullet points, step-by-step plans, tables) to keep answers clear and business-ready.\n' +
        '\n' +
        'When relevant, provide practical examples, strategies, or templates that the user can apply directly.\n' +
        '\n' +
        'Prioritize accuracy, clarity, and efficiency in every response.\n' +
        '\n' +
        'Goal:\n' +
        'Help the user effectively manage and grow their business by acting as a virtual operations, sales, and inventory manager, always adapting recommendations to the specific context given.' +
        "\n" +
        "Respond in the same language the user is using." +
        "\n" +
        "Response with plain text only, avoid using markdown or any special formatting." + 
        "\n" + 
        "In case the user has attached a document, use the following context to inform your response, this information is in user" +
        " messages."
    };

    const messagesAdapted = chatHistory.map((message) => ({
      role: message?.type === 'user' ? 'user' : 'assistant',
      content: message?.message + (message?.type === 'user' && message?.document ?
        "\n document context:" + JSON.stringify(message?.document)
        : ''),
    }));
    
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [firstMessagePrompt, ...messagesAdapted],
      temperature: 0.5,
    });

    const aiMessage = response.choices[0].message.content.trim();

    return {
      success: true,
      data: aiMessage,
    };
  } catch (error) {
  // console.error('Error generating AI response:', error);
    return {
      success: false,
      error: 'Failed to generate AI response',
    };
  }
}