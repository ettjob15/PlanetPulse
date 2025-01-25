import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [MatToolbarModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent {
  teamMembers = [
    {
      name: 'Ettl Jörg',
      position: 'Project Leader: Polution Map',
      description: 'Jörg is a dedicated IT student with a passion for software development and modern technologies. He discovered his love for programming at an early age and is now deeply engaged in both the theoretical and practical aspects of computer science. He is particularly passionate about developing innovative solutions in web and app development. Alongside his studies, he has worked on various projects, gaining valuable experience with current frameworks and programming languages such as JavaScript, Python, and Angular. Jörg is always looking for new challenges and is determined to shape the future of technology.',
      image: '/assets/joerg.jpg'
    },
    {
      name: 'Brander Vega Asta Esther',
      position: 'Member: Pollution Map',
      description: 'Vega lives life at the bleeding-edge. Mostly to her own detrement',
      image: '/assets/vega.jpg'
    },
    {
      name: 'Boutot Florian',
      position: 'Member: Co2 Calculator',
      description: '',
      image: '/assets/florian.png'
    },
    {
      name: 'Aigner Nico Luan',
      position: 'Member: Account Management',
      description: 'Mary handles all marketing strategies and drives our brand awareness through innovative campaigns.',
      image: '/assets/nico.jpg'
    }
  ];
}
