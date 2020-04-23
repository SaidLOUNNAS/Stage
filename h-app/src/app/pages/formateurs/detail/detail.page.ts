import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-formateurs-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailPage {
  @Input() user: any;
  @Input() classe: any;

  constructor(private modalCtrl: ModalController) {}

  async onClose() {
    await this.modalCtrl.dismiss();
  }
}
