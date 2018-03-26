import { Component, OnInit } from '@angular/core';
import { ContactUsService } from 'app/services/contactus.service';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { ToastComponent } from 'app/shared/toast/toast.component';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-sendusmsg',
  templateUrl: './sendusmsg.component.html',
  styleUrls: ['./sendusmsg.component.scss']
})
export class SendusmsgComponent implements OnInit, OnDestroy {

  lat = 32.0215089;
  lng = 34.7759857;
  zoom = 13;
  msg: any = {};
  sub;

  constructor(public ContactUsService: ContactUsService,
    public toast: ToastComponent, private titleService: Title, private meta: Meta) { }

  ngOnInit() {
    this.titleService.setTitle('צרו קשר | נעלי נעורים');
    this.meta.updateTag({ name: 'keywords', content: 'שליחת הודעה יצירת קשר, מפת הגעה, נעלי נעורים, נעליים חולון, צעד ראשון חולון' });
                this.meta.updateTag(
                  { name: 'description',
                    content: `ניתן ליצור עימנו קשר ולשלוח הודעה באמצעות דף זה. נעלי נעורים שנקר 52 חולון.`
                  });
  }

  sendMessage() {
    this.sub = this.ContactUsService.newMessage(this.msg)
    .subscribe(data =>  {
      this.msg = {};
      this.toast.setMessage('הודעה נשלחה בהצלחה :)', 'success');
    },
    error => {
      this.toast.setMessage('הודעה לא נשלחה. אנא נסה מאוחר יותר או תתקשר 03-5047523', 'danger');
    }
    );
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
