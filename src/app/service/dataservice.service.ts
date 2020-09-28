import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import {EventData} from '../models/eventdata'
@Injectable({
  providedIn: 'root'
})
export class DataserviceService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient);
   }
  public getEvents() {
    
    return this.httpClient.get<EventData[]>('./assets/sample/sample.ts');
  }
}
