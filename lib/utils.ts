export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export function validateStudent(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (data.Student_ID == null || isNaN(Number(data.Student_ID))) {
    errors.push('Student_ID is required and must be a number');
  }

  if (data.Age == null || Number(data.Age) < 10 || Number(data.Age) > 100) {
    errors.push('Age must be between 10 and 100');
  }

  if (!data.Gender || !['Male', 'Female', 'Non-binary'].includes(data.Gender)) {
    errors.push('Gender must be Male, Female, or Non-binary');
  }

  if (!data.Academic_Level || !['High School', 'Undergraduate', 'Graduate', 'PhD'].includes(data.Academic_Level)) {
    errors.push('Academic_Level must be High School, Undergraduate, Graduate, or PhD');
  }

  if (!data.Country || String(data.Country).trim().length === 0) {
    errors.push('Country is required');
  }

  if (data.Avg_Daily_Usage_Hours == null || Number(data.Avg_Daily_Usage_Hours) < 0) {
    errors.push('Avg_Daily_Usage_Hours must be a non-negative number');
  }

  if (!data.Most_Used_Platform || String(data.Most_Used_Platform).trim().length === 0) {
    errors.push('Most_Used_Platform is required');
  }

  if (!data.Affects_Academic_Performance || !['Yes', 'No'].includes(data.Affects_Academic_Performance)) {
    errors.push('Affects_Academic_Performance must be Yes or No');
  }

  if (data.Sleep_Hours_Per_Night == null || Number(data.Sleep_Hours_Per_Night) < 0 || Number(data.Sleep_Hours_Per_Night) > 24) {
    errors.push('Sleep_Hours_Per_Night must be between 0 and 24');
  }

  if (data.Mental_Health_Score == null || Number(data.Mental_Health_Score) < 1 || Number(data.Mental_Health_Score) > 10) {
    errors.push('Mental_Health_Score must be between 1 and 10');
  }

  if (data.Conflicts_Over_Social_Media == null || Number(data.Conflicts_Over_Social_Media) < 0) {
    errors.push('Conflicts_Over_Social_Media must be a non-negative number');
  }

  if (data.Addicted_Score == null || Number(data.Addicted_Score) < 1 || Number(data.Addicted_Score) > 10) {
    errors.push('Addicted_Score must be between 1 and 10');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

