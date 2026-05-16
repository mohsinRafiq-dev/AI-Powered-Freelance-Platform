/**
 * Proposal Generation Prompt Templates
 * Used to generate AI-powered proposal content
 */

export const coverLetterPrompt = {
  version: 'v2',
  template: `You are helping a freelancer write a professional, keyword-optimized proposal cover letter for a job on Linkify platform.

JOB DETAILS:
- Title: {{jobTitle}}
- Description: {{jobDescription}}
- Required Skills: {{jobSkills}}
- Experience Level: {{jobExperienceLevel}}
- Budget: {{jobBudget}}
- Top Keywords from Job: {{jobKeywords}}

FREELANCER PROFILE:
- Skills: {{freelancerSkills}}
- Experience: {{freelancerExperience}}
- Bio: {{freelancerBio}}
- Portfolio Highlights: {{freelancerPortfolio}}

Write a professional, compelling cover letter (100-2000 characters) that:
1. Shows understanding of the job requirements
2. Highlights relevant skills and experience
3. Demonstrates enthusiasm and professionalism
4. Is concise and to the point

KEYWORD OPTIMIZATION RULES (important for proposal ranking):
- Naturally incorporate 4-6 of the Top Keywords from Job above into the cover letter
- Mirror the exact terminology used in the job description (do not paraphrase technical terms)
- Mention each Required Skill the freelancer actually has at least once, by its exact name
- Avoid keyword stuffing — keep the writing natural and human
- Front-load the most important keyword in the first two sentences for better ranking

Return only the cover letter text, no JSON, no explanations.`,

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




