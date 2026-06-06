/**
 * Proposal Generation Prompt Templates
 * Used to generate AI-powered proposal content
 */

export const coverLetterPrompt = {
  version: 'v3',
  template: `You are an expert freelance proposal writer. Write a high-converting cover letter for this job application.

JOB:
- Title: {{jobTitle}}
- Description: {{jobDescription}}
- Required Skills: {{jobSkills}}
- Experience Level: {{jobExperienceLevel}}
- Budget: {{jobBudget}}

FREELANCER:
- Skills: {{freelancerSkills}}
- Experience: {{freelancerExperience}}
- Bio: {{freelancerBio}}
- Portfolio: {{freelancerPortfolio}}

RULES — follow all of these exactly:
1. Start with a strong hook in the first sentence that references the specific job title or main requirement
2. Mention EVERY skill from "Required Skills" by its exact name somewhere in the letter
3. Include a concrete result or number from the freelancer's experience (e.g. "delivered X% faster", "built Y apps")
4. Keep length between 150-400 words — focused and scannable
5. End with a clear call to action (offer to discuss, show portfolio, start immediately)
6. Write in first person, professional but warm tone — NOT robotic or generic
7. DO NOT use filler phrases like "I am writing to apply" or "I believe I am a perfect fit"
8. DO NOT use bullet points — write flowing paragraphs

Output ONLY the cover letter text. No JSON, no labels, no explanations.`,

  variables: [
    'jobTitle',
    'jobDescription',
    'jobSkills',
    'jobExperienceLevel',
    'jobBudget',
    'jobKeywords',
    'freelancerSkills',
    'freelancerExperience',
    'freelancerBio',
    'freelancerPortfolio',
  ],
};

export const bidAmountPrompt = {
  version: 'v1',
  template: `You are helping a freelancer determine an appropriate bid amount for a job.

JOB DETAILS:
- Title: {{jobTitle}}
- Description: {{jobDescription}}
- Budget Type: {{budgetType}}
- Budget Range: {{budgetRange}}
- Duration: {{jobDuration}}
- Experience Level: {{jobExperienceLevel}}

FREELANCER PROFILE:
- Hourly Rate: {{freelancerRate}}
- Experience: {{freelancerExperience}}
- Completed Jobs: {{completedJobs}}

Suggest an appropriate bid amount (in PKR) that:
1. Is competitive within the budget range
2. Reflects the freelancer's experience level
3. Is fair for the scope of work

Return only a number (no currency symbols, no text), representing the suggested bid amount in PKR.`,
  
  variables: [
    'jobTitle',
    'jobDescription',
    'budgetType',
    'budgetRange',
    'jobDuration',
    'jobExperienceLevel',
    'freelancerRate',
    'freelancerExperience',
    'completedJobs',
  ],
};

export const deliveryTimePrompt = {
  version: 'v1',
  template: `You are helping a freelancer estimate delivery time for a job.

JOB DETAILS:
- Title: {{jobTitle}}
- Description: {{jobDescription}}
- Duration Estimate: {{jobDuration}}
- Experience Level: {{jobExperienceLevel}}
- Project Size: {{projectSize}}

FREELANCER PROFILE:
- Experience: {{freelancerExperience}}
- Availability: {{freelancerAvailability}}

Suggest a realistic delivery time in days that:
1. Is achievable based on the project scope
2. Accounts for the freelancer's experience level
3. Includes buffer time for revisions

Return only a number representing the suggested delivery time in days (1-365).`,
  
  variables: [
    'jobTitle',
    'jobDescription',
    'jobDuration',
    'jobExperienceLevel',
    'projectSize',
    'freelancerExperience',
    'freelancerAvailability',
  ],
};

export default {
  coverLetter: coverLetterPrompt,
  bidAmount: bidAmountPrompt,
  deliveryTime: deliveryTimePrompt,
};




