import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { fadeTransition } from './shared/route-animations.component';
import { NavigationComponent } from "./shared/navigation/navigation.component";
import { FooterComponent } from './shared/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationComponent, FooterComponent],
  templateUrl: './app.component.html',
  template: `
    <div [@fadeAnimation]="getRouterOutletState(outlet)" class="fade-container">
      <router-outlet #outlet="outlet"></router-outlet>
    </div>
  `,
  styleUrl: './app.component.scss',
  animations: [fadeTransition],
})
export class AppComponent {
  title = 'daeleez-web-app';
}
