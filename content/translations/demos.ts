import type { Locale } from '../../types/history';

const en = {
  laboratory: 'Interactive laboratory',
  reset: 'Reset',
  input: 'Input',
  weight: 'Weight',
  bias: 'Bias',
  output: 'Output',
  class: 'Class',
  selectedInput: 'Selected input',
  decisionBoundary: 'Decision boundary',
  activation: 'Weighted sum',
  perceptronTitle: 'Where does the decision change?',
  perceptronIntro:
    'Move the input or change the weights. A threshold unit divides this two-dimensional input space with a straight line.',
  perceptronGraphic:
    'Input space with circle symbols for class 0, square symbols for class 1, a line for the decision boundary and a diamond for the selected input.',
  perceptronNote:
    'This is a mathematical artificial unit, not a biological neuron. A single linear boundary cannot represent every classification rule, including XOR.',
  noBoundary: 'No dividing line crosses the visible input range.',
  threshold: 'Class 1 when the weighted sum is at least zero; class 0 otherwise.',
  convolutionTitle: 'What makes a pattern stand out?',
  convolutionIntro:
    'Rotate the bright line and choose a filter. The same 3 × 3 filter slides over every patch of the image to produce a 5 × 5 response map.',
  orientation: 'Stimulus angle',
  filter: 'Filter',
  horizontal: 'Horizontal line',
  vertical: 'Vertical line',
  diagonal: 'Diagonal line',
  stimulus: 'Stimulus',
  responseMap: 'Response map',
  selectedPatch: 'Selected patch',
  row: 'Row',
  column: 'Column',
  response: 'Response',
  convolutionGraphic:
    'A seven by seven image with the currently selected three by three patch outlined.',
  filterGraphic: 'A three by three filter with signed weights.',
  patchHint:
    'Select a response cell to inspect the input patch. Positive and negative values indicate alignment with the filter and its opposite.',
  cortexHeading: 'A useful analogy, with limits',
  idealizedField: 'Idealized receptive field',
  computationalFilter: 'Computational filter',
  relativeResponse: 'Relative response',
  signedResponse: 'Signed response',
  comparisonNote:
    'Using the same selected patch, the receptive-field cartoon rectifies the sum to a nonnegative response: r = max(0, sum). The computational filter keeps its signed result. The cartoon is illustrative, not a fit to measured biological data.',
  cortexNote:
    'This hand-designed filter illustrates spatial selectivity. Real cortical receptive fields are measured from responses and can depend on time, context and nonlinear processing. A shared numerical filter is not a biological equivalent.',
  operationNote:
    'Each response is the sum of nine pixel × weight products. As in most CNN libraries, this is cross-correlation: the filter is not flipped. No padding or activation is applied.',
  numericalValues: 'Inspect numerical values',
  centerResponse: 'Center response',
  sumOfProducts: 'Sum of pixel × weight products',
  backpropagationTitle: 'Let the error change the weights.',
  backpropagationIntro:
    'A tiny network predicts a number. Follow the error backward through one hidden unit, then take a gradient step to improve its prediction.',
  target: 'Target',
  learningRate: 'Learning rate',
  prediction: 'Prediction',
  loss: 'Loss',
  hidden: 'Hidden unit',
  step: 'Train one step',
  tenSteps: 'Train 10 steps',
  steps: 'Training steps',
  forward: 'Forward calculation',
  backward: 'Gradients',
  networkGraphic:
    'A scalar input connects to a tanh hidden unit through weight w1, which connects to a linear output through weight w2. The error is differentiated backward through both weights.',
  lossHistory: 'Loss after each training step',
  startLoss: 'Initial loss',
  currentLoss: 'Current loss',
  effectiveRate: 'Step size used',
  backpropagationNote:
    'The chain rule computes how each weight affects the loss. This demo uses a differentiable artificial network with one training example and no biases. It does not model how biological synapses learn.',
  adaptiveNote:
    'The selected learning rate is an upper bound. If a step would increase loss, its size is halved until loss does not increase.',
  zeroGradient: 'Both gradients are zero. Change a weight or the input to explore another state.',
};

