import { NgModule } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  debugger;
  return new AuthHttp(new AuthConfig({
    headerName: 'x-access-token',
    tokenName: 'token',
    tokenGetter: (() => localStorage.getItem('token')),
    globalHeaders: [{'Content-Type': 'application/json' ,
    'charset': 'UTF-8'}],
  }), http, options);
}

@NgModule({
  providers: [
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    }
  ]
})
export class AuthModule {}
