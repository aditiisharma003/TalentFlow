// src/mocks/seedData.js
import { faker } from '@faker-js/faker';

const STAGES = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];
const JOB_STATUSES = ['active', 'archived'];
const TAGS = ['engineering', 'design', 'product', 'marketing', 'sales', 'remote', 'full-time', 'senior', 'junior', 'contract'];

// Generate 25 jobs
export const generateJobs = () => {
  const jobs = [];
  for (let i = 0; i < 25; i++) {
    const isActive = Math.random() > 0.3; // 70% active, 30% archived
    jobs.push({
      id: `job-${i + 1}`,
      title: faker.person.jobTitle(),
      slug: faker.helpers.slugify(faker.person.jobTitle()).toLowerCase(),
      status: isActive ? 'active' : 'archived',
      tags: faker.helpers.arrayElements(TAGS, { min: 2, max: 4 }),
      order: i,
      description: faker.lorem.paragraphs(2),
      department: faker.person.jobArea(),
      location: faker.location.city(),
      salary: `$${faker.number.int({ min: 60, max: 200 })}k - $${faker.number.int({ min: 201, max: 300 })}k`,
      createdAt: faker.date.past({ years: 1 }).toISOString(),
    });
  }
  return jobs;
};

// Generate 1000 candidates
export const generateCandidates = (jobs) => {
  const candidates = [];
  for (let i = 0; i < 1000; i++) {
    const job = faker.helpers.arrayElement(jobs);
    const stage = faker.helpers.arrayElement(STAGES);
    const appliedDate = faker.date.past({ years: 1 });
    
    candidates.push({
      id: `candidate-${i + 1}`,
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      phone: faker.phone.number(),
      stage,
      jobId: job.id,
      jobTitle: job.title,
      resume: faker.internet.url(),
      appliedAt: appliedDate.toISOString(),
      experience: `${faker.number.int({ min: 0, max: 15 })} years`,
      skills: faker.helpers.arrayElements(
        ['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'AWS', 'Docker', 'TypeScript', 'Vue'],
        { min: 3, max: 7 }
      ),
      notes: [],
      timeline: generateTimeline(stage, appliedDate),
    });
  }
  return candidates;
};

// Generate timeline based on current stage
const generateTimeline = (currentStage, appliedDate) => {
  const timeline = [
    {
      stage: 'applied',
      date: appliedDate.toISOString(),
      notes: 'Application submitted',
    },
  ];

  const stageOrder = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];
  const currentIndex = stageOrder.indexOf(currentStage);

  let lastDate = new Date(appliedDate);
  for (let i = 1; i <= currentIndex; i++) {
    lastDate = new Date(lastDate.getTime() + faker.number.int({ min: 1, max: 7 }) * 24 * 60 * 60 * 1000);
    timeline.push({
      stage: stageOrder[i],
      date: lastDate.toISOString(),
      notes: `Moved to ${stageOrder[i]} stage`,
    });
  }

  return timeline;
};

// Generate assessments for jobs
export const generateAssessments = (jobs) => {
  const assessments = [];
  const activeJobs = jobs.filter(j => j.status === 'active').slice(0, 3);

  activeJobs.forEach((job, idx) => {
    const sections = [];
    const numSections = faker.number.int({ min: 2, max: 4 });

    for (let s = 0; s < numSections; s++) {
      const questions = [];
      const numQuestions = faker.number.int({ min: 3, max: 5 });

      for (let q = 0; q < numQuestions; q++) {
        const type = faker.helpers.arrayElement([
          'single-choice',
          'multi-choice',
          'short-text',
          'long-text',
          'numeric',
          'file-upload'
        ]);

        const question = {
          id: `q-${s}-${q}`,
          type,
          text: faker.lorem.sentence() + '?',
          required: Math.random() > 0.3,
        };

        if (type === 'single-choice' || type === 'multi-choice') {
          question.options = Array.from({ length: 4 }, (_, i) => 
            faker.helpers.arrayElement([
              'Yes', 'No', 'Maybe',
              'Strongly Agree', 'Agree', 'Neutral', 'Disagree',
              '0-2 years', '2-5 years', '5+ years',
              'JavaScript', 'Python', 'Java', 'C++'
            ])
          );
        }

        if (type === 'numeric') {
          question.min = 0;
          question.max = 100;
        }

        if (type === 'short-text') {
          question.maxLength = 100;
        }

        if (type === 'long-text') {
          question.maxLength = 500;
        }

        // Add conditional logic to some questions
        if (q > 0 && Math.random() > 0.7) {
          question.conditional = {
            questionId: `q-${s}-${q - 1}`,
            value: 'Yes',
          };
        }

        questions.push(question);
      }

      sections.push({
        id: `section-${s}`,
        title: faker.lorem.words(3),
        description: faker.lorem.sentence(),
        questions,
      });
    }

    assessments.push({
      id: `assessment-${idx + 1}`,
      jobId: job.id,
      title: `${job.title} Assessment`,
      sections,
      createdAt: faker.date.past({ months: 6 }).toISOString(),
    });
  });

  return assessments;
};

// Initialize all seed data
export const initializeSeedData = () => {
  const jobs = generateJobs();
  const candidates = generateCandidates(jobs);
  const assessments = generateAssessments(jobs);

  return {
    jobs,
    candidates,
    assessments,
  };
};