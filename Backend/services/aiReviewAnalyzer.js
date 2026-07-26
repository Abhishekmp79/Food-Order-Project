const parseJsonResponse = (content) => {
  try {
    return JSON.parse(content);
  } catch (error) {
    const fencedJsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/i);

    if (fencedJsonMatch) {
      return JSON.parse(fencedJsonMatch[1].trim());
    }

    const jsonMatch = content.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);

    if (!jsonMatch) {
      throw new Error("AI response did not include valid JSON");
    }

    return JSON.parse(jsonMatch[0]);
  }
};

const normalizeSentiment = (sentiments) => {
  const counts = sentiments.reduce(
    (accumulator, sentiment) => {
      if (sentiment === "positive" || sentiment === "negative" || sentiment === "mixed") {
        accumulator[sentiment] += 1;
      }

      return accumulator;
    },
    { positive: 0, negative: 0, mixed: 0 }
  );

  if (counts.mixed > 0 || (counts.positive > 0 && counts.negative > 0)) {
    return "mixed";
  }

  if (counts.positive >= counts.negative) {
    return "positive";
  }

  return "negative";
};

const normalizeAiReviewData = (parsed) => {
  if (!Array.isArray(parsed)) {
    return parsed;
  }

  const sentiment = normalizeSentiment(
    parsed.map((item) => item?.sentiment).filter(Boolean)
  );

  const summaryBullets = [
    ...new Set(
      parsed.flatMap((item) =>
        Array.isArray(item?.summaryBullets) ? item.summaryBullets : []
      )
    ),
  ].slice(0, 3);

  const mentionCounts = parsed
    .flatMap((item) => (Array.isArray(item?.topMentions) ? item.topMentions : []))
    .reduce((accumulator, mention) => {
      const key = String(mention).trim();

      if (key) {
        accumulator[key] = (accumulator[key] || 0) + 1;
      }

      return accumulator;
    }, {});

  const topMentions = Object.entries(mentionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([mention]) => mention);

  return {
    sentiment,
    summaryBullets,
    topMentions,
  };
};

exports.analyzeReviewsWithAI = async (reviews) => {
  const reviewTexts = reviews
    .map((review) => review.Comment || review.comment)
    .filter(Boolean);

  const prompt = `
Analyze these restaurant reviews and return ONLY one valid JSON object that summarizes all reviews together.
Do not return an array.
Do not return markdown.
Do not include explanation text.

Return JSON in this exact format:
{
  "sentiment": "positive | negative | mixed",
  "summaryBullets": ["point1", "point2", "point3"],
  "topMentions": ["word1", "word2"]
}

Reviews:
${reviewTexts.join("\n")}
`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 300,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to analyze restaurant reviews");
  }

  return normalizeAiReviewData(parseJsonResponse(data.choices[0].message.content));
};
