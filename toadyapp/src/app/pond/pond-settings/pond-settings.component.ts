import { Component, Input, OnInit, Inject } from '@angular/core';
import { AccountType } from 'src/app/models/account_type';
import { RestService } from 'src/app/rest.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from 'underscore';

@Component({
  selector: 'pond-settings',
  templateUrl: './pond-settings.component.html',
  styleUrls: ['./pond-settings.component.css']
})
export class PondSettingsComponent implements OnInit {

  @Input() pondId?: string;

  pondAccountTypes: AccountType[] = [];
  modifiedPondAccountTypes: AccountType[] = [];

  constructor(
    private restService: RestService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.setValues();
  }

  setValues(): void {
    this.restService.getPondAccountTypes(this.pondId!).subscribe(
      data => {
        this.pondAccountTypes = JSON.parse(JSON.stringify(data));
        this.modifiedPondAccountTypes = JSON.parse(JSON.stringify(data));
      }
    );
  }

  attemptSave(): void {
    // Go through the arrays and see which account types changed
    const accountTypesToUpload: AccountType[] = [];

    this.modifiedPondAccountTypes.forEach(modType => {
      const originalModType = this.pondAccountTypes.find(type => {
        return type.account_type_id === modType.account_type_id;
      })

      if (!_.isEqual(modType, originalModType)) {
        accountTypesToUpload.push(modType);  
      }
    })

    this.restService.updatePondAccountTypes(accountTypesToUpload);
  }

  addAccountType(): void {
    const dialogRef = this.dialog.open(AccountTypeInsertDialog, {
      width: '250px',
      data: ''
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.restService.insertNewPondAccountType(result, this.pondId!).subscribe(
          () => {
            this.setValues();
          }
        )
      }
    })
  }

  confirmAccountTypeDeletion(accountType: AccountType): void {
    const dialogRef = this.dialog.open(AccountTypeDeleteDialog, {
      width: '250px'
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deletePondAccountType(accountType);
      }
    });
  }

  deletePondAccountType(accountType: AccountType): void {
    this.restService.deletePondAccountType(accountType.account_type_id.toString());

    this.pondAccountTypes = this.pondAccountTypes.filter(element => {
      return element.account_type_id !== accountType.account_type_id
    })

    this.modifiedPondAccountTypes = this.modifiedPondAccountTypes.filter(element => {
      return element.account_type_id !== accountType.account_type_id
    })
  }
}

@Component({
  selector: 'account-type-insert-dialog',
  templateUrl: 'account-type-insert-dialog.component.html'
})
export class AccountTypeInsertDialog {
  constructor(
    public dialogRef: MatDialogRef<AccountTypeInsertDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'account-type-delete-dialog',
  templateUrl: 'account-type-delete-dialog.component.html'
})
export class AccountTypeDeleteDialog {
  constructor(
    public dialogRef: MatDialogRef<AccountTypeDeleteDialog>
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
