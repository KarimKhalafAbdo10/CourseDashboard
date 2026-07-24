import { Component, input,output } from '@angular/core';

@Component({
  selector: 'app-confirm-model',
  imports: [],
  templateUrl: './confirm-model.component.html',
  styleUrl: './confirm-model.component.scss',
})
export class ConfirmModelComponent {
isOpen = input<boolean>(false);
  title = input<string>('Confirm Action');
message = input<string>('Are you sure you want to perform this action? This cannot be undone.');
  confirm = output<void>();
  cancel = output<void>();
}
