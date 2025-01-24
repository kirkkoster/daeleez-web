import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DailyTask } from '../../shared/models/daily-tasks.interface';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, CanvasJSAngularChartsModule], // Add ReactiveFormsModule here
})
export class ChartComponent implements OnInit {
  completedTasks: { date: string; completed: number; incomplete: number; }[] = [];
  chartTypeControl = new FormControl<string>('pie');
  chartData: any;
  isFadingOut = false;
  chartType: string = 'line';

  chartOptions: any;

  ngOnInit() {
    this.addDummyData(); // Add dummy data for testing
    this.loadChartData(this.chartTypeControl.value ?? 'line'); // Load default chart type
  
    this.chartTypeControl.valueChanges.subscribe((type) => {
      this.loadChartData(type ?? 'line'); // Handle null values
    });
  }

  loadChartData(type: string) {
    const storedTasks = localStorage.getItem('dailyTasks');
    const allTasks = storedTasks ? JSON.parse(storedTasks) : [];

    const groupedData = allTasks.reduce((acc: any, task: any) => {
      acc[task.date] = acc[task.date] || { completed: 0, incomplete: 0 };
      if (task.completed) {
        acc[task.date].completed += 1;
      } else {
        acc[task.date].incomplete += 1;
      }
      return acc;
    }, {});

    this.chartOptions = {
      title: {
        text: 'Task Completion Over Time',
      },
      data: [
        {
          type: type,
          dataPoints: Object.keys(groupedData).map((date) => ({
            label: date,
            y: type === 'pie' 
              ? groupedData[date].completed + groupedData[date].incomplete 
              : groupedData[date].completed,
          })),
        },
      ],
    };
  }

  addDummyData() {
    const dummyTasks = [
      { id: 1, text: "Task 1", isSelected: false, date: "2025-01-19", completed: true },
      { id: 2, text: "Task 2", isSelected: false, date: "2025-01-19", completed: true },
      { id: 3, text: "Task 3", isSelected: false, date: "2025-01-19", completed: false },
      { id: 4, text: "Task 4", isSelected: false, date: "2025-01-20", completed: true },
      { id: 5, text: "Task 5", isSelected: false, date: "2025-01-20", completed: false },
      { id: 6, text: "Task 6", isSelected: false, date: "2025-01-21", completed: true },
      { id: 7, text: "Task 7", isSelected: false, date: "2025-01-21", completed: false },
      { id: 8, text: "Task 8", isSelected: false, date: "2025-01-22", completed: true },
      { id: 9, text: "Task 9", isSelected: false, date: "2025-01-22", completed: true },
      { id: 10, text: "Task 10", isSelected: false, date: "2025-01-23", completed: false },
    ];
  
    localStorage.setItem("dailyTasks", JSON.stringify(dummyTasks));
  }
  

  updateChart(type: string) {
    switch (type) {
      case 'pie':
        this.loadChartData('pie')
    break;
      case 'line':
        this.loadChartData('line')
    break;
      case 'heatmap':
        break;
    }
  }

  // preparePieChartData() {
  //   const totalCompleted = this.completedTasks.reduce((sum, task) => sum + task.completed, 0);
  //   const totalIncomplete = this.completedTasks.reduce((sum, task) => sum + task.incomplete, 0);
  
  //   this.chartData = {
  //     labels: ['Completed', 'Incomplete'],
  //     datasets: [
  //       {
  //         data: [totalCompleted, totalIncomplete],
  //         backgroundColor: ['#6cb2eb', '#e0e0e0'],
  //       },
  //     ],
  //   };
  // }

  // prepareLineChartData() {
  //   this.chartData = {
  //     labels: this.completedTasks.map((task) => task.date), // Dates on the X-axis
  //     datasets: [
  //       {
  //         label: 'Completed Tasks',
  //         data: this.completedTasks.map((task) => task.completed),
  //         borderColor: '#6cb2eb',
  //         fill: false,
  //       },
  //       {
  //         label: 'Incomplete Tasks',
  //         data: this.completedTasks.map((task) => task.incomplete),
  //         borderColor: '#e57373',
  //         fill: false,
  //       },
  //     ],
  //   };
  // }
  
}