type DemoStrings = typeof en;
const de: DemoStrings = {
  laboratory: 'Interaktives Labor',
  reset: 'Zurücksetzen',
  input: 'Eingabe',
  weight: 'Gewicht',
  bias: 'Bias',
  output: 'Ausgabe',
  class: 'Klasse',
  selectedInput: 'Gewählte Eingabe',
  decisionBoundary: 'Entscheidungsgrenze',
  activation: 'Gewichtete Summe',
  perceptronTitle: 'Wo ändert sich die Entscheidung?',
  perceptronIntro:
    'Verändere die Eingabe oder die Gewichte. Eine Schwellwerteinheit teilt diesen zweidimensionalen Eingaberaum durch eine Gerade.',
  perceptronGraphic:
    'Eingaberaum mit Kreisen für Klasse 0, Quadraten für Klasse 1, einer Geraden als Entscheidungsgrenze und einer Raute für die gewählte Eingabe.',
  perceptronNote:
    'Dies ist eine mathematische künstliche Einheit, kein biologisches Neuron. Eine einzelne lineare Grenze kann nicht jede Klassifikationsregel darstellen, zum Beispiel XOR.',
  noBoundary: 'Keine Trennlinie schneidet den sichtbaren Eingabebereich.',
  threshold: 'Klasse 1, wenn die gewichtete Summe mindestens null ist; sonst Klasse 0.',
  convolutionTitle: 'Wann sticht ein Muster hervor?',
  convolutionIntro:
    'Drehe die helle Linie und wähle einen Filter. Derselbe 3 × 3-Filter gleitet über jeden Bildausschnitt und erzeugt eine 5 × 5-Antwortkarte.',
  orientation: 'Reizwinkel',
  filter: 'Filter',
  horizontal: 'Horizontale Linie',
  vertical: 'Vertikale Linie',
  diagonal: 'Diagonale Linie',
  stimulus: 'Reiz',
  responseMap: 'Antwortkarte',
  selectedPatch: 'Gewählter Ausschnitt',
  row: 'Zeile',
  column: 'Spalte',
  response: 'Antwort',
  convolutionGraphic:
    'Ein Bild mit sieben mal sieben Werten. Der gewählte Ausschnitt mit drei mal drei Werten ist umrandet.',
  filterGraphic: 'Ein Filter mit drei mal drei vorzeichenbehafteten Gewichten.',
  patchHint:
    'Wähle eine Antwortzelle, um den Bildausschnitt zu untersuchen. Positive und negative Werte zeigen Übereinstimmung mit dem Filter oder seinem Gegenmuster.',
  cortexHeading: 'Eine hilfreiche Analogie mit Grenzen',
  idealizedField: 'Idealisiertes rezeptives Feld',
  computationalFilter: 'Computergestützter Filter',
  relativeResponse: 'Relative Antwort',
  signedResponse: 'Antwort mit Vorzeichen',
  comparisonNote:
    'Für denselben gewählten Ausschnitt begrenzt das vereinfachte rezeptive Feld die Summe auf nichtnegative Werte: r = max(0, Summe). Der numerische Filter behält das Vorzeichen. Das Modell dient der Veranschaulichung und ist nicht an biologische Messdaten angepasst.',
  cortexNote:
    'Dieser von Hand entworfene Filter veranschaulicht räumliche Selektivität. Echte kortikale rezeptive Felder werden anhand von Antworten gemessen und können von Zeit, Kontext und nichtlinearer Verarbeitung abhängen. Ein gemeinsamer numerischer Filter ist kein biologisches Äquivalent.',
  operationNote:
    'Jede Antwort ist die Summe aus neun Produkten von Pixelwert und Gewicht. Wie in den meisten CNN-Bibliotheken ist dies Kreuzkorrelation: Der Filter wird nicht gespiegelt. Es gibt weder Padding noch Aktivierungsfunktion.',
  numericalValues: 'Numerische Werte ansehen',
  centerResponse: 'Antwort im Zentrum',
  sumOfProducts: 'Summe der Produkte aus Pixelwert und Gewicht',
  backpropagationTitle: 'Der Fehler verändert die Gewichte.',
  backpropagationIntro:
    'Ein winziges Netz sagt eine Zahl voraus. Verfolge den Fehler rückwärts durch eine versteckte Einheit und verbessere die Vorhersage mit einem Gradientenschritt.',
  target: 'Zielwert',
  learningRate: 'Lernrate',
  prediction: 'Vorhersage',
  loss: 'Verlust',
  hidden: 'Versteckte Einheit',
  step: 'Einen Schritt trainieren',
  tenSteps: '10 Schritte trainieren',
  steps: 'Trainingsschritte',
  forward: 'Vorwärtsrechnung',
  backward: 'Gradienten',
  networkGraphic:
    'Ein skalarer Eingang ist über das Gewicht w1 mit einer versteckten tanh-Einheit verbunden. Diese ist über w2 mit einer linearen Ausgabe verbunden. Der Fehler wird rückwärts durch beide Gewichte abgeleitet.',
  lossHistory: 'Verlust nach jedem Trainingsschritt',
  startLoss: 'Anfangsverlust',
  currentLoss: 'Aktueller Verlust',
  effectiveRate: 'Verwendete Schrittweite',
  backpropagationNote:
    'Die Kettenregel berechnet den Einfluss jedes Gewichts auf den Verlust. Dieses Beispiel verwendet ein differenzierbares künstliches Netz mit einem Trainingsbeispiel und ohne Bias. Es modelliert nicht das Lernen biologischer Synapsen.',
  adaptiveNote:
    'Die gewählte Lernrate ist eine Obergrenze. Würde ein Schritt den Verlust erhöhen, wird seine Größe halbiert, bis der Verlust nicht mehr steigt.',
  zeroGradient:
    'Beide Gradienten sind null. Verändere ein Gewicht oder die Eingabe, um einen anderen Zustand zu untersuchen.',
};

