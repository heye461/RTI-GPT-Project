import { RTI_CATEGORIES } from './templates';

/**
 * Generates an RTI application draft structure.
 * Calls Gemini API if apiKey is provided, otherwise falls back to smart templates.
 * 
 * @param {string} categoryId 
 * @param {Object} fields - key-value pairs of form inputs
 * @param {string} customQuery - user's raw text explanation
 * @param {string} apiKey - Gemini API Key (optional)
 * @returns {Promise<{questions: string[], targetDepartment: string, usingAI: boolean}>}
 */
export async function generateDraft({ categoryId, fields, customQuery, apiKey }) {
  const category = RTI_CATEGORIES[categoryId] || RTI_CATEGORIES.custom;

  // 1. Fallback: If no API key is provided, use structured templates
  if (!apiKey || apiKey.trim() === '') {
    let questions = category.generateQuestions(fields);
    
    // If they have a custom query, append a question asking details about it
    if (customQuery && customQuery.trim().length > 0) {
      questions.push(
        `Provide certified copies of all files, notes, emails, and correspondence related to: "${customQuery.trim()}".`
      );
    }
    
    return {
      questions,
      targetDepartment: fields.department || category.defaultDept,
      usingAI: false
    };
  }

  // 2. AI Mode: Call Gemini API using structured response format
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `You are an expert legal counsel in India specializing in the Right to Information (RTI) Act, 2005. 
Your goal is to draft clear, precise, objective, and legally structured questions for an RTI application under Section 6(1).
PIOs (Public Information Officers) often try to evade vague questions. Your questions must be fact-based, asking for records, logs, reports, names, and documents rather than asking for 'opinions', 'reasons', or 'why' something happened (which they can reject).

Category: ${category.name}
Details provided by the user:
${Object.entries(fields)
  .map(([key, val]) => `- ${key}: ${val}`)
  .join('\n')}
Additional User Context/Query:
"${customQuery || 'None provided'}"

Generate:
1. A list of 4 to 6 numbered questions seeking specific official records, files, registers, work orders, circulars, or inspection reports. Keep them concise and direct.
2. A suggested Department name to address this application to.`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'OBJECT',
              properties: {
                questions: {
                  type: 'ARRAY',
                  items: { type: 'STRING' },
                  description: 'A list of 4-6 specific, numbered questions for the RTI. Avoid asking "why did you...", ask instead "Provide copies of files containing reasons...".'
                },
                targetDepartment: {
                  type: 'STRING',
                  description: 'The suggested public authority department name.'
                }
              },
              required: ['questions', 'targetDepartment']
            }
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API returned status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textResult) {
      throw new Error('Empty response from Gemini API');
    }

    const parsed = JSON.parse(textResult);
    return {
      questions: parsed.questions || category.generateQuestions(fields),
      targetDepartment: parsed.targetDepartment || fields.department || category.defaultDept,
      usingAI: true
    };
  } catch (error) {
    console.error('Gemini API Error, falling back to template:', error);
    // If Gemini fails (e.g., bad API key, rate limit, network error), fall back to local templates
    let questions = category.generateQuestions(fields);
    if (customQuery && customQuery.trim().length > 0) {
      questions.push(`Provide certified copies of files and correspondence regarding: "${customQuery.trim()}".`);
    }
    
    return {
      questions,
      targetDepartment: fields.department || category.defaultDept,
      usingAI: false,
      error: error.message
    };
  }
}
