export interface event {
  id: number;
  titulo: string;
  descripcion: string | null;
  fecha_hora: string;
  direccion: string;
  creado_en: string;
  organizador_id: number;
  invitaciones_total: number;
  invitaciones_confirmadas: number;
}

export interface newEvent {
  titulo: string;
  descripcion: string | null;
  fecha_hora: string;
  direccion: string;
}