import { Component, input } from '@angular/core';

@Component({
  selector: 'app-skelton-loader',
  imports: [],
  templateUrl: './skelton-loader.component.html',
  styleUrl: './skelton-loader.component.scss',
})
export class SkeltonLoaderComponent {

  count = input<number>(5);

  countArray() {
    return Array(this.count()).fill(0);
  }

}
