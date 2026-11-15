export interface Invitado {
  id: number;
  nombre: string;
  codigo: string;
  creado_en: string;
  ya_confirmo: boolean;
  asiste: boolean | null;
  cantidad_acompanantes: number | null;
  restriccion: string | null;
}

export type InvitadoCreado = Pick<Invitado, 'id' | 'nombre' | 'codigo' | 'creado_en'>;