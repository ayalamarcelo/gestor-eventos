export interface EventoPublico {
    id: number;
    titulo: string;
    descripcion: string | null;
    fecha_hora: string;
    direccion:string 
}

export interface Invitacion {
    invitado_id: number;
    nombre_invitado: string;
    codigo: string;
    ya_confirmo: boolean;
    evento: EventoPublico
}

export type Restriccion = 'ninguna' | 'vegetariano' | 'celiaco' | 'alergia' | 'otra';

export interface ConfirmacionRequest {
  asiste: boolean;
  cantidad_acompanantes: number;
  restriccion: Restriccion;
  detalle_restriccion: string | null;
}

export interface Confirmacion {
  id: number;
  invitado_id: number;
  asiste: boolean;
  cantidad_acompanantes: number;
  restriccion: Restriccion;
  detalle_restriccion: string | null;
  creado_en: string;
}