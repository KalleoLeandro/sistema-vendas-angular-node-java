import { Renderer2, ElementRef } from '@angular/core';
import { MainLayoutComponent } from './main-layout.component';


describe('MainLoyoutComponent (sidebar toggle)', () => {
  let component: MainLayoutComponent;
  let mockRenderer: jasmine.SpyObj<Renderer2>;
  let mockElementRef: ElementRef;

  beforeEach(() => {    
    const div = document.createElement('div');
    const btn = document.createElement('button');
    btn.id = 'sidebarToggle';
    div.appendChild(btn);

    mockElementRef = new ElementRef(div);
    
    mockRenderer = jasmine.createSpyObj('Renderer2', ['listen']);    
    component = new MainLayoutComponent(mockElementRef, mockRenderer);
    document.body.className = '';
    localStorage.clear();
  });

  it('deve adicionar a classe se localStorage tiver true', () => {
    localStorage.setItem('sb|sidebar-toggle', 'true');

    component.ngAfterViewInit();

    expect(document.body.classList.contains('sb-sidenav-toggled')).toBeTrue();
  });

  it('deve registrar o listener de clique', () => {
    component.ngAfterViewInit();

    expect(mockRenderer.listen).toHaveBeenCalled();
  });

  it('deve alternar classe e atualizar localStorage ao clicar', () => {    
    mockRenderer.listen.and.callFake((element, eventName, callback) => {
      if (eventName === 'click') {
        callback({ preventDefault() {} });
      }
      return () => {};
    });

    component.ngAfterViewInit();

    expect(document.body.classList.contains('sb-sidenav-toggled')).toBeTrue();
    expect(localStorage.getItem('sb|sidebar-toggle')).toBe('true');
  });
});
