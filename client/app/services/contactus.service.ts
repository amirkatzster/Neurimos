import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';



@Injectable()
export class ContactUsService {

  private headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8'});
  private options = {headers: this.headers };

  constructor(private http: HttpClient) {
  }


  newMessage(msg: any ): Observable<any> {
    return this.http.post('/api/contactus', JSON.stringify(msg), this.options);

  }

}
