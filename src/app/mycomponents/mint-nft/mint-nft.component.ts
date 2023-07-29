import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NftMetadata } from 'src/app/interfaces/nft-metadata';
import { NftMarketPlaceService } from 'src/app/services/nft-market-place.service';
import { NftService } from 'src/app/services/nft.service';
import { WalletService } from 'src/app/services/wallet.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mint-nft',
  templateUrl: './mint-nft.component.html',
  styleUrls: ['./mint-nft.component.css']
})
export class MintNftComponent implements OnInit {

  src:any;
  pdfFile:any;
  metaData: NftMetadata = {
    fileCID:'', sellerName:'', price:0, NFTtype:'', NFTName:'', sellerLoginId:'', sellerAddress:'', sellerMobileNo:''
  };

  userName!: string;
  mintNFT !: FormGroup ;
  walletAddress!:string;
  fileUploaded:boolean = false;
  showForm:boolean = false;

  constructor(private nftService: NftService, 
    private nftMarketService: NftMarketPlaceService,
    private router: Router,
    private walletService: WalletService) {
    this.userName = localStorage.getItem('name') || '';
    
    this.walletService.getWalletKeys().subscribe((response:any) => {
      // console.log(response);
      this.walletAddress = response.accountAddress;
      this.mintNFT = new FormGroup({
        userName: new FormControl(this.userName, Validators.required),
        userAddress: new FormControl(this.walletAddress, Validators.required),
        nftName: new FormControl('', Validators.required),
        price : new FormControl('', [Validators.required, Validators.min(1)]),
        type : new FormControl('Select', Validators.required),
        file : new FormControl(undefined, Validators.required)
      });
      this.showForm = true;
    });
   }

   afuConfig = {
    multiple: false,
    formatsAllowed: ".pdf",
    uploadAPI:  {
      url:"",
    },
    // theme: "dragNDrop",
    replaceTexts: {
      selectFileBtn: 'Select Files',
      resetBtn: 'Reset',
      uploadBtn: 'Upload',
      dragNDropBox: 'Drag N Drop',
      // afterUploadMsg_success: '',
      // afterUploadMsg_error: '',
      sizeLimit: ''
    }
};

  ngOnInit(): void {
  }

  onFileChange(event: any){
    const file = event.target.files[0];
    if(file.type!='application/pdf'){
      this.src = undefined;
      this.mintNFT.controls['file'].reset();
      Swal.fire({
        title: 'File Format should be PDF',
        text: 'Please upload correct file!',
        icon: 'error'
      });
  
    }
    else {
      this.pdfFile = file;
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => {      
        this.src = reader.result;
      };
    }
    
    
  
  
  }

  fileSelected(event: any){
    // console.log("Selected");
    const file = event.target.files[0];
    this.pdfFile = file;
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {      
      this.src = reader.result;
  };
    
  }
  docUpload(){
    const reader = new FileReader();
    const formdata: FormData = new FormData();
    formdata.append('file', this.pdfFile);

    Swal.fire({
      title: "Are you sure?",
      showCancelButton: true,
      showConfirmButton: true
    })
    .then((alert:any) => {
      if (alert.isConfirmed) {
        this.initialLoader('Uploading to IPFS...');
        this.nftService.getCIDOfFile(formdata).subscribe((res:any)=>{
          // console.log("--------Pinata file Response------",res);
          this.metaData.fileCID = res.IpfsHash;
          this.fileUploaded = true;

          Swal.fire({
            text: `File Uploaded to IPFS`,
            icon: "success",
          });
        });
      } else {
        Swal.fire({
          text:`Document not uploaded!`,
          icon:"info"
        }).then(res=>{
        });
      }
    });

    
    
  }

