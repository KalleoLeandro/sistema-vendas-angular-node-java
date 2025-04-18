import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '@services/login.service';
import { criptografia } from '@utils/utils';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  #fb = inject(FormBuilder);
  #router = inject(Router);
  #loginService = inject(LoginService);
  public token:string = sessionStorage.getItem('authorization') as string;

  ngOnInit(): void {    
    this.#loginService.validarToken(this.token).subscribe({
      next: (res) => {
        if(res === true){
          this.#router.navigate(['/home']);
        }
      },      
    })
  }

  public loginForm: FormGroup = this.#fb.group({
   login: ['',[Validators.required]],
   senha: ['',[Validators.required]]   
  })

  public invalido: boolean = false;

  public change() {
    if (this.loginForm.controls['login'].value != '' || this.loginForm.controls['senha'].value != '') {
      this.invalido = false;
    }
  }

  public logar() {
    const login = {
      login: this.loginForm.controls['login'].value,
      senha: this.loginForm.controls['senha'].value
    }

    const hash = criptografia(login);  
    this.#loginService.validarLogin(hash).subscribe({
      next: (res) => {        
        sessionStorage.setItem('token', res.token || "");
        sessionStorage.setItem('userName', res.userName || "");
        this.#router.navigate(['/home']);
      },
      error: (err) => {
        if (err.status === 401) {
          this.loginForm.patchValue({
            login: '',
            senha: ''
          })
          this.invalido = true;
        }
      }
    });
  }
}
