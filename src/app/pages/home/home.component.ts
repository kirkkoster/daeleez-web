import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { DailyTask } from '../../shared/models/daily-tasks.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [ReactiveFormsModule],
})
export class HomeComponent {
  tasksForm: FormGroup;
  isFadingOut = false;
  tasks: DailyTask[] = []; // List of tasks
  newTaskText: string = ''; // Holds the text for the new task

  constructor(private fb: FormBuilder, private router: Router) {
    this.tasksForm = new FormGroup({
      taskInput: new FormControl(''), // Task input control
    });
  }

  ngOnInit() {
    const storedTasks = localStorage.getItem('tasks');
    const today = new Date().toISOString().split('T')[0]; // Get today's date

    if (storedTasks) {
      const allTasks: DailyTask[] = JSON.parse(storedTasks);
      // Filter tasks for today
      this.tasks = allTasks.filter((task) => task.date === today);
    } else {
      this.tasks = [];
    }
  }

  resetData() {
    const today = new Date().toISOString().split('T')[0];
  
    // Retrieve all tasks from localStorage
    const storedTasks = localStorage.getItem('dailyTasks');
    const allTasks = storedTasks ? JSON.parse(storedTasks) : [];
  
    // Filter out today's tasks
    const updatedTasks = allTasks.filter((task: any) => task.date !== today);
  
    // Save the updated tasks back to localStorage
    localStorage.setItem('dailyTasks', JSON.stringify(updatedTasks));
  
    // Clear the form
    this.tasksForm.reset();
  
    // Clear the in-memory tasks array
    this.tasks = [];
  }

  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  addTask(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.tasksForm.value.taskInput.trim() !== '') {
      const today = new Date().toISOString().split('T')[0];

      this.tasks.push({
        id: this.tasks.length + 1, // Generate a unique ID
        text: this.tasksForm.value.taskInput.trim(),
        isSelected: false,
        date: today,
        completed: false
      });

      // Save the updated task list to localStorage
      const storedTasks = localStorage.getItem('dailyTasks');
      const allTasks: DailyTask[] = storedTasks ? JSON.parse(storedTasks) : [];
      const otherTasks = allTasks.filter((task) => task.date !== today); // Keep non-today tasks
      localStorage.setItem(
        'dailyTasks',
        JSON.stringify([...otherTasks, ...this.tasks])
      );

      this.tasksForm.reset();
    }
  }

  startDay() {
    if (this.tasks.length) {
      this.isFadingOut = true;
      setTimeout(() => {
        this.router.navigate(['/tasks']);
      }, 1400);
    }
  }
}
