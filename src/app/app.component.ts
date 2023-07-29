import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { RoleConverterPipe } from './pipes/role-converter.pipe';
import { AssetServiceService } from './services/asset-service.service';
import { AuthenticatorService } from './services/authenticator.service';
import { UserMasterService } from './services/user-master.service';
import { WalletService } from './services/wallet.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'logistic-template';
  subMenuState: boolean = false;
  register:boolean = false;
  // classToggle:string="sidebar-mini";
  constructor(private router: Router,
    private authenticatorService : AuthenticatorService,
    private assetServiceService: AssetServiceService,
    private renderer: Renderer2,
    private datePipe:DatePipe,
    private roleConvertor: RoleConverterPipe,
    private titlecase: TitleCasePipe,
    private walletService:WalletService
    ) {
    // on route change to '/login', set the variable showHead to false
      router.events.forEach((event) => {
        if (event instanceof NavigationStart) {
          // console.log(event['url'])
          if (event['url'] == '/login' || event['url'] == '/'){
            this.subMenuState = false;
            this.register = false;
          } else if(event['url'] == '/register'){
            this.register = true;
          }
          else {
            // console.log("NU")
            this.subMenuState = true;
          }
        }
      });
    }



@ViewChild('messagebox') div!: ElementRef ;
  inputText: FormGroup = new FormGroup({
    text: new FormControl('', Validators.required)
  });


  isVisible = false;
  addAssetId = false;
  messageList: string[] = [];
  classList: string[] = [];

  showChat(){
    this.isVisible = ! this.isVisible;
  }
  closeChat(){
    this.isVisible = false;
  }

  getDetails(data: string, isassetId:boolean){
    // console.log(data);
    this.addUserMessage(data);

    if(!isassetId){
      if(data == 'My Funds'){
        this.walletService.getFunds().subscribe((response:any) => {
          this.addBotMessage(`You have ${response} LST in your wallet.`);
          this.renderBotOptions();
        });
      
      this.addAssetId = false;
      }
      else if(data == 'Asset Tracking Details'){
        this.addAssetId = true;
        this.addBotMessage('please Enter asset Id');
      }
      else if(data == 'User Details'){
        this.authenticatorService.getCurrentUser(localStorage.getItem('access-token')||'').subscribe((response:any)=>{
          this.addBotMessage(`User Details are:
          <ul class="list-unstyled">
            <li class="no-style"> Name : ${response.name}</li>
            <li>Email Id : ${response.email} </li>
            <li>Role : ${this.titlecase.transform(this.roleConvertor.transform(response.roles))} </li>
          </ul> `);
          this.renderBotOptions();
        });
      
      this.addAssetId = false;
      }
    }
    else if(data!='' && this.addAssetId){
      this.inputText.reset();
      this.assetServiceService.fnGetTransactionTrackingDetails(data).subscribe((res:any) => {      
        let msg = `Asset Tracking Details are : <ul> `
        for(let i=0; i<res.transactions.length; i++){
          msg = msg + `<li>${res.transactions[i].trackingMessage} on ${this.datePipe.transform(res.transactions[i].transactionTime, 'mediumTime')} </li>`
        }
        msg = msg + `</ul>`
        this.addBotMessage(msg)
        this.renderBotOptions();
      });
      this.addAssetId = false;
    }
    else{
      this.addBotMessage("I'm sorry, I didn't understand what you are trying to say, Please select one of the options above.")
      this.inputText.reset();
      this.renderBotOptions();
    }    
    
    // if(!this.addAssetId){
    //   this.renderBotOptions();
    // }
  }



  addUserMessage(msg:string){
    this.div.nativeElement.insertAdjacentHTML('beforeend',
    `<div class="d-flex align-items-baseline text-end justify-content-end mb-4">
            <div class="pe-2">
                <div>
                    <div class="card card-text d-inline-block p-2 px-3 m-1 " style="border-radius: 30px 30px 0px 30px;background-color: rgba(26, 26, 27, 0.171);">
                      <p> ${msg}  </p>
                    </div>
                    <div>
                      <div class="small ">You</div>
                  </div>
  
                </div>
            </div>
        </div>`
    );
    this.div.nativeElement.scrollTop = this.div.nativeElement.scrollHeight;

  }
  addBotMessage(msg:string){
    this.div.nativeElement.insertAdjacentHTML('beforeend',
      `<div class="d-flex align-items-baseline mb-4">
              <div class="pe-2">
                  <div>
                      <div class="card card-text d-inline-block p-2 px-3 m-1 " style="border-radius: 30px 30px 30px 0px;background-color: rgb(201, 221, 235);">
                        <p> ${msg}  </p>
                      </div>
                      <div>
                        <div class="small ">ChatBot</div>
                    </div>
    
                  </div>
              </div>
          </div>`
      );
      this.div.nativeElement.scrollTop = this.div.nativeElement.scrollHeight;
  }

  renderBotOptions(){
    const btn1: HTMLButtonElement = this.renderer.createElement('button');
    btn1.classList.add("btn", "btn-sm", "btn-primary", "p-2", "m-2");
    btn1.innerText = "My Funds";
    this.renderer.listen(btn1, 'click', () => {this.getDetails('My Funds', false)});

    const btn2: HTMLButtonElement = this.renderer.createElement('button');
    btn2.classList.add("btn", "btn-sm", "btn-primary", "p-2", "m-2");
    btn2.innerText = "Asset Tracking Details";
    this.renderer.listen(btn2, 'click', () => {this.getDetails('Asset Tracking Details', false)});

    const btn3: HTMLButtonElement = this.renderer.createElement('button');
    btn3.classList.add("btn", "btn-sm", "btn-primary", "p-2", "m-2");
    btn3.innerText = "User Details";
    this.renderer.listen(btn3, 'click', () => {this.getDetails('User Details', false)});

    const small1 = this.renderer.createElement("small");
    this.renderer.appendChild(small1, btn1);
    this.renderer.appendChild(small1, btn2);
    this.renderer.appendChild(small1, btn3);

    const p1: HTMLParagraphElement = this.renderer.createElement('p');
    p1.innerHTML = "Hi, I am here to help you resolve queries. Kindly select below one option!";

    const p2 : HTMLParagraphElement = this.renderer.createElement('p');
    this.renderer.appendChild(p1, small1);

    const div4: HTMLDivElement = this.renderer.createElement("div");
    div4.classList.add("small");
    div4.innerText = "Chatbot";

    const div3: HTMLDivElement = this.renderer.createElement("div");
    div3.classList.add("card", "card-text", "myBox", "d-inline-block", "p-2", "px-3", "m-1");
    this.renderer.appendChild(div3, p1);
    this.renderer.appendChild(div3, p2);
    

    const div2 : HTMLDivElement = this.renderer.createElement('div');
    div2.classList.add("pe-2");
    this.renderer.appendChild(div2, div3);
    this.renderer.appendChild(div2, div4);

    const div1 : HTMLDivElement = this.renderer.createElement('div');
    div1.classList.add("d-flex", "align-items-baseline", "mb-4");
    this.renderer.appendChild(div1, div2);
    this.renderer.appendChild(this.div.nativeElement, div1);
    this.div.nativeElement.scrollTop = this.div?.nativeElement.scrollHeight ;
  }

}
