// LA RUTA · este es el archivo que hay que editar: tecnologías, videos, misiones y cartas.
// Cada tecnología tiene su video de YouTube, dividido en misiones con sus tiempos ("m:ss") y sus cartas para recordar.

window.RUTA = {
  // Cada cuántos segundos los equipos envían su avance y el panel /admin se actualiza. Más alto, menos carga para el servidor.

  // LOS EQUIPOS. Si cambias algo aquí, sube versionEquipos para que cada computador lo cargue.
  // Ojo: al subirla se reemplaza todo el avance guardado en ese computador.
  versionEquipos: 2,
  cantidadEquipos: 22,

  // LAS TECNOLOGÍAS: las estaciones de la portada.
  // videoLocal: el archivo que usa la app de escritorio (sin internet), dentro de la carpeta «videos» junto al programa.
  // youtube: el enlace del video. Si está vacío se usa el «video de ensayo», un reloj que avanza sin imagen.
  // POR AHORA las tres usan de ejemplo un video antiguo de corte láser: al poner el video real de cada guion, ajusta los tiempos (ini y fin) de sus misiones.
  // padre: la tecnología queda dentro de otra estación. Al tocar la estación padre en la portada aparecen sus estaciones hijas,
  // y cada hija abre su propio video (una misión con el video completo, al final de LAS MISIONES).
  // enlaces: botones que aparecen en la tarjeta de la portada al pasar el mouse (en pantallas táctiles se ven siempre).
  // Con url abren otra web en una pestaña nueva; con ruta abren una página de la plataforma (por ejemplo, ruta: "maker" = Circuitos Maker).
  // estacion: la tarjeta de la portada, igual que los lienzos de las estaciones (imagen en assets/tecnologias, sin extensión).
  tecnologias: [
    { id: "i3d", enlaces: [{ t: "Creality Print", url: "https://www.creality.com/es/download" }], estacion: { img: "tec-i3d", titulo: "Impresión 3D", frase: "Mira cómo una idea se fabrica capa por capa." }, nombre: "Impresión 3D", corto: "Impresión 3D", lema: "De un modelo digital a una pieza real", icono: "cube", youtube: "https://www.youtube.com/watch?v=8ogBrCZkusU" },
    { id: "laser", videoLocal: "videos/corte-laser.mp4", enlaces: [{ t: "Falcon Design Space", url: "https://webapp.craftseek.com/#/download" }], estacion: { img: "tec-laser", titulo: "Corte láser", frase: "Diseña, corta y graba con precisión." }, nombre: "Corte láser", corto: "Corte láser", lema: "Cortar y grabar con precisión", icono: "zap", youtube: "https://www.youtube.com/watch?v=5B7gPjmgrgU" },
    { id: "ard", videoLocal: "videos/arduino.mp4", enlaces: [{ t: "Arduino IDE", url: "https://www.arduino.cc/en/software/" }, { t: "Circuitos", ruta: "maker", icono: "chip" }], estacion: { img: "tec-ard", titulo: "Arduino", frase: "Programa y arma tus primeros circuitos." }, nombre: "Electrónica con Arduino", corto: "Arduino", lema: "Sensores, luces y programación", icono: "chip", youtube: "https://www.youtube.com/watch?v=33BavdKcWv0" },
    { id: "i3d-prep", videoLocal: "videos/impresion-3d-descarga.mp4", padre: "i3d", estacion: { img: "tec-i3d-prep.svg", titulo: "Descarga y preparación", frase: "Encuentra un modelo y déjalo listo para imprimir." }, nombre: "Impresión 3D · Descarga y preparación", corto: "Descarga y preparación", lema: "Del modelo descargado a la impresora", icono: "cube", youtube: "https://www.youtube.com/watch?v=8ogBrCZkusU" },
    { id: "i3d-mod", videoLocal: "videos/impresion-3d-modificacion.mp4", padre: "i3d", estacion: { img: "tec-i3d-mod.svg", titulo: "Modificación del archivo", frase: "Ajusta el diseño a lo que necesita tu prototipo." }, nombre: "Impresión 3D · Modificación del archivo", corto: "Modificación del archivo", lema: "Cortar, perforar y rotular", icono: "tool", youtube: "https://www.youtube.com/watch?v=8ogBrCZkusU" },
  ],

  // LAS MISIONES de todas las tecnologías. El campo tec indica a cuál pertenece. Siguen los guiones de los microtutoriales.
  // El avance se guarda por la posición en esta lista: para agregar misiones, súmalas al final (máximo 20 en total).
  // foto: una captura del video guardada en assets/fotos, sin la extensión. Es opcional: sin foto, la carta muestra el ícono de la misión.
  // ini y fin: TIEMPOS ESTIMADOS a partir de los guiones. Ajustarlos cuando estén los videos grabados.
  misiones: [
    // ---------- Corte láser · Video 4: preparar un diseño en Falcon Design Space ----------
    {
      tec: "laser", nombre: "Conoce", lema: "Falcon Design Space", icono: "zap", ini: "0:00", fin: "1:00",
      cartas: [
        { foto: "pieza", txt: "El láser corta formas, marca líneas o graba imágenes" },
        { foto: "programa", txt: "En Falcon Design Space se trabaja en el Workspace" },
        { txt: "Diseños simples, creados directamente en el programa" },
      ],
    },
    {
      tec: "laser", nombre: "Diseña", lema: "Formas y medidas exactas", icono: "pen", ini: "1:00", fin: "1:50",
      cartas: [
        { foto: "dibujar", txt: "Las herramientas de dibujo están en la barra izquierda" },
        { foto: "carita", txt: "El tamaño exacto se ajusta arriba a la derecha" },
        { txt: "Líneas, rectángulos y círculos se miden de la misma forma" },
      ],
    },
    {
      tec: "laser", nombre: "Asigna", lema: "Capas de corte y grabado", icono: "layers", ini: "1:50", fin: "3:10",
      cartas: [
        { foto: "color", txt: "Cada color es una capa; Add layer agrega otra" },
        { foto: "modos", txt: "Line cutting atraviesa el material: corta el contorno" },
        { foto: "valores", txt: "Line engraving graba sin atravesar y es más rápido" },
      ],
    },
    {
      tec: "laser", nombre: "Organiza", lema: "Varias operaciones", icono: "frame", ini: "3:10", fin: "3:50",
      cartas: [
        { txt: "Con clic derecho y Move to, una línea cambia de capa" },
        { foto: "grabando", txt: "Primero se graba el nombre, luego se corta el contorno" },
        { txt: "Solo materiales del Bootcamp; potencia y velocidad se revisan en la estación" },
      ],
    },
    {
      tec: "laser", nombre: "Revisa", lema: "Del diseño a la estación", icono: "check", ini: "3:50", fin: "4:50",
      cartas: [
        { txt: "Revisen el tamaño y qué se corta y qué se graba" },
        { txt: "Menos líneas: un archivo más fácil de fabricar" },
        { txt: "No inicien desde la mesa: lleven el computador a la estación láser" },
      ],
    },

    // ---------- Impresión 3D · Video 1: buscar un modelo y prepararlo en Creality Print ----------
    {
      tec: "i3d", nombre: "Piensa", lema: "La pieza que necesitan", icono: "bulb", ini: "0:00", fin: "0:50",
      cartas: [
        { txt: "La impresión 3D convierte un modelo digital en una pieza de plástico" },
        { txt: "No busquen el prototipo completo: busquen una pieza" },
        { txt: "La bitácora ayuda a definir qué pieza necesitan" },
      ],
    },
    {
      tec: "i3d", nombre: "Busca", lema: "Modelos en Thingiverse", icono: "search", ini: "0:50", fin: "2:00",
      cartas: [
        { txt: "Busquen en inglés: wheel, holder, bracket" },
        { txt: "Elijan una pieza simple, pequeña y útil para el prototipo" },
        { txt: "Solo hay una hora para imprimir: piezas rápidas de fabricar" },
      ],
    },
    {
      tec: "i3d", nombre: "Descarga", lema: "El archivo STL", icono: "cube", ini: "2:00", fin: "3:30",
      cartas: [
        { txt: "El formato que necesitan es STL" },
        { txt: "Si descargaron un ZIP, descomprímanlo primero" },
        { txt: "Revisen: archivo STL, pieza correcta y sencilla" },
      ],
    },
    {
      tec: "i3d", nombre: "Prepara", lema: "Tamaño, orientación y calidad", icono: "layers", ini: "3:30", fin: "6:00",
      cartas: [
        { txt: "Creality Print traduce el modelo a instrucciones para la impresora" },
        { txt: "Más grande: más material y más tiempo. Una cara plana sobre la cama" },
        { txt: "Altura de capa 0,28 mm y relleno cercano al 8 %" },
      ],
    },
    {
      tec: "i3d", nombre: "Lamina", lema: "Soportes, tiempo y entrega", icono: "check", ini: "6:00", fin: "7:30",
      cartas: [
        { txt: "Soportes tipo árbol, solo tocando la cama" },
        { txt: "Laminar placa muestra las capas y el tiempo estimado" },
        { txt: "El monitor revisa el archivo; el experto imprime la pieza" },
      ],
    },

    // ---------- Electrónica con Arduino · Video Arduino: sensor ultrasónico, LED y servomotor ----------
    {
      tec: "ard", nombre: "Conoce", lema: "Sensores, Arduino y actuadores", icono: "chip", ini: "0:00", fin: "1:00",
      cartas: [
        { txt: "Los sensores obtienen información del mundo real" },
        { txt: "Arduino procesa esa información con un programa" },
        { txt: "Los actuadores realizan una acción: luz o movimiento" },
      ],
    },
    {
      tec: "ard", nombre: "Conecta", lema: "El sensor ultrasónico y el LED", icono: "plug", ini: "1:00", fin: "2:00",
      cartas: [
        { txt: "Sensor: VCC al pin 5V y GND al GND" },
        { txt: "Sensor: TRIG al pin digital 6 y ECHO al pin digital 8" },
        { txt: "LED: pata larga al pin digital 4 y pata corta al GND" },
      ],
    },
    {
      tec: "ard", nombre: "Programa", lema: "Copiar, pegar y cargar", icono: "pen", ini: "2:00", fin: "2:50",
      cartas: [
        { txt: "El código está bajo el diagrama, en la plataforma" },
        { txt: "En Arduino IDE, borren el texto y peguen el código" },
        { txt: "Elijan la placa y el puerto; la flecha carga el programa" },
      ],
    },
    {
      tec: "ard", nombre: "Prueba", lema: "La mano enciende la luz", icono: "zap", ini: "2:50", fin: "3:30",
      cartas: [
        { txt: "El sensor mide la distancia de forma continua" },
        { txt: "Si un objeto está más cerca del límite, el LED se enciende" },
        { txt: "Al cambiar la distancia en el código, cambia el comportamiento" },
      ],
    },
    {
      tec: "ard", nombre: "Mueve", lema: "El servomotor", icono: "redo", ini: "3:30", fin: "4:30",
      cartas: [
        { txt: "Un servomotor gira al ángulo exacto que se programa" },
        { txt: "Servo: rojo al 5V, café al GND y naranjo al pin digital 3" },
        { txt: "Si no funciona, revisen las conexiones y los pines, y consulten al monitor" },
      ],
    },

    // ---------- Impresión 3D · Extra del Video 1 (va al final para no mover el avance guardado) ----------
    {
      tec: "i3d", nombre: "Modifica", lema: "Cortar, perforar y rotular", icono: "tool", ini: "7:30", fin: "9:00",
      cartas: [
        { txt: "Cortar sirve para usar solo una parte o imprimir más fácil" },
        { txt: "Una pieza negativa, como un cilindro, deja un agujero" },
        { txt: "La herramienta de texto agrega un nombre; la impresión debe durar cerca de una hora" },
      ],
    },

    // Estaciones dentro de Impresión 3D: cada una es una sola misión con el video completo (5:06)
    {
      tec: "i3d-prep", nombre: "Descarga y preparación", lema: "Del modelo descargado a la impresora", icono: "cube", ini: "0:00", fin: "5:06",
      cartas: [
        { txt: "El formato que necesitan es STL" },
        { txt: "Creality Print traduce el modelo a instrucciones para la impresora" },
        { txt: "Altura de capa 0,28 mm y relleno cercano al 8 %" },
      ],
    },
    {
      tec: "i3d-mod", nombre: "Modificación del archivo", lema: "Cortar, perforar y rotular", icono: "tool", ini: "0:00", fin: "5:06",
      cartas: [
        { txt: "Cortar sirve para usar solo una parte o imprimir más fácil" },
        { txt: "Una pieza negativa, como un cilindro, deja un agujero" },
        { txt: "La herramienta de texto agrega un nombre; la impresión debe durar cerca de una hora" },
      ],
    },
  ],

  // CIRCUITOS MAKER: 3 circuitos de ejemplo del equipo de electrónica, de menos a más complejo. Son los mismos de OpenCircuits
  // (menú del logo > Circuitos Maker). La imagen de cada uno está en assets/circuitos-maker/<id>.webp. Todos usan el mismo kit y los mismos pines.
  // materiales: [cantidad, pieza, detalle opcional]. Los cables salen del armado de OpenCircuits: 4 de alimentación (5V, GND y puentes entre rieles),
  // 2 por cada LED, 3 para el servo y 4 para el sensor (macho-hembra, porque el sensor trae pines).
  circuitosMaker: {
    abrir: "opencircuits/",                       // OpenCircuits Web incluido en esta misma carpeta
    // Enlace de descarga de la app de escritorio de OpenCircuits (instalador para Windows). Vacío = no se muestra el botón.
    escritorio: "",
    // Fotos de Wikimedia Commons: [autor, licencia, página]. Se muestran como créditos en la ficha.
    creditos: {
      arduino: ["SparkFun Electronics", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Arduino_Uno_-_R3.jpg"],
      "hcsr04-azul": ["Suyash Dwivedi", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:HC_SR04_Ultrasonic_Module.jpg"],
      protoboard: ["Evan-Amos", "Dominio público", "https://commons.wikimedia.org/wiki/File:Electronics-White-Breadboard.jpg"],
      "led-rojo": ["oomlout", "CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:5mm_Red_LED.jpg"],
      resistencia: ["oomlout", "CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:220_ohms_5%25_axial_resistor.jpg"],
      cables: ["oomlout", "CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:A_few_Jumper_Wires.jpg"],
      "servo-sg90": ["IXEN Robotics", "Foto de tienda: revisar permiso de uso", "https://ixen-robotics.com"],
      "led-verde": ["oomlout", "CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:5mm_Green_LED_2.jpg"],
      "led-amarillo": ["oomlout, color cambiado a amarillo", "CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:5mm_Green_LED_2.jpg"],
      "leds-semaforo": ["oomlout, montaje de 3 fotos", "CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:5mm_Red_LED.jpg"],
    },
    pines: [["TRIG", "D10"], ["ECHO", "D9"], ["LED verde", "D4"], ["LED amarillo", "D5"], ["LED rojo", "D6"], ["Servo", "D3"]],
    circuitos: [
      { id: "alerta", nivel: 1, nivelTxt: "Sensor y luz", nombre: "Alerta de proximidad", usa: "Sensor + LED rojo", piezas: { leds: 1, servo: false },
        descripcion: "El LED rojo se enciende cuando algo se acerca a menos de 30 cm.",
        mineria: "Avisar cuando una persona entra a la zona de peligro de una máquina.",
        aprende: "Usar «si…» con un umbral para decidir.",
        reacciones: [["Menos de 30 cm", "LED rojo encendido"], ["30 cm o más", "LED rojo apagado"]],
        // Con guía, la ficha usa el diseño explicado paso a paso (fotos en assets/circuitos-maker/piezas). En materiales: [cantidad, pieza, detalle, foto, para qué sirve].
        materiales: [[1, "Arduino UNO", "con su cable USB", "arduino", "El cerebro: lee el sensor y decide qué hacer."],
          [1, "Sensor ultrasónico HC-SR04", "", "hcsr04-azul", "Los ojos: mide la distancia con sonido."],
          [1, "Protoboard", "", "protoboard", "Permite conectar todo sin soldar."],
          [1, "LED rojo", "", "led-rojo", "La alarma: se enciende para avisar."],
          [1, "Resistencia de 220 Ω", "", "resistencia", "Protege al LED para que no se queme."],
          [6, "Cables macho-macho", "", "cables", "Unen el Arduino, la protoboard y el LED."],
          [4, "Cables macho-hembra", "para el sensor", "cables", "Se conectan a los pines del sensor."]],
        guia: {
          resumen: "Si algo se acerca a menos de 30 cm, se enciende una luz roja de alerta.",
          // Simulador: zonas [hasta cm, color, texto] y estados [hasta cm, luz encendida, ángulo del servo, texto]; salidas: led-rojo, semaforo, barrera
          sim: { objeto: "persona", intro: "Muevan a la persona hacia el sensor y miren qué pasa con el LED.", salidas: ["led-rojo"],
            zonas: [[30, "rojo", "Zona de alerta · menos de 30 cm"]],
            estados: [[30, "rojo", null, "está dentro de la zona de alerta → <b>LED rojo encendido</b>"], [999, null, null, "está fuera de la zona de alerta → LED apagado"]] },
          pasos: [
            { foto: "hcsr04-azul", t: "Mide", d: "El sensor lanza un sonido que no podemos oír y espera su eco. Según cuánto tarda en volver, sabe a cuántos centímetros está el objeto." },
            { foto: "arduino", t: "Decide", d: "El Arduino compara esa distancia con 30 cm: ¿el objeto está más cerca o más lejos?" },
            { foto: "led-rojo", t: "Avisa", d: "Si está a menos de 30 cm, enciende el LED rojo. Cuando el objeto se aleja, lo apaga." },
          ],
          // Coordenadas de la protoboard tal como aparecen en el diagrama: filas a–j y columnas 1–30; los rieles + y − están arriba y abajo.
          diagramaGrande: "alerta-grande",
          // Dónde va cada pieza: [foto, pieza, coordenadas, nota]
          ubicacion: [
            ["resistencia", "Resistencia de 220 Ω", "e17 → g17", "Cruza el canal del centro de la protoboard."],
            ["led-rojo", "LED rojo", "Pata larga (+) en j17 · pata corta (−) en j16", "La pata larga queda en la misma columna que la resistencia."],
          ],
          // Cables: [color en el diagrama, desde, hasta]
          conexiones: [
            ["#E53935", "Pin 5V del Arduino", "Riel + de abajo · col. 2"],
            ["#212121", "Pin GND del Arduino", "Riel − de abajo · col. 3"],
            ["#E53935", "Riel + de abajo · col. 30", "Riel + de arriba · col. 30"],
            ["#212121", "Riel − de abajo · col. 29", "Riel − de arriba · col. 29"],
            ["#E53935", "VCC del sensor", "Riel + de arriba · col. 28"],
            ["#212121", "GND del sensor", "Riel − de arriba · col. 27"],
            ["#8E44AD", "TRIG del sensor", "Pin D10 del Arduino"],
            ["#2F80ED", "ECHO del sensor", "Pin D9 del Arduino"],
            ["#E53935", "Pin D6 del Arduino", "a17"],
            ["#212121", "i16", "Riel − de arriba · col. 16"],
          ],
        } },
      { id: "barrera", nivel: 2, nivelTxt: "Sensor y servo", nombre: "Barrera automática", usa: "Sensor + servo", piezas: { leds: 0, servo: true },
        descripcion: "Bajo 30 cm la barrera sube a 90° y queda abierta mientras haya algo; luego baja.",
        mineria: "Control de acceso a una zona de la faena.",
        aprende: "Usar la librería Servo y mover a un ángulo.",
        reacciones: [["Menos de 30 cm", "Barrera arriba (90°)"], ["30 cm o más", "Barrera abajo (0°)"]],
        materiales: [[1, "Arduino UNO", "con su cable USB", "arduino", "El cerebro: lee el sensor y decide qué hacer."],
          [1, "Sensor ultrasónico HC-SR04", "", "hcsr04-azul", "Los ojos: mide la distancia con sonido."],
          [1, "Protoboard", "", "protoboard", "Permite conectar todo sin soldar."],
          [1, "Micro servo SG90", "", "servo-sg90", "El brazo: gira para subir y bajar la barrera."],
          [7, "Cables macho-macho", "", "cables", "Unen el Arduino, la protoboard y el servo."],
          [4, "Cables macho-hembra", "para el sensor", "cables", "Se conectan a los pines del sensor."]],
        guia: {
          resumen: "Cuando algo se acerca a menos de 30 cm, la barrera sube sola. Cuando se va, baja.",
          sim: { objeto: "vehiculo", intro: "Acerquen el vehículo al sensor y miren cómo se mueve la barrera.", salidas: ["barrera"],
            zonas: [[30, "azul", "Menos de 30 cm · la barrera sube"]],
            estados: [[30, null, 90, "hay algo cerca → <b>barrera arriba (90°)</b>"], [999, null, 0, "no hay nada cerca → barrera abajo (0°)"]] },
          pasos: [
            { foto: "hcsr04-azul", t: "Mide", d: "El sensor lanza un sonido que no podemos oír y espera su eco. Según cuánto tarda en volver, sabe a cuántos centímetros está el objeto." },
            { foto: "arduino", t: "Decide", d: "El Arduino compara esa distancia con 30 cm: ¿hay algo cerca de la barrera?" },
            { foto: "servo-sg90", t: "Mueve", d: "Si hay algo a menos de 30 cm, el servo gira a 90° y sube la barrera. Mientras siga ahí, queda arriba; cuando se va, vuelve a 0°." },
          ],
          diagramaGrande: "barrera-grande",
          ubicacion: [
            ["servo-sg90", "Micro servo SG90", "Va fuera de la protoboard, conectado con 3 cables", "Cable café = GND · cable rojo = 5V · cable naranjo = señal."],
          ],
          conexiones: [
            ["#E53935", "Pin 5V del Arduino", "Riel + de abajo · col. 2"],
            ["#212121", "Pin GND del Arduino", "Riel − de abajo · col. 3"],
            ["#E53935", "Riel + de abajo · col. 30", "Riel + de arriba · col. 30"],
            ["#212121", "Riel − de abajo · col. 29", "Riel − de arriba · col. 29"],
            ["#E53935", "VCC del sensor", "Riel + de arriba · col. 28"],
            ["#212121", "GND del sensor", "Riel − de arriba · col. 27"],
            ["#8E44AD", "TRIG del sensor", "Pin D10 del Arduino"],
            ["#2F80ED", "ECHO del sensor", "Pin D9 del Arduino"],
            ["#212121", "GND del servo (cable café)", "Riel − de abajo · col. 25"],
            ["#E53935", "VCC del servo (cable rojo)", "Riel + de abajo · col. 26"],
            ["#F39C12", "Señal del servo (cable naranjo)", "Pin D3 del Arduino"],
          ],
        } },
      { id: "barrera-semaforo", nivel: 3, nivelTxt: "Sensor, servo y luces", nombre: "Barrera con semáforo", usa: "Sensor + servo + 3 LEDs", piezas: { leds: 3, servo: true },
        descripcion: "Lejos: rojo y barrera abajo. Al acercarse un vehículo pasa a amarillo; cuando llega a menos de 30 cm, verde y sube la barrera.",
        mineria: "Paso controlado de vehículos en una entrada a la mina.",
        aprende: "Coordinar luces y movimiento según la distancia.",
        reacciones: [["50 cm o más", "Rojo · barrera abajo (0°)"], ["De 30 a 49 cm", "Amarillo · barrera abajo (0°)"], ["Menos de 30 cm", "Verde · barrera arriba (90°)"]],
        materiales: [[1, "Arduino UNO", "con su cable USB", "arduino", "El cerebro: lee el sensor y decide qué hacer."],
          [1, "Sensor ultrasónico HC-SR04", "", "hcsr04-azul", "Los ojos: mide la distancia con sonido."],
          [1, "Protoboard", "", "protoboard", "Permite conectar todo sin soldar."],
          [3, "LEDs", "verde, amarillo y rojo", "leds-semaforo", "El semáforo: avisa qué está pasando."],
          [3, "Resistencias de 220 Ω", "", "resistencia", "Una por LED, para que no se quemen."],
          [1, "Micro servo SG90", "", "servo-sg90", "El brazo: sube y baja la barrera."],
          [13, "Cables macho-macho", "", "cables", "Unen el Arduino, la protoboard, los LEDs y el servo."],
          [4, "Cables macho-hembra", "para el sensor", "cables", "Se conectan a los pines del sensor."]],
        guia: {
          resumen: "Un semáforo y una barrera trabajan juntos: rojo si el vehículo está lejos, amarillo cuando se acerca y verde con la barrera arriba cuando llega.",
          sim: { objeto: "vehiculo", intro: "Acerquen el vehículo y miren cómo cambian el semáforo y la barrera.", salidas: ["semaforo", "barrera"],
            zonas: [[30, "verde", "Menos de 30 cm · pasa"], [50, "amarillo", "30 a 49 cm · se acerca"]],
            estados: [[30, "verde", 90, "llegó a la barrera → <b>verde · barrera arriba (90°)</b>"], [50, "amarillo", 0, "se está acercando → <b>amarillo · barrera abajo (0°)</b>"], [999, "rojo", 0, "está lejos → <b>rojo · barrera abajo (0°)</b>"]] },
          pasos: [
            { foto: "hcsr04-azul", t: "Mide", d: "El sensor lanza un sonido que no podemos oír y espera su eco. Así sabe a cuántos centímetros está el vehículo." },
            { foto: "arduino", t: "Decide", d: "El Arduino compara la distancia con 50 cm y con 30 cm para saber si el vehículo está lejos, se acerca o ya llegó." },
            { foto: "leds-semaforo", t: "Avisa", d: "Lejos: rojo. Entre 30 y 49 cm: amarillo. A menos de 30 cm: verde." },
            { foto: "servo-sg90", t: "Mueve", d: "Con verde, el servo gira a 90° y sube la barrera para dejar pasar al vehículo. Con rojo o amarillo, queda abajo." },
          ],
          diagramaGrande: "barrera-semaforo-grande",
          ubicacion: [
            ["led-verde", "LED verde", "Pata larga (+) en j9 · pata corta (−) en j8", "Conectado al pin D4."],
            ["led-amarillo", "LED amarillo", "Pata larga (+) en j13 · pata corta (−) en j12", "Conectado al pin D5."],
            ["led-rojo", "LED rojo", "Pata larga (+) en j17 · pata corta (−) en j16", "Conectado al pin D6."],
            ["resistencia", "3 resistencias de 220 Ω", "e9 → g9 · e13 → g13 · e17 → g17", "Cada una cruza el canal del centro, bajo su LED."],
            ["servo-sg90", "Micro servo SG90", "Va fuera de la protoboard, conectado con 3 cables", "Cable café = GND · cable rojo = 5V · cable naranjo = señal."],
          ],
          conexiones: [
            ["#E53935", "Pin 5V del Arduino", "Riel + de abajo · col. 2"],
            ["#212121", "Pin GND del Arduino", "Riel − de abajo · col. 3"],
            ["#E53935", "Riel + de abajo · col. 30", "Riel + de arriba · col. 30"],
            ["#212121", "Riel − de abajo · col. 29", "Riel − de arriba · col. 29"],
            ["#E53935", "VCC del sensor", "Riel + de arriba · col. 28"],
            ["#212121", "GND del sensor", "Riel − de arriba · col. 27"],
            ["#8E44AD", "TRIG del sensor", "Pin D10 del Arduino"],
            ["#2F80ED", "ECHO del sensor", "Pin D9 del Arduino"],
            ["#2E9E4F", "Pin D4 del Arduino", "a9"],
            ["#212121", "i8", "Riel − de arriba · col. 8"],
            ["#F39C12", "Pin D5 del Arduino", "a13"],
            ["#212121", "i12", "Riel − de arriba · col. 12"],
            ["#E53935", "Pin D6 del Arduino", "a17"],
            ["#212121", "i16", "Riel − de arriba · col. 16"],
            ["#212121", "GND del servo (cable café)", "Riel − de abajo · col. 25"],
            ["#E53935", "VCC del servo (cable rojo)", "Riel + de abajo · col. 26"],
            ["#F39C12", "Señal del servo (cable naranjo)", "Pin D3 del Arduino"],
          ],
        } },
    ],
  },
};
