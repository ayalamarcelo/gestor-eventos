DROP TABLE IF EXISTS Confirmaciones;
DROP TABLE IF EXISTS Invitados;
DROP TABLE IF EXISTS Eventos;
DROP TABLE IF EXISTS Usuarios;
GO

CREATE TABLE Usuarios (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(100) NOT NULL,
    email NVARCHAR(150) NULL UNIQUE,
    creado_en DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

CREATE TABLE Eventos (
    id INT IDENTITY(1,1) PRIMARY KEY,
    titulo NVARCHAR(120) NOT NULL,
    descripcion NVARCHAR(500) NULL,
    fecha_hora DATETIME2 NOT NULL,
    direccion NVARCHAR(200) NOT NULL,
    creado_en DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    organizador_id INT NOT NULL,
    CONSTRAINT FK_Eventos_Usuarios FOREIGN KEY (organizador_id)
        REFERENCES Usuarios(id)
);
GO

CREATE TABLE Invitados (
    id INT IDENTITY(1,1) PRIMARY KEY,
    evento_id INT NOT NULL,
    nombre NVARCHAR(100) NOT NULL,
    codigo VARCHAR(12) NOT NULL UNIQUE,
    creado_en DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Invitados_Eventos FOREIGN KEY (evento_id)
        REFERENCES Eventos(id) ON DELETE CASCADE
);
GO

CREATE TABLE Confirmaciones (
    id INT IDENTITY(1,1) PRIMARY KEY,
    invitado_id INT NOT NULL UNIQUE,
    asiste BIT NOT NULL,
    cantidad_acompanantes INT NOT NULL DEFAULT 0,
    restriccion VARCHAR(20) NOT NULL DEFAULT 'ninguna',
    detalle_restriccion NVARCHAR(200) NULL,
    creado_en DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Confirmaciones_Invitados FOREIGN KEY (invitado_id)
        REFERENCES Invitados(id) ON DELETE CASCADE,
    CONSTRAINT CHK_Confirmaciones_Restriccion CHECK (
        restriccion IN ('ninguna', 'vegetariano', 'celiaco', 'alergia', 'otra')
    ),
    CONSTRAINT CHK_Confirmaciones_SiNoAsiste CHECK (
        (asiste = 1 AND cantidad_acompanantes >= 0) OR
        (asiste = 0 AND cantidad_acompanantes = 0 AND restriccion = 'ninguna' AND detalle_restriccion IS NULL)
    )
);
GO

SET IDENTITY_INSERT Usuarios ON;
INSERT INTO Usuarios (id, nombre, email)
VALUES (1, 'Organizador', 'organizador@thegathering.com');
SET IDENTITY_INSERT Usuarios OFF;
GO

SET IDENTITY_INSERT Eventos ON;
INSERT INTO Eventos (id, titulo, descripcion, fecha_hora, direccion, organizador_id)
VALUES (
    1,
    'Cena de Fin de Cursada',
    'Festejo del grupo después de defender el MVP',
    '2026-11-20T21:00:00',
    'Av. Rivadavia 1234, Buenos Aires',
    1
);
SET IDENTITY_INSERT Eventos OFF;
GO

SET IDENTITY_INSERT Invitados ON;
INSERT INTO Invitados (id, evento_id, nombre, codigo)
VALUES
    (1, 1, 'Matias Martinez', 'INV-MAT001'),
    (2, 1, 'Marcelo Ayala', 'INV-MAR002'),
    (3, 1, 'Gisela Ramirez', 'INV-GIS003'),
    (4, 1, 'Sol Diaz Real', 'INV-SOL004'),
    (5, 1, 'Sebastian Romero', 'INV-SEB005'),
    (6, 1, 'Juan Perez', 'INV-GEN006');
SET IDENTITY_INSERT Invitados OFF;
GO

INSERT INTO Confirmaciones (invitado_id, asiste, cantidad_acompanantes, restriccion, detalle_restriccion)
VALUES
    (1, 1, 2, 'ninguna', NULL),
    (2, 1, 0, 'vegetariano', NULL),
    (3, 1, 1, 'celiaco', NULL),
    (4, 1, 0, 'alergia', 'Alergia al maní y frutos secos'),
    (5, 0, 0, 'ninguna', NULL);
GO

