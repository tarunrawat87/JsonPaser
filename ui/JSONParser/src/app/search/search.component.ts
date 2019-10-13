import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
public query:string;
public result:any;
  constructor(private searchService:SearchService) { 
    this.result=[];
  }

  ngOnInit() {
  }

  onSearch(){
    let me=this;
    let finalQuery={"query":me.query.trim().toLowerCase()};
    
    me.result=[];
  
    me.searchService.getRecords(finalQuery).subscribe((results)=>{
    me.result=results;
    })

  }

}
