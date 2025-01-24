import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DailyTask } from '../../shared/models/daily-tasks.interface';
import { DataService } from '../../services/data.service';

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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dataService: DataService // Inject the data service
  ) {}

  ngOnInit() {
    const today = new Date().toISOString().split('T')[0];
    const allTasks = this.dataService.getData<DailyTask>('dailyTasks'); // Use DataService

    // Filter tasks for today
    this.tasks = allTasks.filter((task) => task.date === today);
  }

  toggleTaskSelection(task: DailyTask) {
    task.isSelected = !task.isSelected;

    // Save updated tasks using the DataService
    this.dataService.saveData('dailyTasks', this.tasks);
  }

  markTaskComplete(task: DailyTask) {
    task.isSelected = !task.isSelected;

    // Save updated tasks using the DataService
    this.dataService.saveData('dailyTasks', this.tasks);
  }

  toggleSelection(task: DailyTask) {
    // Toggle the isSelected property
    task.isSelected = !task.isSelected;
  }

  saveTasks() {
    // Save incomplete tasks back to the storage
    const incompleteTasks = this.tasks.filter((task) => !task.isSelected);
    this.dataService.saveData('dailyTasks', incompleteTasks);
  }

  endDay() {
    const today = new Date().toISOString().split('T')[0];

    const completedTasks = this.tasks.filter((task) => task.isSelected);
    const incompleteTasks = this.tasks.filter((task) => !task.isSelected);

    // Show an encouraging alert
    alert(
      `Great job! You completed ${completedTasks.length} tasks.\n` +
        (incompleteTasks.length
          ? `It’s okay! We’ll try to finish the rest tomorrow.`
          : `You completed all your tasks!`)
    );

    // Retrieve all tasks from storage
    const allTasks = this.dataService.getData<DailyTask>('dailyTasks');

    // Update tasks with completed/incomplete status
    const updatedTasks: DailyTask[] = this.tasks.map((task) => ({
      ...task,
      completed: task.isSelected,
    }));

    // Merge today's tasks with existing tasks in storage
    const filteredTasks = allTasks.filter((task) => task.date !== today);
    const newTasks = [...filteredTasks, ...updatedTasks];

    // Save updated tasks back to storage using DataService
    this.dataService.saveData('dailyTasks', newTasks);

    // Trigger fade-out animation
    this.isFadingOut = true;

    setTimeout(() => {
      this.router.navigate(['/chart']);
    }, 1400); // Matches the fade-out duration
  }
}
