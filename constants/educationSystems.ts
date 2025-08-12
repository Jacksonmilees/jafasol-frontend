// Education System Presets for Global Schools
export interface EducationLevel {
  id: string;
  label: string;
  system: string;
  country?: string;
  levels: string[];
  commonStreams: string[];
}

export const EDUCATION_SYSTEMS: EducationLevel[] = [
  // Kenyan Systems
  {
    id: 'kenya_84_primary',
    label: 'Kenyan Primary (Standard 1-8)',
    system: '8-4-4',
    country: 'Kenya',
    levels: ['Standard 1', 'Standard 2', 'Standard 3', 'Standard 4', 'Standard 5', 'Standard 6', 'Standard 7', 'Standard 8'],
    commonStreams: ['A', 'B', 'C', 'D', 'E']
  },
  {
    id: 'kenya_84_secondary',
    label: 'Kenyan Secondary (Form 1-4)',
    system: '8-4-4',
    country: 'Kenya',
    levels: ['Form 1', 'Form 2', 'Form 3', 'Form 4'],
    commonStreams: ['A', 'B', 'C', 'D', 'E', 'F', 'Science', 'Arts', 'Technical']
  },
  {
    id: 'kenya_cbc_primary',
    label: 'Kenyan CBC Primary (Grade 1-6)',
    system: 'CBC',
    country: 'Kenya',
    levels: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'],
    commonStreams: ['A', 'B', 'C', 'D']
  },
  {
    id: 'kenya_cbc_junior',
    label: 'Kenyan CBC Junior Secondary (Grade 7-9)',
    system: 'CBC',
    country: 'Kenya',
    levels: ['Grade 7', 'Grade 8', 'Grade 9'],
    commonStreams: ['A', 'B', 'C', 'D', 'Science', 'Tech', 'Arts']
  },
  {
    id: 'kenya_cbc_senior',
    label: 'Kenyan CBC Senior Secondary (Grade 10-12)',
    system: 'CBC',
    country: 'Kenya',
    levels: ['Grade 10', 'Grade 11', 'Grade 12'],
    commonStreams: ['Science', 'Arts', 'Technical', 'A', 'B', 'C']
  },

  // American System
  {
    id: 'us_elementary',
    label: 'American Elementary (K-5)',
    system: 'American',
    country: 'United States',
    levels: ['Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'],
    commonStreams: ['A', 'B', 'Red', 'Blue', 'Green', 'Yellow']
  },
  {
    id: 'us_middle',
    label: 'American Middle School (6-8)',
    system: 'American',
    country: 'United States',
    levels: ['Grade 6', 'Grade 7', 'Grade 8'],
    commonStreams: ['A', 'B', 'C', 'Alpha', 'Beta', 'Gamma']
  },
  {
    id: 'us_high',
    label: 'American High School (9-12)',
    system: 'American',
    country: 'United States',
    levels: ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    commonStreams: ['A', 'B', 'C', 'D', 'Honors', 'AP', 'Regular']
  },

  // British System
  {
    id: 'uk_primary',
    label: 'British Primary (Year 1-6)',
    system: 'British',
    country: 'United Kingdom',
    levels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6'],
    commonStreams: ['A', 'B', 'C', 'Red', 'Blue', 'Green']
  },
  {
    id: 'uk_secondary',
    label: 'British Secondary (Year 7-13)',
    system: 'British',
    country: 'United Kingdom',
    levels: ['Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13'],
    commonStreams: ['A', 'B', 'C', 'D', 'E', 'F', 'Science', 'Arts', 'Languages']
  },

  // International Baccalaureate
  {
    id: 'ib_myp',
    label: 'IB Middle Years Programme (MYP 1-5)',
    system: 'International',
    levels: ['MYP 1', 'MYP 2', 'MYP 3', 'MYP 4', 'MYP 5'],
    commonStreams: ['A', 'B', 'C', 'Alpha', 'Beta']
  },
  {
    id: 'ib_dp',
    label: 'IB Diploma Programme (DP 1-2)',
    system: 'International',
    levels: ['DP 1', 'DP 2'],
    commonStreams: ['A', 'B', 'C', 'Sciences', 'Humanities']
  },

  // Indian System
  {
    id: 'india_primary',
    label: 'Indian Primary (Class 1-5)',
    system: 'Indian',
    country: 'India',
    levels: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'],
    commonStreams: ['A', 'B', 'C', 'D']
  },
  {
    id: 'india_secondary',
    label: 'Indian Secondary (Class 6-12)',
    system: 'Indian',
    country: 'India',
    levels: ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'],
    commonStreams: ['A', 'B', 'C', 'D', 'Science', 'Commerce', 'Arts']
  },

  // South African System
  {
    id: 'sa_primary',
    label: 'South African Primary (Grade R-7)',
    system: 'South African',
    country: 'South Africa',
    levels: ['Grade R', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7'],
    commonStreams: ['A', 'B', 'C', 'D']
  },
  {
    id: 'sa_secondary',
    label: 'South African Secondary (Grade 8-12)',
    system: 'South African',
    country: 'South Africa',
    levels: ['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
    commonStreams: ['A', 'B', 'C', 'D', 'Science', 'Commerce', 'Arts']
  },

  // Nigerian System
  {
    id: 'nigeria_primary',
    label: 'Nigerian Primary (Primary 1-6)',
    system: 'Nigerian',
    country: 'Nigeria',
    levels: ['Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6'],
    commonStreams: ['A', 'B', 'C', 'D', 'Gold', 'Silver', 'Bronze']
  },
  {
    id: 'nigeria_secondary',
    label: 'Nigerian Secondary (JSS 1-SSS 3)',
    system: 'Nigerian',
    country: 'Nigeria',
    levels: ['JSS 1', 'JSS 2', 'JSS 3', 'SSS 1', 'SSS 2', 'SSS 3'],
    commonStreams: ['A', 'B', 'C', 'D', 'Science', 'Arts', 'Commercial']
  }
];

// Comprehensive list of common streams across all systems
export const COMMON_STREAMS = [
  // Letter-based
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
  
  // Subject-based
  'Science', 'Arts', 'Commerce', 'Technical', 'Languages', 'Humanities',
  'Sciences', 'Social Sciences', 'Mathematics', 'Literature',
  
  // Level-based
  'Honors', 'AP', 'Regular', 'Advanced', 'Foundation', 'Accelerated',
  
  // Color-based
  'Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'White', 'Black',
  
  // Greek letters
  'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta',
  
  // Directional
  'North', 'South', 'East', 'West', 'Central',
  
  // Metals
  'Gold', 'Silver', 'Bronze', 'Platinum', 'Diamond',
  
  // Numbers
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'
];

// Quick access functions
export const getSystemLevels = (systemId: string): string[] => {
  const system = EDUCATION_SYSTEMS.find(s => s.id === systemId);
  return system ? system.levels : [];
};

export const getSystemStreams = (systemId: string): string[] => {
  const system = EDUCATION_SYSTEMS.find(s => s.id === systemId);
  return system ? system.commonStreams : [];
};

export const getAllLevels = (): string[] => {
  const allLevels = new Set<string>();
  EDUCATION_SYSTEMS.forEach(system => {
    system.levels.forEach(level => allLevels.add(level));
  });
  return Array.from(allLevels).sort();
};