const es: DemoStrings = {
  laboratory: 'Laboratorio interactivo',
  reset: 'Restablecer',
  input: 'Entrada',
  weight: 'Peso',
  bias: 'Sesgo',
  output: 'Salida',
  class: 'Clase',
  selectedInput: 'Entrada seleccionada',
  decisionBoundary: 'Frontera de decisión',
  activation: 'Suma ponderada',
  perceptronTitle: '¿Dónde cambia la decisión?',
  perceptronIntro:
    'Mueve la entrada o cambia los pesos. Una unidad de umbral divide este espacio de entrada bidimensional con una línea recta.',
  perceptronGraphic:
    'Espacio de entrada con círculos para la clase 0, cuadrados para la clase 1, una línea para la frontera de decisión y un rombo para la entrada seleccionada.',
  perceptronNote:
    'Esta es una unidad artificial matemática, no una neurona biológica. Una sola frontera lineal no puede representar todas las reglas de clasificación, por ejemplo XOR.',
  noBoundary: 'Ninguna línea divisoria cruza el intervalo de entrada visible.',
  threshold: 'Clase 1 cuando la suma ponderada es al menos cero; clase 0 en caso contrario.',
  convolutionTitle: '¿Qué hace que destaque un patrón?',
  convolutionIntro:
    'Gira la línea brillante y elige un filtro. El mismo filtro de 3 × 3 recorre cada región de la imagen y produce un mapa de respuesta de 5 × 5.',
  orientation: 'Ángulo del estímulo',
  filter: 'Filtro',
  horizontal: 'Línea horizontal',
  vertical: 'Línea vertical',
  diagonal: 'Línea diagonal',
  stimulus: 'Estímulo',
  responseMap: 'Mapa de respuesta',
  selectedPatch: 'Región seleccionada',
  row: 'Fila',
  column: 'Columna',
  response: 'Respuesta',
  convolutionGraphic:
    'Una imagen de siete por siete valores con la región seleccionada de tres por tres enmarcada.',
  filterGraphic: 'Un filtro de tres por tres con pesos positivos y negativos.',
  patchHint:
    'Selecciona una celda de respuesta para examinar la región de entrada. Los valores positivos y negativos indican alineación con el filtro o con su patrón opuesto.',
  cortexHeading: 'Una analogía útil, con límites',
  idealizedField: 'Campo receptivo idealizado',
  computationalFilter: 'Filtro computacional',
  relativeResponse: 'Respuesta relativa',
  signedResponse: 'Respuesta con signo',
  comparisonNote:
    'Para la misma región seleccionada, el esquema de campo receptivo rectifica la suma para obtener una respuesta no negativa: r = max(0, suma). El filtro computacional conserva el signo. El esquema es ilustrativo, no un ajuste a datos biológicos medidos.',
  cortexNote:
    'Este filtro diseñado a mano ilustra la selectividad espacial. Los campos receptivos corticales reales se miden a partir de respuestas y pueden depender del tiempo, el contexto y el procesamiento no lineal. Un filtro numérico compartido no es un equivalente biológico.',
  operationNote:
    'Cada respuesta es la suma de nueve productos de píxel × peso. Como en la mayoría de bibliotecas de CNN, esto es correlación cruzada: el filtro no se invierte. No se aplica relleno ni activación.',
  numericalValues: 'Examinar valores numéricos',
  centerResponse: 'Respuesta central',
  sumOfProducts: 'Suma de productos de píxel × peso',
  backpropagationTitle: 'Deja que el error cambie los pesos.',
  backpropagationIntro:
    'Una pequeña red predice un número. Sigue el error hacia atrás por una unidad oculta y da un paso de gradiente para mejorar la predicción.',
  target: 'Objetivo',
  learningRate: 'Tasa de aprendizaje',
  prediction: 'Predicción',
  loss: 'Pérdida',
  hidden: 'Unidad oculta',
  step: 'Entrenar un paso',
  tenSteps: 'Entrenar 10 pasos',
  steps: 'Pasos de entrenamiento',
  forward: 'Cálculo hacia delante',
  backward: 'Gradientes',
  networkGraphic:
    'Una entrada escalar se conecta a una unidad oculta tanh mediante el peso w1, que se conecta a una salida lineal mediante w2. El error se deriva hacia atrás a través de ambos pesos.',
  lossHistory: 'Pérdida después de cada paso de entrenamiento',
  startLoss: 'Pérdida inicial',
  currentLoss: 'Pérdida actual',
  effectiveRate: 'Tamaño de paso utilizado',
  backpropagationNote:
    'La regla de la cadena calcula cómo afecta cada peso a la pérdida. Esta demostración usa una red artificial diferenciable con un ejemplo de entrenamiento y sin sesgos. No modela cómo aprenden las sinapsis biológicas.',
  adaptiveNote:
    'La tasa de aprendizaje seleccionada es un límite superior. Si un paso aumentara la pérdida, su tamaño se divide entre dos hasta que la pérdida no aumente.',
  zeroGradient: 'Ambos gradientes son cero. Cambia un peso o la entrada para explorar otro estado.',
};

export const demoTranslations: Record<Locale, DemoStrings> = { en, de, es };
export type { DemoStrings };
