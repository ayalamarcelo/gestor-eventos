export interface Invitado {
  id: number;
  nombre: string;
  codigo: string;
  creado_en: string;
}

export interface FilaInvitado {
  id: number;
  codigo: string;
  nombre: string;
  iniciales: string;
  yaConfirmo: boolean;
  asiste: boolean;
  acompanantes: number;
  restriccion: string | null;
  detalle: string | null;
  estado: string;
}