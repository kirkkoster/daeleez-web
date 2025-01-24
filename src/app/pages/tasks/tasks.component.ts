import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DailyTask } from '../../shared/models/daily-tasks.interface';

@Component({
  selector: 'app-tasks',
  standalone: true,
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  imports: [ReactiveFormsModule],
})
export class TasksComponent implements OnInit {
  tasks: DailyTask[] = [];
  tasksForm!: FormGroup;
  isFadingOut = false;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    const today = new Date().toISOString().split('T')[0];
    const storedData = localStorage.getItem('dailyTasks');
    if (storedData) {
      const allTasks: DailyTask[] = JSON.parse(storedData);
      // Filter tasks for today
      this.tasks = allTasks.filter((task) => task.date === today);
    } else {
      this.tasks = [];
    }
  }

  toggleTaskSelection(task: DailyTask) {
    task.isSelected = !task.isSelected;
  
    // Optional: Save the updated tasks to localStorage immediately
    localStorage.setItem('dailyTasks', JSON.stringify(this.tasks));
  }

  markTaskComplete(task: DailyTask) {
    task.isSelected = !task.isSelected;
    localStorage.setItem('dailyTasks', JSON.stringify(this.tasks));
  }

  toggleSelection(task: DailyTask) {
    // Toggle the isSelected property
    task.isSelected = !task.isSelected;
  }

  saveTasks() {
    // Save incomplete tasks back to localStorage
    const incompleteTasks = this.tasks
      .filter((task) => !task.isSelected)
      .map((task) => task.text);
    localStorage.setItem('dailyTasks', JSON.stringify(incompleteTasks));
  }

  endDay() {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
  
    const completedTasks = this.tasks.filter((task) => task.isSelected);
    const incompleteTasks = this.tasks.filter((task) => !task.isSelected);
  
    // Show an encouraging alert
    alert(
      `Great job! You completed ${completedTasks.length} tasks.\n` +
        (incompleteTasks.length
          ? `It’s okay! We’ll try to finish the rest tomorrow.`
          : `You completed all your tasks!`)
    );
  
    // Retrieve all tasks from localStorage
    const storedData = localStorage.getItem('dailyTasks');
    const allTasks: DailyTask[] = storedData ? JSON.parse(storedData) : [];
  
    // Update tasks with completed/incomplete status
    const updatedTasks: DailyTask[] = this.tasks.map((task) => ({
      ...task,
      completed: task.isSelected,
    }));
  
    // Merge today's tasks with existing tasks in localStorage
    const filteredTasks = allTasks.filter((task) => task.date !== today);
    const newTasks = [...filteredTasks, ...updatedTasks];
  
    // Save updated tasks back to localStorage
    localStorage.setItem('dailyTasks', JSON.stringify(newTasks));
  
    // Trigger fade-out animation
    this.isFadingOut = true;
  
    setTimeout(() => {
      this.router.navigate(['/chart']);
    }, 1400); // Matches the fade-out duration
  }
  
}
