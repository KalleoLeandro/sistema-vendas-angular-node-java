import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, OnInit, Renderer2 } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit, AfterViewInit {
  public userName: string = sessionStorage.getItem('userName') || '';
  public perfil: string = '';

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const sidebarToggle = this.el.nativeElement.querySelector('#sidebarToggle');
    if (sidebarToggle) {
      if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        document.body.classList.add('sb-sidenav-toggled');
      }

      this.renderer.listen(sidebarToggle, 'click', (event: Event) => {
        event.preventDefault();
        document.body.classList.toggle('sb-sidenav-toggled');
        localStorage.setItem('sb|sidebar-toggle', String(document.body.classList.contains('sb-sidenav-toggled')));
      });
    }
  }
}
