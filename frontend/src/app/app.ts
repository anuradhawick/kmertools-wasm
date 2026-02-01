import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuBar } from './components/menu-bar/menu-bar';
import { SpinnerComponent } from './components/spinner/spinner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuBar, SpinnerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('kmertools-wasm');
}
