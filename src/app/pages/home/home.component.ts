import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { DailyTask } from '../../shared/models/daily-tasks.interface';
import { DataService } from '../../services/data.service';

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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dataService: DataService // Inject DataService
  ) {
    this.tasksForm = new FormGroup({
      taskInput: new FormControl(''), // Task input control
    });
  }

  ngOnInit() {
    const today = new Date().toISOString().split('T')[0]; // Get today's date
    const allTasks = this.dataService.getData<DailyTask>('dailyTasks'); // Use DataService

    // Filter tasks for today
    this.tasks = allTasks.filter((task) => task.date === today);
  }

  resetData() {
    const today = new Date().toISOString().split('T')[0];

    // Retrieve all tasks from DataService
    const allTasks = this.dataService.getData<DailyTask>('dailyTasks');

    // Filter out today's tasks
    const updatedTasks = allTasks.filter((task) => task.date !== today);

    // Save the updated tasks back using DataService
    this.dataService.saveData('dailyTasks', updatedTasks);

    // Clear the form
    this.tasksForm.reset();

    // Clear the in-memory tasks array
    this.tasks = [];
  }

  addTask(event?: KeyboardEvent) {
    if (!event || (event.type === 'submit' || (event instanceof KeyboardEvent && event.key === 'Enter'))) {
      const taskText = this.tasksForm.value.taskInput.trim();
      if (taskText !== '') {
        const today = new Date().toISOString().split('T')[0];
  
        // Create a new task
        const newTask: DailyTask = {
          id: this.tasks.length + 1, // Generate a unique ID
          text: taskText,
          isSelected: false,
          date: today,
          completed: false,
        };
  
        // Add the task to the in-memory array
        this.tasks.push(newTask);
  
        // Retrieve all tasks from DataService
        const allTasks = this.dataService.getData<DailyTask>('dailyTasks');
  
        // Remove today's tasks and add updated tasks
        const otherTasks = allTasks.filter((task) => task.date !== today);
        this.dataService.saveData('dailyTasks', [...otherTasks, ...this.tasks]);
  
        // Reset the form
        this.tasksForm.reset();
      }
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
