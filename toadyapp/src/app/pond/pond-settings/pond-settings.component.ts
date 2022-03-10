import { Component, Input, OnInit } from '@angular/core';
import { AccountType } from 'src/app/models/account_type';
import { RestService } from 'src/app/rest.service';
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
    private restService: RestService
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
}
