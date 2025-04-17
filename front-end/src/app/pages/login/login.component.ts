import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  #fb = inject(FormBuilder);
  //constructor(private _fb: FormBuilder) {}

  public loginForm: FormGroup = this.#fb.group({
   login: ['',[Validators.required]],
   senha: ['',[Validators.required]]   
  })

  public invalido: boolean = false;

  public change() {

  }

  public logar() {

  }

}
