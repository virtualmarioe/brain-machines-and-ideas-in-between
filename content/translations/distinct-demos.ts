import type { DistinctKind, Locale } from '@/types/history';
type Triple = [string, string, string];
export const local = (text: Triple, locale: Locale) => text[{ en: 0, de: 1, es: 2 }[locale]];
export const distinctCopy: Record<DistinctKind, { title: Triple; intro: Triple; note: Triple }> = {
  arbor: {
    title: [
      'Trace a dendritic tree',
      'Einen Dendritenbaum verfolgen',
      'Seguir un árbol dendrítico',
    ],
    intro: [
      'Add branching levels and follow the paths from one cell body to its tips.',
      'Ergänzen Sie Verzweigungen und verfolgen Sie die Wege vom Zellkörper zu den Spitzen.',
      'Añada niveles de ramificación y siga los caminos del soma a las puntas.',
    ],
    note: [
      'An idealized binary tree, not a reconstruction of a Cajal drawing. Shape alone does not establish the direction of signaling.',
      'Ein idealisierter binärer Baum, keine Rekonstruktion einer Cajal-Zeichnung. Die Form allein belegt keine Signalrichtung.',
      'Árbol binario idealizado, no reconstrucción de un dibujo de Cajal. La forma por sí sola no establece la dirección de la señal.',
    ],
  },
  synapse: {
    title: [
      'Separate cells, timed communication',
      'Getrennte Zellen, zeitliche Kommunikation',
      'Células separadas, comunicación temporal',
    ],
    intro: [
      'Change the delay at a contact and compare the two cells’ signal times.',
      'Verändern Sie die Verzögerung am Kontakt und vergleichen Sie die Signalzeiten der Zellen.',
      'Cambie el retraso en un contacto y compare los tiempos de señal de las células.',
    ],
    note: [
      'A modern schematic of communication between distinct cells. The imposed delay is illustrative; it is not a historical measurement or a simulation of synaptic chemistry.',
      'Modernes Schema der Kommunikation getrennter Zellen. Die Verzögerung ist illustrativ, keine historische Messung oder Simulation synaptischer Chemie.',
      'Esquema moderno de comunicación entre células distintas. El retraso es ilustrativo, no una medición histórica ni una simulación química.',
    ],
  },
  orientation: {
    title: [
      'Find a preferred orientation',
      'Eine bevorzugte Orientierung finden',
      'Encontrar una orientación preferida',
    ],
    intro: [
      'Rotate the stimulus and compare it with a cell preferring a vertical line.',
      'Drehen Sie den Reiz und vergleichen Sie ihn mit einer Zelle, die vertikale Linien bevorzugt.',
      'Gire el estímulo y compárelo con una célula que prefiere líneas verticales.',
    ],
    note: [
      'A normalized cosine-squared tuning curve, not recorded firing rates. Real cells also depend on position, contrast, and context.',
      'Normierte Kosinusquadrat-Kurve, keine gemessenen Feuerraten. Reale Zellen reagieren auch auf Position, Kontrast und Kontext.',
      'Curva coseno al cuadrado normalizada, no tasas registradas. Las células reales dependen también de posición, contraste y contexto.',
    ],
  },
  sharing: {
    title: ['Count shared weights', 'Geteilte Gewichte zählen', 'Contar pesos compartidos'],
    intro: [
      'Enlarge an image: one shared 3 × 3 filter keeps the same parameter count at every location.',
      'Vergrößern Sie das Bild: Ein geteilter 3 × 3-Filter behält an jeder Position dieselbe Parameterzahl.',
      'Amplíe la imagen: un filtro compartido de 3 × 3 conserva el mismo número de parámetros en cada posición.',
    ],
    note: [
      'One input channel, one filter, stride one, no padding, with bias. The comparison is an unshared locally connected layer, not a complete LeNet model.',
      'Ein Eingangskanal, ein Filter, Schrittweite eins, kein Padding, mit Bias. Vergleich mit einer lokal verbundenen Schicht ohne Gewichtsteilung, keinem vollständigen LeNet.',
      'Un canal, un filtro, paso uno, sin relleno y con sesgo. Se compara una capa local sin compartir pesos, no un LeNet completo.',
    ],
  },
  rectifier: {
    title: [
      'Open and close a rectifier',
      'Einen Gleichrichter öffnen und schließen',
      'Abrir y cerrar un rectificador',
    ],
    intro: [
      'Move the input through zero and inspect both output and local gradient.',
      'Bewegen Sie den Eingang durch null und betrachten Sie Ausgabe und lokalen Gradienten.',
      'Mueva la entrada a través de cero e inspeccione la salida y el gradiente local.',
    ],
    note: [
      'One ReLU unit, not an AlexNet training run. The derivative at zero is undefined mathematically; this illustration uses the common zero convention.',
      'Eine ReLU-Einheit, kein AlexNet-Training. Bei null ist die Ableitung mathematisch undefiniert; hier gilt die übliche Nullkonvention.',
      'Una unidad ReLU, no entrenamiento de AlexNet. La derivada en cero es indefinida; se usa la convención habitual de cero.',
    ],
  },
  digits: {
    title: ['Edit a tiny digit', 'Eine kleine Ziffer bearbeiten', 'Editar un dígito pequeño'],
    intro: [
      'Toggle pixels and compare the drawing with two fixed templates: 0 and 1.',
      'Schalten Sie Pixel um und vergleichen Sie die Zeichnung mit zwei festen Vorlagen: 0 und 1.',
      'Cambie píxeles y compare el dibujo con dos plantillas fijas: 0 y 1.',
    ],
    note: [
      'A 5 × 5 nearest-template exercise using invented patterns, not MNIST samples or a trained classifier. Matching pixels does not provide handwriting recognition.',
      '5 × 5-Vorlagenvergleich mit erfundenen Mustern, keine MNIST-Daten oder trainierte Klassifikation. Pixelvergleich ist keine Handschrifterkennung.',
      'Comparación de plantillas de 5 × 5 inventadas, no muestras MNIST ni un clasificador entrenado. Comparar píxeles no equivale a reconocer escritura.',
    ],
  },
  'q-update': {
    title: [
      'Learn from the best next action',
      'Von der besten nächsten Aktion lernen',
      'Aprender de la mejor acción siguiente',
    ],
    intro: [
      'Vary the two next-action values. Q-learning uses their maximum in its update target.',
      'Variieren Sie die Werte zweier Folgeaktionen. Q-Lernen nutzt ihr Maximum im Aktualisierungsziel.',
      'Varíe los valores de dos acciones siguientes. Q-learning utiliza su máximo en el objetivo.',
    ],
    note: [
      'One tabular update: reward 1, discount 0.9, learning rate 0.25. Values are hand-selected, not learned from an environment.',
      'Eine tabellarische Aktualisierung: Belohnung 1, Diskontierung 0,9, Lernrate 0,25. Werte sind vorgegeben, nicht aus einer Umgebung gelernt.',
      'Una actualización tabular: recompensa 1, descuento 0,9, tasa 0,25. Valores elegidos, no aprendidos de un entorno.',
    ],
  },
  surprise: {
    title: [
      'Expectation changes surprise',
      'Erwartung verändert Überraschung',
      'La expectativa cambia la sorpresa',
    ],
    intro: [
      'Compare delivered reward with expectation. The same outcome can be better or worse than expected.',
      'Vergleichen Sie Belohnung und Erwartung. Dasselbe Ergebnis kann besser oder schlechter als erwartet sein.',
      'Compare recompensa recibida y expectativa. Un mismo resultado puede ser mejor o peor de lo esperado.',
    ],
    note: [
      'A signed reward-minus-expectation analogy, not a dopamine firing-rate model. Dopamine signals vary across cells, tasks, and timescales.',
      'Analogie aus Belohnung minus Erwartung, kein Modell dopaminerger Feuerraten. Signale variieren zwischen Zellen, Aufgaben und Zeitskalen.',
      'Analogía de recompensa menos expectativa, no un modelo de disparo dopaminérgico. Las señales varían por célula, tarea y escala temporal.',
    ],
  },
  replay: {
    title: [
      'Break up a sequence with replay',
      'Eine Folge durch Replay auflockern',
      'Interrumpir una secuencia con replay',
    ],
    intro: [
      'Compare four consecutive experiences with a shuffled sample from the same buffer.',
      'Vergleichen Sie vier aufeinanderfolgende Erfahrungen mit einer gemischten Stichprobe desselben Puffers.',
      'Compare cuatro experiencias consecutivas con una muestra mezclada del mismo búfer.',
    ],
    note: [
      'A small fixed replay buffer. Sampling illustrates temporal diversity, not a guarantee of independence or improved learning. No game agent is trained.',
      'Ein kleiner fester Replay-Puffer. Stichproben zeigen zeitliche Vielfalt, garantieren weder Unabhängigkeit noch besseres Lernen. Kein Spielagent wird trainiert.',
      'Búfer fijo pequeño. El muestreo ilustra diversidad temporal, no garantiza independencia ni mejor aprendizaje. No se entrena un agente.',
    ],
  },
  'tree-search': {
    title: [
      'Balance search and exploitation',
      'Suche und Ausnutzung abwägen',
      'Equilibrar búsqueda y explotación',
    ],
    intro: [
      'Adjust exploration strength to see when a less-visited branch becomes worth investigating.',
      'Verändern Sie die Explorationsstärke und beobachten Sie, wann ein seltener besuchter Zweig interessant wird.',
      'Ajuste la exploración para ver cuándo merece la pena investigar una rama menos visitada.',
    ],
    note: [
      'An illustrative prior-guided search score Q + cP√N/(1+n), not the full AlphaGo algorithm. Fixed branch values are not game outcomes.',
      'Illustrativer priorgestützter Suchwert Q + cP√N/(1+n), nicht der vollständige AlphaGo-Algorithmus. Feste Zweigwerte sind keine Spielergebnisse.',
      'Puntuación ilustrativa Q + cP√N/(1+n), no el algoritmo AlphaGo completo. Los valores fijos no son resultados de partidas.',
    ],
  },
  representations: {
    title: [
      'Compare response geometry',
      'Antwortgeometrie vergleichen',
      'Comparar geometrías de respuesta',
    ],
    intro: [
      'Swap the two model units: pairwise stimulus distances stay the same. Distort one response to change the geometry.',
      'Vertauschen Sie die beiden Modelleinheiten: Reizabstände bleiben gleich. Verzerren Sie eine Antwort, um die Geometrie zu verändern.',
      'Intercambie las dos unidades: las distancias entre estímulos no cambian. Distorsione una respuesta para cambiar la geometría.',
    ],
    note: [
      'Two invented response spaces and Euclidean distances. Similar geometry does not establish shared mechanisms or biological equivalence.',
      'Zwei erfundene Antworträume und euklidische Abstände. Ähnliche Geometrie belegt weder gleiche Mechanismen noch biologische Gleichwertigkeit.',
      'Dos espacios de respuesta inventados y distancias euclídeas. Una geometría similar no establece mecanismos compartidos ni equivalencia biológica.',
    ],
  },
};
