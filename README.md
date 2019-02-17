# AUTO-REST

Para instalar:
```
npm install
npm run build
```


Para levantar el servicio de la API REST:
```
npm start
```


Para configurar modificamos el archivo **dist/config.json**.
```jsonc
{
    "mode": "dev",                                    // Permite el acceso desde cualquier origen de conexión.
    "mysql": {                                        // Configuración de MySQL.
        "host": "127.0.0.1",                          // Dirección IP del servidor de BBDD.
        "port": 3306,                                 // Puerto del servidor de BBDD.
        "user": "<user>",                             // Usuario de la BBDD.
        "password": "<password>",                     // Contraseña de la BBDD.
        "database": "<schema>",                       // Esquema de la BBDD a la que se va a conectar.
        "charset": "utf8_general_ci",                 // Codificación de la BBDD.
        "acquireTimeout": 10000,                      // Tiempo límite de conexión a la BBDD.
        "connectionLimit": 10                         // Número de conexiones simultáneas permitidas.
    },
    "express": {                                      // Configuración de Express.
        "port": 8080,                                 // Puerto por el que se dará servicio a la API REST.
        "basePath": "/api"                            // Ruta base para acceder a los DBO's a través de la URL generada para el API REST.
    },
    "build": {                                        // Configuración de construcción de la API REST.
        "tables": {                                   // Configuración para las tablas de la BBDD.
            "prefix": "r_",                           // Prefijo para todas las URL de las tablas.
            "include": "all",                         // Tablas que se van a incluir ('all' para todas, 'none' para ninguna).
            "except": {                               // Excepciones con respecto la propiedad 'include'.
                "<tableName1>": true,                 // Si 'include' vale 'all', esta tabla es ignorada; si vale 'none' esta tabla es incluida.
                "<tableName2>": false                 // Si 'include' vale 'all', esta table es incluida; si vale 'none' esta tabla es ignorada.
                // ...
            },
            "config": {
                "<tableName1>": {
                    "alias": "<new_name_for_url>",    // Nombre que tendrá la tabla en la URL de la API REST.
                    "ignorePrefix": true              // Indica si se pondrá o se ignorará el prefijo de la tabla.
                }
                // ...
            }
        },
        "views": {                                    // Configuración para vistas de la BBDD.  (Configuración idéntica a las tablas)
            "prefix": "v_",
            "include": "all",
            "except": {},
            "config": {}
        },
        "procedures": {                               // Configuración para procedimientos almacenados de la BBDD.  (Configuración idéntica a las tablas, más algún añadido)
            "prefix": "p_",
            "include": "all",
            "except": {},
            "config": {
                "<tableName1>": {
                    "aliasParams": {                  // Alias para los parámetros.
                        "<paramName1>": "<alias_1>"   // Nombre que tendrá el parámetro para recibir valores por POST.
                        // ...
                    }
                }
            }
        },
        "functions": {                                // Configuración para funciones de la BBDD.  (Configuración idéntica a los procedimientos)
            "prefix": "f_",
            "include": "all",
            "except": {},
            "config": {}
        }
    }
}
```
