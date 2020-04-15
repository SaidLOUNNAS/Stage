import { ChangeDetectionStrategy, Component, Input, OnInit, Injector } from '@angular/core';

import { Base } from '../../base/base';

import { FormateurService } from '../../../services/formateur.service';

@Component({
  selector: 'app-formateurs-filter',
  templateUrl: './filter.page.html',
  styleUrls: ['./filter.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterPage extends Base implements OnInit {
  @Input() params: any;

  constructor(injector: Injector, private formateurService: FormateurService) {
    super(injector);
  }

  ngOnInit() {
    this.count();
  }

  onStatusChange(event: any) {
    this.params = { ...this.params, status: event.detail.value };
    this.count();
  }

  async onShowResults() {
    await this.modalCtrl.dismiss(this.params);
  }

  async onClose() {
    await this.modalCtrl.dismiss();
  }

  private async count() {
    try {
      this.isLoadingBSubject$.next(true);

      this.isLoadingBSubject$.next(false);
    } catch (error) {
      this.isLoadingBSubject$.next(false);
      await this.presentToast(error.message);
    }
  }
}
