import { Component, OnInit, OnDestroy } from '@angular/core';
declare var $;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {

  	// $("#admin-router-outlet").removeClass("p-4");  
  	// document.getElementById("#admin-router-outlet").classList.remove("p-4");
 //    var scrpitCts = "<script id='okok' src='http://malihu.github.io/custom-scrollbar/jquery.mCustomScrollbar.concat.min.js'></script>"
	// $(scrpitCts).appendTo(document.body);
	// $(document).ready(function(){
	// 	if(document.getElementById('okok')){
	// 		alert("kk")
	//       	$('#okok').html().remove();
	//       	// $(scrpitCts).appendTo(document.body);
	// 	}else{
	// 		$(scrpitCts).appendTo(document.body);
	// 	}
	// });
  }

  ngOnDestroy(){
  	// document.getElementById("#admin-router-outlet").classList.add("p-4");
  	// $("#admin-router-outlet").addClass("p-4");  
  }
}
