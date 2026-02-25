import { Component, OnInit } from '@angular/core';

import { DatabaseInitializerService } from './core/database/database-initializer.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  constructor(private dbInit: DatabaseInitializerService) {}

  async ngOnInit() {
    await this.dbInit.init();
  }
}
