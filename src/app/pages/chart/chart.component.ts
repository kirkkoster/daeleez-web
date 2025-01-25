import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DailyTask } from '../../shared/models/daily-tasks.interface';
import { DataService } from '../../services/data.service';
import { Habit } from '../../shared/models/habit.interface';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  NgApexchartsModule,
} from 'ng-apexcharts';

export type HeatmapChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgApexchartsModule],
})
export class ChartComponent implements OnInit {
  completedTasks: { date: string; completed: number; incomplete: number }[] =
    [];
  chartTypeControl = new FormControl<string>('donut');
  chartData: any;
  isFadingOut = false;
  chartType: string = 'line';
  chartOptions: any;
  hasHabits: boolean = true;
  hasTasks: boolean = true;
  habits: Habit[] | undefined;
  habitChartOptions!: {
    title: { text: string };
    data: { type: string; dataPoints: { label: string; y: number }[] }[];
  };
  heatmapOptions: any;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    // Load initial charts
    this.loadChartData(this.chartTypeControl.value ?? 'bar');

    // Subscribe to chart type changes
    this.chartTypeControl.valueChanges.subscribe((type) => {
      if (type) {
        this.loadChartData(type);
      }
    });
    this.prepareHeatmapData();
  }

  loadHabits() {}

  prepareHeatmapData() {
    this.habits = this.dataService.getData<Habit>('habits');
    console.log(this.hasHabits);
    if (this.habits?.length > 0) {
      this.hasHabits = true;
      const allDates = Array.from(
        new Set(this.habits.flatMap((habit) => Object.keys(habit.records)))
      ).sort();

      this.heatmapOptions = {
        series: this.habits.map((habit) => ({
          name: habit.name,
          data: allDates.map((date) => {
            const record = habit.records[date];
            return {
              x: date,
              y: record ? record.timeSpent : 0,
            };
          }),
        })),
        chart: {
          type: 'heatmap',
          height: 350,
        },
        xaxis: {
          categories: allDates,
        },
      };
    } else {
      this.hasHabits = false;
    }
  }

  loadChartData(type: string) {
    const allTasks = this.dataService.getData<DailyTask>('dailyTasks') || [];
    if (allTasks.length > 0) {
      this.hasTasks = true;
    } else {
      this.hasTasks = false;
    }
    const groupedData = allTasks.reduce((acc: any, task: any) => {
      acc[task.date] = acc[task.date] || { completed: 0, incomplete: 0 };
      if (task.completed) {
        acc[task.date].completed += 1;
      } else {
        acc[task.date].incomplete += 1;
      }
      return acc;
    }, {});

    const totalCompleted = Object.values(groupedData).reduce(
      (sum: number, entry: any) => sum + entry.completed,
      0
    );
    const totalIncomplete = Object.values(groupedData).reduce(
      (sum: number, entry: any) => sum + entry.incomplete,
      0
    );

    const dates = Object.keys(groupedData);
    if (type === 'donut') {
      this.chartOptions = {
        series: [totalCompleted, totalIncomplete],
        labels: ['Completed Tasks', 'Incomplete Tasks'],
        colors: ['#82C9A2', '#F28A8D'],
        chart: {
          type: 'donut',
          height: 500,
        },

        dataLabels: {
          enabled: true,
          formatter: function (val: number) {
            return val.toFixed(1) + '%'; // Display percentages
          },
        },
        plotOptions: {
          pie: {
            customScale: 1.0,
            donut: {
              size: '65%',
            },
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  offsetX: 0,
                  offsetY: 0,
                },
                legend: {
                  position: 'bottom',
                },
              },
            },
          ],
        },
      };
    } else {
      // Handle other chart types (e.g., line, bar, etc.)
      const dataPoints = Object.keys(groupedData).map((date) => ({
        x: date,
        y: groupedData[date].completed,
      }));

      this.chartOptions = {
        series: [
          {
            name: 'Completed Tasks',
            data: dates.map((date) => groupedData[date].completed),
          },
          {
            name: 'Incomplete Tasks',
            data: dates.map((date) => groupedData[date].incomplete),
          },
        ],
        chart: {
          height: 350,
          type: type === 'bar' ? 'bar' : type, // Allow bar or line types
          stacked: type === 'bar', // Enable stacking only for bar charts
        },
        xaxis: {
          categories: dates,
        },
        labels: dataPoints.map((dp) => dp.x),
        colors: ['#6cb2eb', '#e57373'], // Colors for completed and incomplete
        legend: {
          position: 'top',
        },
      };
    }
  }

  updateChart(type: string) {
    this.loadChartData(type); // Load the data for the selected chart type
  }
}
