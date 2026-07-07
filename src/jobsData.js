export const jobs = {
  "ai-data-evaluator": {
    title: "AI Data Annotator & Quality Evaluator (Generalist)",
    summary:
      "Remote AI quality evaluation at $20/hr. Rate model responses and provide structured feedback across general-interest topics.",
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
  "linkedin-b2b-scraping": {
    title: "LinkedIn B2B Data Collection Specialist",
    summary:
      "Remote contract role focused on accurate B2B lead research and structured LinkedIn profile data collection.",
    overview: `Support our B2B outreach pipeline by collecting and organizing high-quality LinkedIn profile data for target accounts. This is a remote, project-based contract role for detail-oriented researchers who can follow strict data standards.

You will work from defined search criteria and account lists, gathering structured profile fields, company details, and role information needed for downstream sales and recruiting workflows.

What to expect:
• Remote, asynchronous work with clear daily or weekly targets
• Documented sourcing guidelines and quality checklists
• Consistent project volume for reliable contributors
• Pay based on completed, quality-approved records
• Direct impact on lead generation and business development outcomes`,
    workflow: `Each data collection batch follows our 5-step quality workflow:

1. Review the brief — Confirm target industries, titles, geographies, and exclusion rules for the batch.
2. Source profiles — Locate relevant LinkedIn profiles that match the defined B2B criteria.
3. Extract structured fields — Capture required data points accurately and consistently across every record.
4. Validate entries — Cross-check for duplicates, incomplete records, and formatting issues before submission.
5. Submit the batch — Deliver the completed dataset with notes on any edge cases or sourcing blockers encountered.`,
    requirements: `Minimum requirements:

• Experience with LinkedIn research, lead generation, or B2B list building
• Strong attention to detail and comfort working with structured data fields
• Reliable internet connection and ability to work independently
• Familiarity with spreadsheet tools and data hygiene best practices
• Professional communication and ability to follow documented SOPs
• Available for part-time remote contract work`,
  },
};

export function getJob(jobId) {
  return jobs[jobId] ?? null;
}

export function getJobList() {
  return Object.entries(jobs).map(([id, job]) => ({ id, ...job }));
}
