import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Habit } from '../../shared/models/habit.interface';

@Component({
  selector: 'app-habit-tracker',
  standalone: true,
  templateUrl: './habit-tracker.component.html',
  styleUrls: ['./habit-tracker.component.scss'],
  imports: [ReactiveFormsModule],
})
export class HabitTrackerComponent implements OnInit {
  habits: Habit[] = [];
  habitForm: FormGroup;
  isFadingOut = false;

  constructor(private fb: FormBuilder, private dataService: DataService) {
    // Initialize the habit form
    this.habitForm = this.fb.group({
      name: ['', Validators.required],
      frequency: [[Validators.required, Validators.min(1)]],
      duration: [[Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit() {
    // Load habits from the DataService
    this.habits = this.dataService.getData<Habit>('habits') || [];
  }

  addHabit() {
    if (this.habitForm.valid) {
      const newHabit: Habit = {
        id: this.habits.length + 1, // Unique ID
        name: this.habitForm.value.name.trim(),
        records: {}, // Empty records initially
        frequency: this.habitForm.value.frequency, // Times per week
        duration: this.habitForm.value.duration, // Duration in minutes per session
      };

      // Add new habit to the list and save
      this.habits.push(newHabit);
      this.dataService.saveData('habits', this.habits);

      // Clear the form
      this.habitForm.reset({ frequency: 1, duration: 10 });
    }
  }

  deleteHabit(habitId: number) {
    // Filter out the habit to be deleted
    this.habits = this.habits.filter((habit) => habit.id !== habitId);
  
    // Save the updated habits back to the DataService
    this.dataService.saveData('habits', this.habits);
  }
  

 logMinutes(habit: Habit, date: string, $event: any) {
  let minutes = $event.target.value
  const timeSpent = Number(minutes) || 0; // Convert to a number, default to 0
  if (!habit.records[date]) {
    habit.records[date] = { completed: false, timeSpent: 0 };
  }
  habit.records[date].timeSpent = timeSpent;
  habit.records[date].completed = timeSpent >= habit.duration; // Mark as completed if time meets/exceeds duration
  this.dataService.saveData('habits', this.habits);
}

  getDatesForDisplay(): string[] {
    const dates = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date.toISOString().split('T')[0]); // Format: YYYY-MM-DD
    }
    return dates;
  }
}
