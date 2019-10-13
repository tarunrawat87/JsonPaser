import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
private query:string;
private result:any;
private showTable:boolean;
  constructor(private searchService:SearchService) { 
    this.result=[];
    this.showTable=false
  }

  ngOnInit() {
  }

  onSearch(){
    let me=this;
    let finalQuery={"query":me.query.trim()};
    console.log(finalQuery);
    me.result=[];
    me.showTable=false;
    me.searchService.getRecords(finalQuery).subscribe((results)=>{
    me.result=results;
    me.showTable=true;
    })

  }

}
