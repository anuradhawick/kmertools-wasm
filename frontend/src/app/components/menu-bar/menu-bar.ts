import { Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem, MessageService } from 'primeng/api';

@Component({
  selector: 'app-menu-bar',
  imports: [MenubarModule],
  templateUrl: './menu-bar.html',
  styleUrl: './menu-bar.css',
})
export class MenuBar {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Oligo',
        routerLink: '/oligo',
        routerLinkActiveOptions: { exact: true },
      },
      {
        label: 'CGR',
        routerLink: '/cgr',
      },
    ];
  }
}
