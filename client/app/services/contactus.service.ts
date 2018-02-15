import { Injectable } from '@angular/core';
import { RequestOptions, Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';



@Injectable()
export class ContactUsService {

  private headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http) {
  }


  newMessage(msg: any ): Observable<any> {
    return this.http.post('/api/contactus', JSON.stringify(msg), this.options);

  }

}
