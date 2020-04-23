// import { Component, OnInit, ChangeDetectionStrategy, Injector, ViewChild } from '@angular/core';

// import { IonRefresher } from '@ionic/angular';

// import { BehaviorSubject, Observable } from 'rxjs';

// import { Base } from '../base/base';

// import { AuthService } from 'src/app/services/auth.service';

// @Component({
//   selector: 'app-users',
//   templateUrl: './cours.page.html',
//   styleUrls: ['./cours.page.scss'],
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class CoursPage extends Base implements OnInit {
//   @ViewChild(IonRefresher, { static: false }) ionRefresher: IonRefresher;

//   user: any;
//   userRole: any;

//   params: any = { searchTerm: '', order: 'updatedAtDesc' };

//   isSortedBSubject$: BehaviorSubject<boolean> = new BehaviorSubject(false);
//   isSorted$: Observable<boolean> = this.isSortedBSubject$.asObservable();

//   constructor(injector: Injector, private authService: AuthService) {
//     super(injector);
//   }

//   async ngOnInit() {
//     this.user = this.authService.getCurrentUser();
//     this.userRole = await this.courService.getRole(this.user);
//     this.getUsers();
//   }

//   async onCreate() {
//     try {
//       const modal = await this.modalCtrl.create({ component: CreatePage, backdropDismiss: false });

//       await modal.present();

//       modal.onDidDismiss().then(async (result) => {
//         if (result.data) {
//           this.getUsers();
//           await this.presentToast('COURS_CREATED');
//         }
//       });
//     } catch (error) {}
//   }

//   async onShowDetails(id: string) {
//     await this.presentLoading('Please wait...');

//     try {
//       const user = (await this.courService.ge) & tCour(id);
//       const modal = await this.modalCtrl.create({
//         component: DetailPage,
//         componentProps: { user },
//         backdropDismiss: false,
//       });
//       this.loadingCtrl.dismiss();
//       await modal.present();
//     } catch (error) {}
//   }

//   async onSort() {
//     const alert = await this.alertCtrl.create({
//       header: 'Sort',
//       inputs: [
//         {
//           type: 'radio',
//           label: 'Updated - recent',
//           value: 'updatedAtDesc',
//           checked: this.params.order === 'updatedAtDesc',
//         },
//         {
//           type: 'radio',
//           label: 'Updated - oldest',
//           value: 'updatedAtAsc',
//           checked: this.params.order === 'updatedAtAsc',
//         },
//         {
//           type: 'radio',
//           label: 'Created - recent',
//           value: 'createdAtDesc',
//           checked: this.params.order === 'createdAtDesc',
//         },
//         {
//           type: 'radio',
//           label: 'Created - oldest',
//           value: 'createdAtAsc',
//           checked: this.params.order === 'createdAtAsc',
//         },
//       ],

//       buttons: [
//         {
//           text: 'Cancel',
//           role: 'cancel',
//         },
//         {
//           text: 'Ok',
//           role: 'ok',
//         },
//       ],
//     });
//     await alert.present();

//     alert.onDidDismiss().then(async (result) => {
//       if (result.role === 'ok') {
//         this.params = { ...this.params, order: result.data.values };
//         this.getUsers();
//         this.isSortedBSubject$.next(this.params.order !== 'updatedAtDesc');
//       }
//     });
//   }

//   async onDelete(id: string) {
//     const alert = await this.alertCtrl.create({
//       header: 'Delete user',
//       message: 'Are you sure delete this user ?',
//       buttons: [
//         {
//           text: 'No',
//           role: 'cancel',
//         },
//         {
//           text: 'Yes',
//           role: 'ok',
//         },
//       ],
//     });
//     await alert.present();

//     alert.onDidDismiss().then(async (result) => {
//       if (result.role === 'ok') {
//         try {
//           await this.courService.deleteCour(id);
//           this.getUsers();
//           await this.presentToast('COURS_DELETED');
//         } catch (error) {
//           await this.presentToast(error.message);
//         }
//       }
//     });
//   }

//   async onSearch(event: any) {
//     this.params = { ...this.params, searchTerm: event.detail.value.trim().toLowerCase() };
//     this.getUsers();
//   }

//   async onRefresh() {
//     this.params = { searchTerm: '', order: 'updatedAtDesc' };
//     await this.getUsers();
//     await this.ionRefresher.complete();
//     this.isSortedBSubject$.next(false);
//   }

//   async onLogout() {
//     await this.authService.logout();
//     await this.router.navigateByUrl('/login');
//   }

//   trackByFn(index: number, user: any) {
//     return user ? user.id : index;
//   }

//   private async getUsers() {
//     try {
//       this.isLoadingBSubject$.next(true);
//       const users = await this.courService.getCours(this.params);
//       this.objectsBSubject$.next(users);
//       this.isLoadingBSubject$.next(false);
//     } catch (error) {
//       this.isLoadingBSubject$.next(false);
//       await this.presentToast(error.message);
//     }
//   }
// }
