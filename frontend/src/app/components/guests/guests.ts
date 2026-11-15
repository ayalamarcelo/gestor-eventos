import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toDataURL } from 'qrcode';
import { InvitadoService } from '../../services/guests.service';
import { Invitado } from '../../models/guest.model';

@Component({
  selector: 'app-invitados',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './guests.html'
})

export class Invitados implements OnInit {
  private readonly _invitadoService = inject(InvitadoService);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _formBuilder = inject(FormBuilder);

  readonly invitados = signal<Invitado[]>([]);
  readonly qrs = signal<Record<string, string>>({});
  readonly cargando = signal(true);
  readonly error = signal<string | null>(null);
  readonly mostrarFormulario = signal(false);
  readonly copiado = signal<string | null>(null);

  eventoId = '';

  readonly formulario = this._formBuilder.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]]
  });

  ngOnInit(): void {
    this._activatedRoute.params.subscribe({
      next: params => {
        this.eventoId = params['id'];
        this.cargarInvitados();
      }
    });
  }

  cargarInvitados(): void {
    this.cargando.set(true);
    this._invitadoService.obtenerInvitados(this.eventoId).subscribe({
      next: data => {
        this.invitados.set(data);
        this.cargando.set(false);
        this.generarQrs(data);
      },
      error: () => {
        this.error.set('No se pudieron cargar los invitados');
        this.cargando.set(false);
      }
    });
  }

  agregarInvitado(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const { nombre } = this.formulario.getRawValue();
    this._invitadoService.crearInvitado(this.eventoId, nombre.trim()).subscribe({
      next: () => {
        this.formulario.reset();
        this.mostrarFormulario.set(false);
        this.error.set(null);
        this.cargarInvitados();
      },
      error: err => this.error.set(err.error?.error ?? 'No se pudo crear el invitado')
    });
  }

  link(invitado: Invitado): string {
    return `${window.location.origin}/invitacion/${invitado.codigo}`;
  }

  whatsapp(invitado: Invitado): string {
    const texto = `Hola ${invitado.nombre}! Te invito a mi evento. Confirmá tu asistencia acá: ${this.link(invitado)}`;
    return `https://wa.me/?text=${encodeURIComponent(texto)}`;
  }

  copiarLink(invitado: Invitado): void {
    navigator.clipboard.writeText(this.link(invitado));
    this.copiado.set(invitado.codigo);
    setTimeout(() => this.copiado.set(null), 2000);
  }

  iniciales(nombre: string): string {
    return nombre.split(' ').filter(p => p !== '').slice(0, 2).map(p => p[0].toUpperCase()).join('');
  }

  private async generarQrs(lista: Invitado[]): Promise<void> {
    const resultado: Record<string, string> = {};
    for (const invitado of lista) {
      resultado[invitado.codigo] = await toDataURL(this.link(invitado));
    }
    this.qrs.set(resultado);
  }
}