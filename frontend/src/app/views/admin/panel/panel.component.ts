import { Component } from '@angular/core';
import { PanelService } from './panel.service';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from '../../../core/services/session.service';
import { PanelInterface } from '../../../interfaces/panel.interface';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent{

  //PanelInterface
  public panelInformation: PanelInterface = {} as PanelInterface; //PanelInterface with general information that will be displayed in the panel template

  //Bar chart data will be retrieved in BarChart Component
  public barChartTitle: string = 'Visits this month'; //Bar chart title
  public barChartSeriesName: string = 'Visits this month'; //Bar chart series name

  //In pie chart, we will pass the data which is the number of comments and number of likes of all posts
  public pieChartLabels: Array<string> = ['Comments', 'Likes']; //Pie chart labels
  public pieChartData: Array<number> = [] as Array<number>; //Pie chart data

  public showMaxMinVisitsData: boolean = false; //Shows the most and the least visited article or not
  public showPieChartData: boolean = false; //Shows the pie chart or not

  public ok: boolean = false //If everything is ready or not
  public userId: string = ''; //userId to pass as input to child components

  constructor(private panelService: PanelService,
              private router: ActivatedRoute,
              private sessionService: SessionService) { }

  ngOnInit(): void {
    //Defines PanelInterface with data from PanelResolver
    this.panelInformation = this.router.snapshot.data.panelInformation.result[0];

    //If we have enough data, shows the most and the least visited article
    if (this.panelInformation.getArticleWithMostVisits.length > 0 && this.panelInformation.getArticleWithLeastVisits.length > 0) {
      if (this.panelInformation.getArticleWithMostVisits[0]._id !== this.panelInformation.getArticleWithLeastVisits[0]._id) {
        this.showMaxMinVisitsData = true;
      }
    }

    //Defines pie chart data with data from database. This chart will display comments and likes
    this.pieChartData = [this.panelInformation.countComments[0].totalComments, this.panelInformation.countLikes[0].totalLikes]

    //Let's check if we have enough comments and likes to show the pie chart
    if (this.pieChartData[0] > 0 && this.pieChartData[1] > 0) {
      this.showPieChartData = true;
    }

    //Defines userId with the id of the signed in user in case we need to pass the id via @Input to the charts components or any other components
    this.userId = this.sessionService.userId;
  }

}
