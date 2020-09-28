import { Component, OnInit } from '@angular/core';
import { DataserviceService } from '../app/service/dataservice.service'
import { GridOptions, ColDef, RowNode } from 'ag-grid-community';
import * as _ from 'lodash';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'grid-sample';
  public rowSelection;
  eventData: any = [];
  clonedData: any = [];
  gridOptions: GridOptions = {};
  selectedNodes: RowNode[] = [];
selectedRows:any[]=[];
  columnDefs =
    [
      { headerName: 'Campaign Name', field: 'campaignName' },
      {
        headerName: 'Event TYpe',
        field: 'eventType',
        width: 242,
        sortable: true,
        filter: true,


      },
      {
        headerName: 'App User',
        field: 'appUserId',
        sort: 'desc',
        wrapText: true, autoHeight: true, cellClass: "cell-wrap-text",
        sortable: true,
        filter: true,
      },
      //{ headerName: 'Gender', field: 'app_user_gender' },
      { headerName: 'Event Date', field: 'eventDate' },
      {
        headerName: 'App Device Type', field: 'appDevice',
        cellStyle: function (params) {
          if (params.value == 'iOS') {
            //mark police cells as red
            return { color: 'white', backgroundColor: 'green' };
          }
          if (params.value == 'Android') {
            //mark police cells as red
            return { color: 'white', backgroundColor: 'Blue' };
          }
          else {
            return null;
          }
        }
      },
    ];
  constructor(private dataService: DataserviceService) {
    this.initGridOptions();
    this.rowSelection = 'single';
  }
  ngOnInit() {
    this.dataService.getEvents().subscribe(
      data => {
        this.eventData = data;
         this.clonedData = _.cloneDeep(data);
      },
      err => {
        console.log(err);
      }
    );
  }
  initGridOptions() {
    this.gridOptions.columnDefs = this.columnDefs;
    //this.gridOptions.enableColResize = true;
    this.gridOptions.rowHeight = 30;
    //this.gridOptions.suppressTabbing = true;
    this.gridOptions.ensureDomOrder = true;
    //this.gridOptions.onSelectionChanged= this.onSelectionChanged;

  }
  onRowClicked(params) {
    this.selectedNodes.push(params.node);
    
    if (this.selectedNodes.length > 1) {
      var prev = this.selectedNodes[this.selectedNodes.length - 2]
      prev.setRowHeight(30);

    }
    this.gridOptions.api.onRowHeightChanged();
    this.setrowHeight(100);
    this.setWordWrap();
  }
  setWordWrap() {
    this.gridOptions.api.getSelectedRows().forEach(node => {
      var message = this.eventData.find((x) => x.id == node.id);
      node.appUserId = message.detailedMessage;
    });
    this.gridOptions.api.refreshCells();
  }
 
  setrowHeight(height) {
    this.gridOptions.api.getSelectedNodes().forEach(node => {
      node.setRowHeight(height, false);

    });
    this.gridOptions.api.onRowHeightChanged();

  }
  onSelectionChanged(data: any) {
     var selectedRow = this.gridOptions.api.getSelectedRows();
     this.selectedRows.push(selectedRow);
     if (this.selectedRows.length > 0) {
      var prev = this.selectedRows[this.selectedRows.length - 1];
      var userId = this.clonedData.find((x) => x.id == prev[0].id);
      prev[0].appUserId=userId.appUserId;

    }
    console.log(this.selectedRows);
  }
  onGridReady(params) {
    params.api.sizeColumnsToFit();
  }
  onMouseLeave(param) {
    //this.setrowHeight(45);
  }
}
