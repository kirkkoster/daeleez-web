import { Routes } from '@angular/router';
import { ChartComponent } from './pages/chart/chart.component';
import { HomeComponent } from './pages/home/home.component';
import { TasksComponent } from './pages/tasks/tasks.component';

export const routes: Routes = [{ path: '', component: HomeComponent },
    { path: 'tasks', component: TasksComponent },
    { path: 'chart', component: ChartComponent },];
