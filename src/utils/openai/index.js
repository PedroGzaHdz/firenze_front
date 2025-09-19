import OpenAI from 'openai';
import { openAIApiKey } from '@/config/env';
const client = new OpenAI({
  apiKey: openAIApiKey,
});

export const generateAIResponse = async (chatHistory) => {
  try {
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
        'Help the user effectively manage and grow their business by acting as a virtual operations, sales, and inventory manager, always adapting recommendations to the specific context given.',
    };
    const messagesAdapted = chatHistory.map((message) => ({
      role: message?.type === 'user' ? 'user' : 'assistant',
      content: message?.message,
    }));

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [firstMessagePrompt, ...messagesAdapted],
      max_tokens: 150,
      temperature: 0.7,
    });
    const aiMessage = response.choices[0].message.content.trim();
    return {
      success: true,
      data: aiMessage,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to generate AI response',
    };
  }
};

export async function getDataInvoiceFromOCRData(ocrData) {
  try {
    const promptSystem =
      'You are an expert in invoice data extraction from OCR text.\n' +
      'Your task is to carefully analyze the provided OCR text and return only a JSON object with the following fields:\n' +
      '\n' +
      'cogsCategory: Extract from the top of the text, formatted as Invoice - {cogs_category}.\n' +
      '\n' +
      'vendor: The service provider or company issuing the invoice (always the company in the header, never the "Bill to" or "Ship to").\n' +
      '\n' +
      'hash: The invoice hash.\n' +
      '\n' +
      'date: The invoice date.\n' +
      '\n' +
      'lineItems: An array of objects, each with the structure:\n' +
      '\n' +
      'description: Line item description.\n' +
      '\n' +
      'quantity: Line item quantity.\n' +
      '\n' +
      'unitPrice: Unit price (numeric, no currency symbols).\n' +
      '\n' +
      'total: Line item total (numeric, no currency symbols).\n' +
      '\n' +
      'skuCode: SKU code(s) as an array of strings (include multiple codes if present).\n' +
      '\n' +
      'total: The sum of all line item totals.\n' +
      '\n' +
      'confidenceScore: How confident the model is in the extracted data (range 0.0–1.0).\n' +
      '\n' +
      'Rules:\n' +
      '\n' +
      'If a field cannot be found, return null.\n' +
      '\n' +
      'All monetary values must be numeric only, without currency symbols.\n' +
      '\n' +
      'The output must always be valid JSON only (no explanations, comments, or extra text).\n' +
      '\n' +
      '🔹 JSON Output Structure\n' +
      '\n' +
      'The model must always return JSON in the following format:\n' +
      '\n' +
      '{\n' +
      '  "cogsCategory": "string or null",\n' +
      '  "vendor": "string or null",\n' +
      '  "hash": "string or null",\n' +
      '  "date": "YYYY-MM-DD or null",\n' +
      '  "lineItems": [\n' +
      '    {\n' +
      '      "description": "string or null",\n' +
      '      "quantity": number or null,\n' +
      '      "unitPrice": number or null,\n' +
      '      "total": number or null,\n' +
      '      "skuCode": ["string", "string"]\n' +
      '    }\n' +
      '  ],\n' +
      '  "total": number or null,\n' +
      '  "confidenceScore": number (0.0 - 1.0)\n' +
      '}';

    const messages = [
      { role: 'system', content: promptSystem },
      {
        role: 'user',
        content: `Here is the OCR text:\n\n${JSON.stringify(ocrData)}`,
      },
    ];

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'invoice_schema',
          schema: {
            type: 'object',
            properties: {
              cogsCategory: {
                type: ['string', 'null'],
                description:
                  'Extract from the top of the text, formatted as Invoice - {cogsCategory}.',
              },
              vendor: {
                type: ['string', 'null'],
                description:
                  'The service provider or company issuing the invoice (always the company in the header, never the "Bill to" or "Ship to").',
              },
              hash: {
                type: ['string', 'null'],
                description: 'The invoice hash.',
              },
              date: {
                type: ['string', 'null'],
                description: 'The invoice date in YYYY-MM-DD format.',
              },
              confidenceScore: {
                type: 'number',
                minimum: 0.0,
                maximum: 1.0,
                description:
                  'How confident the model is in the extracted data (range 0.0–1.0).',
              },
              total: {
                type: ['number', 'null'],
                description:
                  'The sum of all line item totals (numeric, no currency symbols).',
              },
              lineItems: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    description: {
                      type: ['string', 'null'],
                      description: 'Line item description.',
                    },
                    quantity: {
                      type: ['number', 'null'],
                      description: 'Line item quantity.',
                    },
                    unitPrice: {
                      type: ['number', 'null'],
                      description: 'Unit price (numeric, no currency symbols).',
                    },
                    total: {
                      type: ['number', 'null'],
                      description:
                        'Line item total (numeric, no currency symbols).',
                    },
                    skuCode: {
                      type: 'array',
                      items: { type: 'string' },
                      description:
                        'SKU code(s) as an array of strings (include multiple codes if present).',
                    },
                  },
                },
              },
            },
            required: [
              'cogsCategory',
              'vendor',
              'hash',
              'date',
              'lineItems',
              'total',
              'confidenceScore',
            ],
            additionalProperties: false,
            strict: true,
          },
        },
      },
    });

    const invoiceData = response.choices[0].message?.content;
    const jsonResponse =
      typeof invoiceData === 'string' ? JSON.parse(invoiceData) : invoiceData;

    if (!jsonResponse) {
      throw new Error('No JSON response generated by OpenAI');
    }

    return {
      success: true,
      data: jsonResponse,
    };
  } catch (e) {
    return {
      success: false,
      error: e.message,
    };
  }
}
