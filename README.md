# FoodFast - Aplicación web
Este repositorio contiene el código fuente de FoodFast, aplicación web para el TFG de Desarrollo de Aplicaciones Multiplataforma del IES Las Salinas (Curso 2022-2023).

- Repositorio de la aplicación móvil: [foodfast-mobile](https://github.com/PokeSantiTW/foodfast-mobile)

## Instalación

Para ejecutar la página web se necesita usar [http-server](https://www.npmjs.com/package/http-server). Esto ejecutará la web en local permitiendo conectarse con Firebase y recibir ordenes.

1. Instala [Node.js] si no lo tienes. Cualquier versión debería funcionar, pero se recomienda instalar la recomendada: **18.16.0 LTS**.
2. Dirígete a la carpeta donde se encuentra el código de la web y abre una terminal (CMD). Ejecuta el siguiente código:
```
npm install http-server -g
```
3. Con el http-server instalado, puedes ejecutar la página web con el comando:
```
http-server.cmd
```
o
```
http-server
```
Recuerda siempre estar ejecutando ese comando dentro de la carpeta de la página web. La web ya debería estar abierta y puedes acceder con la dirección [localhost:8080](http://localhost:8080/).

## Tutorial de uso
Desde la pantalla de inicio puedes ver las ordenes que se mandan al restaurante en tiempo real. Si una orden ya ha sido completada, puedes hacer clic en "Hecho" y desaparecerá de la lista.

![Pantalla principal]()

Pasa el ratón por encima de "Secciones" o "Productos" y podrás ver las acciones de crear, editar y borrar. Estos menús son muy intuitivos, y siempre que te equivoques puedes borrar o editar de nuevo.

![Submenú de secciones]()

A la hora de crear y editar productos puedes subir imágenes. Para seguir con el estilo de la aplicación se recomienda que sean imágenes con transparencia. Pero se acepta cualquier imagen. 

Si deseas usar una imagen, primero deberás seleccionarla y luego darle a Subir. Si recibes una alerta de que todo es correcto, ya puedes añadir o editar el producto. Pero hacerlo en otro orden puede hacer que la imagen no se refleje.

![Crear producto]()