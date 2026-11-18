import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InvitationService } from '../../services/invitation-service';
import { ConfirmationService } from '../../services/confirmation-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Confirmacion, ConfirmacionRequest, Invitacion, Restriccion } from '../../models/invitation.model';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';


@Component({
  imports: [DatePipe, ReactiveFormsModule],
  selector: 'app-invitation-card',
  styleUrl: './invitation-card.css',
  templateUrl: './invitation-card.html',
})
export class InvitationCard {

  private readonly _activatedRoute = inject(ActivatedRoute)
  private readonly _invatacionService = inject(InvitationService)
  private readonly _confirmacionService = inject(ConfirmationService)
  private readonly _formBuilder = inject(FormBuilder)

  readonly invitacion = signal<Invitacion | null>(null)
  readonly cargando = signal(true)
  readonly error = signal<string | null>(null)

  readonly yaConfirmo = signal(false)
  readonly enviando = signal(false)
  readonly errorFormulario = signal<string | null>(null)
  readonly resultado = signal<Confirmacion | null>(null)

  readonly modalAbierto = signal(false)
  readonly cargandoEdicion = signal(false)
  readonly edicionDisponible = signal(false)
  readonly guardandoEdicion = signal(false)
  readonly errorEdicion = signal<string | null>(null)

  readonly restricciones: { valor: Restriccion; etiqueta: string }[] = [
    { valor: 'ninguna', etiqueta: 'Ninguna' },
    { valor: 'vegetariano', etiqueta: 'Vegetariano' },
    { valor: 'celiaco', etiqueta: 'Celíaco' },
    { valor: 'alergia', etiqueta: 'Alergia' },
    { valor: 'otra', etiqueta: 'Otra' },
  ]

  readonly opcionesAcompanantes = [
    { valor: 0, etiqueta: 'Voy sin acompañantes' },
    { valor: 1, etiqueta: '+1 acompañante' },
    { valor: 2, etiqueta: '+2 acompañantes' },
    { valor: 3, etiqueta: '+3 acompañantes' },
    { valor: 4, etiqueta: '+4 acompañantes' },
    { valor: 5, etiqueta: '+5 acompañantes' },
  ]

  readonly formulario = this._formBuilder.nonNullable.group({
    asiste: true,
    cantidad_acompanantes: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
    restriccion: 'ninguna' as Restriccion,
    detalle_restriccion: ['', [Validators.maxLength(200)]],
  })

  readonly formularioEdicion = this._formBuilder.nonNullable.group({
    asiste: true,
    cantidad_acompanantes: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
    restriccion: 'ninguna' as Restriccion,
    detalle_restriccion: ['', [Validators.maxLength(200)]],
  })

  ngOnInit(): void {
    this._activatedRoute.params.subscribe({
      next: params => {
        this.cargando.set(true)
        this.error.set(null)

        this._invatacionService.invitacionPorCodigoService(params['codigo']).subscribe({
          next: data => {
            this.invitacion.set(data)
            this.yaConfirmo.set(data.ya_confirmo)
            this.cargando.set(false)
          },
          error: (error: HttpErrorResponse) => {
            this.error.set(this.mensajeDeError(error))
            this.cargando.set(false)
          }
        })
      },
      error: error => console.log(error)
    })
  }

  pideDetalle(): boolean {
    const asiste = this.formulario.controls.asiste.value
    const restriccion = this.formulario.controls.restriccion.value
    return asiste && (restriccion === 'alergia' || restriccion === 'otra')
  }

  etiquetaRestriccion(valor: Restriccion): string {
    return this.restricciones.find(restriccion => restriccion.valor === valor)?.etiqueta ?? valor
  }

    abrirModal(): void {
    const invitacion = this.invitacion()
    if (!invitacion) return

    this.modalAbierto.set(true)
    this.errorEdicion.set(null)
    this.edicionDisponible.set(false)
    this.cargandoEdicion.set(true)

    this._confirmacionService.obtenerConfirmacionPorCodigoService(invitacion.codigo).subscribe({
      next: confirmacion => {
        this.formularioEdicion.setValue({
          asiste: confirmacion.asiste,
          cantidad_acompanantes: confirmacion.cantidad_acompanantes,
          restriccion: confirmacion.restriccion,
          detalle_restriccion: confirmacion.detalle_restriccion ?? '',
        })
        this.edicionDisponible.set(true)
        this.cargandoEdicion.set(false)
      },
      error: (error: HttpErrorResponse) => {
        this.errorEdicion.set(this.mensajeDeErrorEdicion(error))
        this.cargandoEdicion.set(false)
      }
    })
  }

