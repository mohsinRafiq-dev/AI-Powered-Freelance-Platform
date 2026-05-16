
export const calculateMatchScore = (job, userSkills, userExperience = 'intermediate') => {
  if (!job.skills || !job.skills.length || !userSkills || !userSkills.length) {
    return 0;
  }

  // Normalize skills to lowercase for comparison
  const jobSkillsLower = job.skills.map(skill => skill.toLowerCase());
  const userSkillsLower = userSkills.map(skill => skill.toLowerCase());

  // Count matched skills
  const matchedSkills = jobSkillsLower.filter(skill => 
    userSkillsLower.includes(skill)
  );

  // Base match percentage based on skill overlap
  let matchPercentage = (matchedSkills.length / job.skills.length) * 100;

  // Bonus for having more matching skills than required
  const extraSkills = userSkillsLower.filter(skill => 
    jobSkillsLower.includes(skill)
  ).length - matchedSkills.length;
  if (extraSkills > 0) {
    matchPercentage += Math.min(extraSkills * 2, 10);
  }

  // Experience level matching
  if (job.experienceLevel && userExperience) {
    const experienceLevels = { 'entry': 1, 'intermediate': 2, 'expert': 3 };
    const userLevel = experienceLevels[userExperience.toLowerCase()] || 2;
    const jobLevel = experienceLevels[job.experienceLevel.toLowerCase()] || 2;
    
    // Perfect match bonus
    if (userLevel === jobLevel) {
      matchPercentage += 10;
    }
    // One level difference - smaller bonus
    else if (Math.abs(userLevel - jobLevel) === 1) {
      matchPercentage += 5;
    }
  }

  // Bonus for recent postings (within 7 days) - shows active hiring
  const daysSincePosted = Math.floor(
    (Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysSincePosted <= 7) {
    matchPercentage += 5;
  }

  // Cap at 100%
  return Math.min(Math.round(matchPercentage), 100);
};

export const sortJobsByMatch = (jobs, userSkills) => {
  return jobs
    .map(job => ({
      ...job,
      matchScore: calculateMatchScore(job, userSkills)
    }))
    .sort((a, b) => b.matchScore - a.matchScore);
};


export const filterJobsByMatchScore = (jobs, userSkills, minScore = 30) => {
  return sortJobsByMatch(jobs, userSkills).filter(job => job.matchScore >= minScore);
};
