export const jobs = {
  "ai-data-evaluator": {
    title: "AI Data Annotator & Quality Evaluator (Generalist)",
    overview: `Join our remote AI quality evaluation project and help improve next-generation language models. This is a flexible, part-time contract role paying $20/hr for consistent, high-quality work.

You will review AI-generated responses across a wide range of everyday topics — from practical how-to questions to open-ended writing tasks. Your ratings and written feedback directly shape model training, safety guardrails, and product quality.

What to expect:
• Remote, asynchronous work you can complete on your own schedule
• Clear task guidelines and rubrics for each evaluation batch
• Steady project-based assignments for reliable contributors
• $20/hr pay for completed, quality-approved tasks
• Opportunity to grow into specialized evaluator tracks as you gain experience`,
    workflow: `Every evaluation follows our standardized 5-step response rating workflow:

1. Read the prompt — Review the full user request and any background context provided with the task.
2. Study the response(s) — Read each AI-generated answer carefully, noting factual claims, tone, structure, and completeness.
3. Score against the rubric — Rate each response on defined criteria such as accuracy, relevance, clarity, helpfulness, and safety.
4. Compare and rank — When multiple responses are shown, determine which answer better satisfies the prompt and explain the key differences.
5. Submit your rationale — Write a concise justification for your scores and ranking so our modeling team can use your feedback for calibration and retraining.`,
    requirements: `Minimum requirements:

• Fluent, professional written English
• Strong attention to detail and ability to apply rubrics consistently
• Comfortable evaluating AI outputs on general-interest topics (no specialized domain expertise required)
• Reliable internet connection and a quiet workspace for focused review sessions
• Ability to follow detailed instructions and meet quality standards on every submission
• Available for part-time remote contract work (flexible hours, project-based volume)`,
  },
};

export function getJob(jobId) {
  return jobs[jobId] ?? null;
}
