
DROP TABLE IF EXISTS Confirmaciones;
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
    codigo VARCHAR(12) NOT NULL UNIQUE,
    creado_en DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    organizador_id INT NOT NULL,
    CONSTRAINT FK_Eventos_Usuarios FOREIGN KEY (organizador_id)
        REFERENCES Usuarios(id)
);
GO


CREATE TABLE Confirmaciones (
    id INT IDENTITY(1,1) PRIMARY KEY,
    evento_id INT NOT NULL,
    nombre_invitado NVARCHAR(100) NOT NULL,
    asiste BIT NOT NULL,
    cantidad_acompanantes INT NOT NULL DEFAULT 0,
    restriccion VARCHAR(20) NOT NULL DEFAULT 'ninguna',
    detalle_restriccion NVARCHAR(200) NULL,
    creado_en DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Confirmaciones_Eventos FOREIGN KEY (evento_id)
        REFERENCES Eventos(id) ON DELETE CASCADE,
    CONSTRAINT CHK_Confirmaciones_Restriccion CHECK (
        restriccion IN ('ninguna', 'vegetariano', 'celiaco', 'alergia', 'otra')
    )
);
GO


SET IDENTITY_INSERT Usuarios ON;
INSERT INTO Usuarios (id, nombre, email)
VALUES (1, 'Organizador', 'organizador@thegathering.com');
SET IDENTITY_INSERT Usuarios OFF;
GO


SET IDENTITY_INSERT Eventos ON;
INSERT INTO Eventos (id, titulo, descripcion, fecha_hora, direccion, codigo, organizador_id)
VALUES (
    1,
    'Cena de Fin de Cursada',
    'Festejo del grupo después de defender el MVP',
    '2026-11-20T21:00:00',
    'Av. Rivadavia 1234, Buenos Aires',
    'GATHER2026',
    1
);
SET IDENTITY_INSERT Eventos OFF;
GO

INSERT INTO Confirmaciones (evento_id, nombre_invitado, asiste, cantidad_acompanantes, restriccion, detalle_restriccion)
VALUES
    (1, 'Matias Martinez', 1, 2, 'ninguna', NULL),
    (1, 'Marcelo Ayala', 1, 0, 'vegetariano', NULL),
    (1, 'Gisela Ramirez ', 1, 1, 'celiaco', NULL),
    (1, 'Sol Diaz Real', 1, 0, 'alergia', 'Alergia al maní y frutos secos'),
    (1, 'Sebastian Romero', 0, 0, 'ninguna', NULL);
GO