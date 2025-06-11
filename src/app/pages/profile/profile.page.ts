import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  form!: FormGroup;
  originalUsername: string = 'Username';

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      username: [this.originalUsername],
    });
  }

  getInitial(): string {
    const name = this.form.get('username')?.value || '';
    return name.trim().charAt(0).toUpperCase();
  }

  hasChanges(): boolean {
    return (
      this.form.get('username')?.value.trim() !== this.originalUsername.trim()
    );
  }

  saveChanges(): void {
    this.originalUsername = this.form.get('username')?.value;
  }
}
