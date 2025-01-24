import { Routes } from '@angular/router';
import { ChartComponent } from './pages/chart/chart.component';
import { HomeComponent } from './pages/home/home.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { HabitTrackerComponent } from './pages/habit-tracker/habit-tracker.component';

export const routes: Routes = [{ path: '', component: HomeComponent },
    { path: 'tasks', component: TasksComponent },
    { path: 'chart', component: ChartComponent },
    { path: 'habits', component: HabitTrackerComponent },
];
