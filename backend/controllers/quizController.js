const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generateQuiz = async (req, res) => {
  const { subject = 'General', topic = '', difficulty = 'medium', count = 5 } = req.body;

  const safeCount = Math.min(Math.max(parseInt(count) || 5, 1), 10);
  const safeDiff  = ['easy', 'medium', 'hard'].includes(difficulty) ? difficulty : 'medium';
  const topicLine = topic ? ` specifically on the topic of "${topic}"` : '';

  const difficultyGuide = {
    easy:   'straightforward questions testing basic definitions and concepts',
    medium: 'questions requiring understanding and application of concepts',
    hard:   'challenging questions requiring deep analysis, problem-solving, or advanced knowledge',
  };

  const systemPrompt =
    'You are a quiz generator for students. ' +
    'ALWAYS respond with ONLY a valid JSON array — no markdown, no code blocks, no explanations outside the JSON. ' +
    'Your entire response must be parseable by JSON.parse().';

  const userPrompt =
    `Generate exactly ${safeCount} multiple-choice questions about ${subject}${topicLine}.\n` +
    `Difficulty: ${safeDiff} — ${difficultyGuide[safeDiff]}.\n\n` +
    `Return a JSON array where every element has this exact shape:\n` +
    `{\n` +
    `  "question": "The full question text",\n` +
    `  "options": ["Option A", "Option B", "Option C", "Option D"],\n` +
    `  "correct": 0,\n` +
    `  "explanation": "One or two sentences explaining why the answer is correct"\n` +
    `}\n\n` +
    `Rules:\n` +
    `- "correct" is the 0-based index of the correct option (0=A, 1=B, 2=C, 3=D)\n` +
    `- Each question must have exactly 4 options\n` +
    `- Make options plausible and distinct — avoid obviously wrong distractors\n` +
    `- Keep questions clear and unambiguous\n\n` +
    `Respond with the JSON array now:`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt  },
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });

    const raw = completion.choices[0].message.content.trim();

    // Parse — try direct parse first, then extract JSON array if wrapped in markdown
    let questions;
    try {
      questions = JSON.parse(raw);
    } catch {
      const match = raw.match(/\[[\s\S]*\]/);
      if (!match) throw new Error('No JSON array found in response');
      questions = JSON.parse(match[0]);
    }

    if (!Array.isArray(questions)) throw new Error('Response is not a JSON array');

    // Validate and sanitise each question
    const validated = questions.slice(0, safeCount).map((q, i) => {
      if (typeof q.question !== 'string' || !q.question.trim())
        throw new Error(`Question ${i + 1} is missing text`);
      if (!Array.isArray(q.options) || q.options.length < 2)
        throw new Error(`Question ${i + 1} has invalid options`);

      const opts = q.options.slice(0, 4).map(String);
      const correct = Math.min(Math.max(parseInt(q.correct) || 0, 0), opts.length - 1);
      return {
        question:    q.question.trim(),
        options:     opts,
        correct,
        explanation: String(q.explanation || '').trim(),
      };
    });

    return res.json({ questions: validated });

  } catch (err) {
    console.error('Quiz generation error:', err.message);
    if (err.status === 401) return res.status(401).json({ message: 'Invalid AI configuration' });
    if (err.status === 429) return res.status(429).json({ message: 'AI service busy, please try again' });
    return res.status(500).json({ message: 'Failed to generate quiz. Please try again.' });
  }
};

module.exports = { generateQuiz };