  cerrarModal(): void {
    this.modalAbierto.set(false)
  }

  pideDetalleEdicion(): boolean {
    const asiste = this.formularioEdicion.controls.asiste.value
    const restriccion = this.formularioEdicion.controls.restriccion.value
    return asiste && (restriccion === 'alergia' || restriccion === 'otra')
  }

  guardarCambios(): void {
    const invitacion = this.invitacion()
    if (!invitacion || this.guardandoEdicion()) return

    if (this.formularioEdicion.invalid) {
      this.formularioEdicion.markAllAsTouched()
      return
    }

    const body = this.armarBody(this.formularioEdicion.getRawValue())

    this.guardandoEdicion.set(true)
    this.errorEdicion.set(null)

    this._confirmacionService.actualizarConfirmacionService(invitacion.codigo, body).subscribe({
      next: confirmacion => {
        this.resultado.set(confirmacion) // el panel muestra la respuesta actualizada
        this.guardandoEdicion.set(false)
        this.modalAbierto.set(false)
      },
      error: (error: HttpErrorResponse) => {
        this.guardandoEdicion.set(false)
        this.errorEdicion.set(this.mensajeDeErrorEdicion(error))
      }
    })
  }

  private armarBody(datos: {
    asiste: boolean
    cantidad_acompanantes: number
    restriccion: Restriccion
    detalle_restriccion: string
  }): ConfirmacionRequest {
    // El backend rechaza (400) acompañantes o restricción si no asiste: se mandan en cero.
    if (!datos.asiste) {
      return { asiste: false, cantidad_acompanantes: 0, restriccion: 'ninguna', detalle_restriccion: null }
    }
    return {
      asiste: true,
      cantidad_acompanantes: Number(datos.cantidad_acompanantes),
      restriccion: datos.restriccion,
      detalle_restriccion:
        datos.restriccion === 'alergia' || datos.restriccion === 'otra'
          ? datos.detalle_restriccion.trim() || null
          : null,
    }
  }

  private mensajeDeErrorEdicion(error: HttpErrorResponse): string {
    if ((error.status === 400 || error.status === 404) && error.error?.error) return error.error.error
    if (error.status === 0) return 'No pudimos conectar con el servidor. Probá de nuevo en unos minutos.'
    return 'No pudimos guardar los cambios. Probá de nuevo más tarde.'
  }

  confirmarAsistencia(): void {
    const invitacion = this.invitacion()
    if (!invitacion || this.enviando()) return

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched()
      return

    }

    const datos = this.formulario.getRawValue()

    const body = this.armarBody(datos)
    
    this.enviando.set(true)
    this.errorFormulario.set(null)

    this._confirmacionService.crearConfimacionService(invitacion.codigo, body).subscribe({
      next: confirmacion => {
        this.resultado.set(confirmacion)
        this.enviando.set(false)
      },
      error: (error: HttpErrorResponse) => {
        this.enviando.set(false)
        if (error.status === 409) {
          this.yaConfirmo.set(true)
          return
        }
        this.errorFormulario.set(this.mensajeDeErrorConfirmacion(error))
      }
    })
  }

  private mensajeDeError(error: HttpErrorResponse): string {
    if (error.status === 404) {
      return 'No encontramos esta invitación. Revisá que el link esté completo o pedile uno nuevo al organizador.'
    }
    if (error.status === 400) return 'El código de la invitación no es válido.'
    if (error.status === 0) return 'No pudimos conectar con el servidor. Probá de nuevo en unos minutos.'
    return 'Ocurrió un error inesperado. Probá de nuevo más tarde.'
  }

  private mensajeDeErrorConfirmacion(error: HttpErrorResponse): string {
    if (error.status === 400 && error.error?.error) return error.error.error
    if (error.status === 404) return 'No encontramos tu invitación. Revisá el link.'
    if (error.status === 0) return 'No pudimos conectar con el servidor. Probá de nuevo en unos minutos.'
    return 'No pudimos guardar tu respuesta. Probá de nuevo más tarde.'
  }


}