  createNFT(){

    const reader = new FileReader();
    const formdata: FormData = new FormData();
    formdata.append('file', this.pdfFile);

    this.metaData.NFTtype = this.mintNFT.controls['type'].value;
    this.metaData.price = this.mintNFT.controls['price'].value;
    this.metaData.NFTName = this.mintNFT.controls['nftName'].value;
    this.metaData.sellerName = this.userName;
    this.metaData.sellerLoginId = localStorage.getItem('email') || '';


    Swal.fire({
      title: 'Enter Your Address',
      input: 'text',
      inputLabel: 'Address',
      inputPlaceholder: 'Enter Your address',
      showCancelButton: true,
      // showConfirmButton: true
    }).then(address => {
      // console.log(address.value);
      this.metaData.sellerAddress = address.value;
      
      Swal.fire({
        title: 'Enter Your Mobile No',
        input: 'number',
        inputLabel: 'Mobile No',
        inputPlaceholder: 'Enter Your Mobile No',
        showCancelButton: true,
        // showConfirmButton: true
      }).then(mobileNo => {
        // console.log(mobileNo.value);
        this.metaData.sellerMobileNo = mobileNo.value

        if (mobileNo.isConfirmed) {
          this.initialLoader('Syncing to blockchain...');

          this.nftService.getCIDOfFile(formdata).subscribe((res:any)=>{
            // console.log("--------Pinata file Response------",res);
            this.metaData.fileCID = res.IpfsHash;
            // this.fileUploaded = true;
            this.nftService.getCIDOfData(this.metaData).subscribe((res1:any)=>{
              let data = {
                tokenUri : res1.IpfsHash,
                price : this.metaData.price
              }
              this.nftMarketService.mintNft(data).subscribe((res2:any)=>{
                // console.log(res2);
                
                Swal.fire({
                  text: `${res2.response}`,
                  icon: "success",
                }).then((res) => {
                  // window.location.reload();
                  this.router.navigate(['/nft-market-place/nft-store']);
                });
                
              });
            });
          });
        } else {
          Swal.fire({
            text:`Token not minted!`,
            icon:"info"
          }).then(res=>{
          });
        }
      });
    })


    // Swal.fire({
    //   title: 'Enter Your Address',
    //   input: 'text',
    //   inputLabel: 'Address',
    //   inputPlaceholder: 'Enter Your address',
    //   showCancelButton: true,
    //   // showConfirmButton: true
    // }).then(address => {
    //   // console.log(address.value);
    //   this.metaData.sellerAddress = address.value;
      
    //   Swal.fire({
    //     title: 'Enter Your Mobile No',
    //     input: 'number',
    //     inputLabel: 'Mobile No',
    //     inputPlaceholder: 'Enter Your Mobile No',
    //     showCancelButton: true,
    //     // showConfirmButton: true
    //   }).then(mobileNo => {
    //     // console.log(mobileNo.value);
    //     this.metaData.sellerMobileNo = mobileNo.value

    //     if (mobileNo.isConfirmed) {
    //       this.initialLoader('Syncing to blockchain...');

    //         this.nftService.getCIDOfData(this.metaData).subscribe((res1:any)=>{
    //           let data = {
    //             tokenUri : res1.IpfsHash,
    //             price : this.metaData.price
    //           }
    //           this.nftMarketService.mintNft(data).subscribe((res2:any)=>{
    //             // console.log(res2);
                
    //             Swal.fire({
    //               text: `${res2.response}`,
    //               icon: "success",
    //             }).then((res) => {
    //               // window.location.reload();
    //               this.router.navigate(['/nft-market-place/nft-store']);
    //             });
                
    //           });
    //         });
    //     } else {
    //       Swal.fire({
    //         text:`Token not minted!`,
    //         icon:"info"
    //       }).then(res=>{
    //       });
    //     }
    //   });
    // })
    
    // Swal.fire({
    //   title: "Are you sure ?",
    //   // text: "Once added, you will not be able to delete this role!",
    //   showCancelButton: true,
    //   showConfirmButton: true
    // })
    // .then((alert:any) => {
    //   if (alert.isConfirmed) {
    //     this.initialLoader('Syncing to blockchain...');
    //     this.nftService.getCIDOfData(this.metaData).subscribe((res1:any)=>{
    //       let data = {
    //         tokenUri : res1.IpfsHash,
    //         price : this.metaData.price
    //       }
    //       this.nftMarketService.mintNft(data).subscribe((res2:any)=>{
    //         // console.log(res2);
            
    //         Swal.fire({
    //           text: `${res2.response}`,
    //           icon: "success",
    //         }).then((res) => {
    //           // window.location.reload();
    //           this.router.navigate(['/nft-market-place/nft-store']);
    //         });
            
    //       });
    //     });
    //   } else {
    //     Swal.fire({
    //       text:`Token not minted!`,
    //       icon:"info"
    //     }).then(res=>{
    //     });
    //   }
    // });


  }

  initialLoader(msg:string): void {
    Swal.fire({
      title: `${msg}`,
      html: 'Please wait...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }


}
