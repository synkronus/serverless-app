export interface Student {
  id?: string;
  Student_ID: number;
  Age: number;
  Gender: 'Male' | 'Female' | 'Non-binary';
  Academic_Level: 'High School' | 'Undergraduate' | 'Graduate' | 'PhD';
  Country: string;
  Avg_Daily_Usage_Hours: number;
  Most_Used_Platform: string;
  Affects_Academic_Performance: 'Yes' | 'No';
  Sleep_Hours_Per_Night: number;
  Mental_Health_Score: number;
  Relationship_Status: string;
  Conflicts_Over_Social_Media: number;
  Addicted_Score: number;
}

export interface StudentFormData extends Omit<Student, 'id'> {}

