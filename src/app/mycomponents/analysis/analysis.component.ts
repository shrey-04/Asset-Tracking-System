import { DashboardService } from './../../services/dashboard.service';
import { Component, OnInit } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css'],
})
export class AnalysisComponent implements OnInit {
  constructor(
    private dashboardService: DashboardService,
    private titleCasePipe: TitleCasePipe
  ) {}
  myChart!: any;
  myChart2!: any;

  chartLabels: string[] = [];
  chartData: number[] = [];

  chartLabels2: string[] = [];
  chartData2: number[] = [];

  ngOnInit(): void {
    this.dashboardService.getAssetCountBasedOnCities().subscribe((res: any) => {
      res.assetCountBasedOnCities.forEach((asset: any) => {
        let index;
        if(!this.chartLabels.includes(this.titleCasePipe.transform(asset.city))){
          this.chartLabels.push(this.titleCasePipe.transform(asset.city));
          this.chartData.push(asset.assetCount);
        }
        else{
          index = this.chartLabels.indexOf(this.titleCasePipe.transform(asset.city));
          this.chartData[index] = this.chartData[index] + asset.assetCount
        }
        
        
      });
      this.createCityBasedAssetCountChart();
    });

    this.dashboardService.getMonthlyAssetCount().subscribe((res: any) => {
      res.monthlyAssetCountList.forEach((asset: any) => {
        this.chartLabels2.push(this.titleCasePipe.transform(asset.month));
        this.chartData2.push(asset.assetCount);
      });
      this.createMonthlyAssetCountBarChart();
    });
  }

  createMonthlyAssetCountBarChart(): void {
    const data = {
      labels: this.chartLabels2,
      datasets: [
        {
          label: 'Assets',
          data: this.chartData2,
          backgroundColor: ['rgba(54, 162, 235, 0.2)'],
          borderColor: ['rgb(54, 162, 235)'],
          borderWidth: 1,
        },
      ],
    };

    this.myChart = new Chart('barChart', {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  createCityBasedAssetCountChart(): void {
    const labels = this.chartLabels;
    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Assets',
          data: this.chartData,
          backgroundColor: ['rgba(153, 102, 255, 0.2)'],
          borderColor: ['rgb(153, 102, 255)'],
          borderWidth: 1,
        },
      ],
    };

    this.myChart2 = new Chart('barChart2', {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
