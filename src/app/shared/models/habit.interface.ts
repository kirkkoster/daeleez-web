export interface Habit {
    id: number; // Unique identifier for each habit
    name: string; // Name of the habit
    frequency: number; // How many times per week the habit should be completed
    duration: number; // Duration of the habit in minutes per session
    records: {
      [date: string]: {
        completed: boolean; // Whether the habit was completed on this date
        timeSpent: number; // Time spent on the habit in minutes
      };
    }; // Record of daily completion and time spent
  }
  