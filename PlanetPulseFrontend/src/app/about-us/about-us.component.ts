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
      description: 'Jörg is a dedicated IT student with a passion for software development and modern technologies. He discovered his love for programming at an early age and is now deeply engaged in both the theoretical and practical aspects of computer science. He is particularly passionate about developing innovative solutions in web and app development. Alongside his studies, he has worked on various projects, gaining valuable experience with current frameworks and programming languages such as JavaScript, Python, and React. Jörg is always looking for new challenges and is determined to shape the future of technology.',
      image: '/assets/joerg.jpg'
    },
    {
      name: 'Brander Vega Asta Esther',
      position: 'Member: Pollution Map',
      description: 'Jane leads the technology department, ensuring that our systems and products are always cutting-edge.',
      image: '/assets/vega.jpg'
    },
    {
      name: 'Butot Florian',
      position: 'Member: Co2 Calculator',
      description: 'Paul manages multiple projects and ensures they are completed on time and within budget.',
      image: '/assets/florian.jpg'
    },
    {
      name: 'Aigner Nico Luan',
      position: 'Member: Account Management',
      description: 'Mary handles all marketing strategies and drives our brand awareness through innovative campaigns.',
      image: '/assets/nico.jpg'
    }
  ];
}
