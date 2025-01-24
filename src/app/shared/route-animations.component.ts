import { trigger, transition, style, animate } from '@angular/animations';

export const fadeTransition = trigger('fadeAnimation', [
  transition('* <=> *', [
    style({ opacity: 0 }),  // Start fully transparent
    animate('1.5s ease-in-out', style({ opacity: 1 })),  // Fade to visible
  ]),
]);
