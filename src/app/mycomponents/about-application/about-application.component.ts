import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-about-application',
  templateUrl: './about-application.component.html',
  styleUrls: ['./about-application.component.css']
})
export class AboutApplicationComponent implements OnInit {


  constructor(private loginService: LoginService) { }
  ngOnInit(): void {
  }


}
