import { text } from './translations/ui';
import type { LocalizedText } from '@/types/history';
export interface LearningJourney {
  id: string;
  title: LocalizedText;
  outcome: LocalizedText;
  stops: { entityId: string; question: LocalizedText; takeaway: LocalizedText }[];
}
export const learningJourneys: LearningJourney[] = [
  {
    id: 'neurons-to-networks',
    title: text(
      'From neurons to neural networks',
      'Von Neuronen zu neuronalen Netzen',
      'De neuronas a redes neuronales',
    ),
    outcome: text(
      'Distinguish biological discoveries from computational abstractions and explain how learning changes a network.',
      'Biologische Entdeckungen von rechnerischen Abstraktionen unterscheiden und erklären, wie Lernen ein Netz verändert.',
      'Distinguir descubrimientos biológicos de abstracciones computacionales y explicar cómo el aprendizaje cambia una red.',
    ),
    stops: [
      {
        entityId: 'cajal',
        question: text(
          'What can a drawing reveal, and what can it not establish about function?',
          'Was zeigt eine Zeichnung, und was belegt sie nicht über die Funktion?',
          '¿Qué revela un dibujo y qué no demuestra sobre la función?',
        ),
        takeaway: text(
          'Cell structure supplies evidence about organization; it does not by itself specify a learning algorithm.',
          'Zellstruktur liefert Belege zur Organisation, aber noch keinen Lernalgorithmus.',
          'La estructura celular aporta evidencia sobre organización, no define por sí sola un algoritmo de aprendizaje.',
        ),
      },
      {
        entityId: 'mcculloch-pitts',
        question: text(
          'What does a threshold unit leave out of a biological neuron?',
          'Was lässt eine Schwelleneinheit am biologischen Neuron weg?',
          '¿Qué omite una unidad de umbral respecto a una neurona biológica?',
        ),
        takeaway: text(
          'A threshold model captures a logical operation while omitting most cellular dynamics.',
          'Ein Schwellenmodell erfasst eine logische Operation und lässt die meisten zellulären Dynamiken weg.',
          'Un modelo de umbral representa una operación lógica y omite gran parte de la dinámica celular.',
        ),
      },
      {
        entityId: 'hebb',
        question: text(
          'How could changing connections store experience?',
          'Wie könnten veränderte Verbindungen Erfahrung speichern?',
          '¿Cómo podrían almacenar experiencia los cambios en las conexiones?',
        ),
        takeaway: text(
          'Learning can be described as changes in connection strength; a historical proposal is distinct from a precise update rule.',
          'Lernen lässt sich als Änderung von Verbindungsstärken beschreiben; eine historische Hypothese ist keine exakte Aktualisierungsregel.',
          'El aprendizaje puede describirse mediante cambios de fuerza en las conexiones; una propuesta histórica no es una regla de actualización exacta.',
        ),
      },
      {
        entityId: 'perceptron',
        question: text(
          'Which patterns can a single linear boundary separate?',
          'Welche Muster trennt eine einzelne lineare Grenze?',
          '¿Qué patrones puede separar una frontera lineal?',
        ),
        takeaway: text(
          'Training changes the boundary, but cannot remove the representational limits of a single linear classifier.',
          'Training verändert die Grenze, beseitigt aber nicht die Darstellungsgrenzen eines einzelnen linearen Klassifikators.',
          'El entrenamiento cambia la frontera, pero no elimina los límites de representación de un clasificador lineal.',
        ),
      },
      {
        entityId: 'backpropagation',
        question: text(
          'How do hidden layers receive a useful learning signal?',
          'Wie erhalten verborgene Schichten ein nützliches Lernsignal?',
          '¿Cómo reciben las capas ocultas una señal útil de aprendizaje?',
        ),
        takeaway: text(
          'The chain rule distributes error gradients through a composed network; this is not a claim that brains use the same mechanism.',
          'Die Kettenregel verteilt Fehlergradienten durch ein zusammengesetztes Netz; das behauptet keinen identischen Mechanismus im Gehirn.',
          'La regla de la cadena distribuye gradientes por una red compuesta; no implica que el cerebro use el mismo mecanismo.',
        ),
      },
    ],
  },
  {
    id: 'rules-and-learning',
    title: text('Rules versus learning', 'Regeln und Lernen', 'Reglas frente a aprendizaje'),
    outcome: text(
      'Compare knowledge written as rules with representations learned from examples, and explain why the approaches can coexist.',
      'Regelwissen mit aus Beispielen gelernten Repräsentationen vergleichen und ihr mögliches Zusammenspiel erklären.',
      'Comparar conocimiento escrito como reglas con representaciones aprendidas de ejemplos y explicar su convivencia.',
    ),
    stops: [
      {
        entityId: 'mcculloch-pitts',
        question: text(
          'How can a network implement logic?',
          'Wie kann ein Netz Logik umsetzen?',
          '¿Cómo puede una red implementar lógica?',
        ),
        takeaway: text(
          'Networks and logical computation are not mutually exclusive categories.',
          'Netze und logisches Rechnen schließen sich nicht aus.',
          'Las redes y el cálculo lógico no son categorías incompatibles.',
        ),
      },
      {
        entityId: 'logic-theorist',
        question: text(
          'Why is a useful search strategy needed even with explicit rules?',
          'Warum braucht man auch bei expliziten Regeln eine gute Suchstrategie?',
          '¿Por qué hacen falta estrategias de búsqueda incluso con reglas explícitas?',
        ),
        takeaway: text(
          'Knowing valid operations is different from efficiently choosing which operation to try.',
          'Gültige Operationen zu kennen ist etwas anderes, als effizient die nächste auszuwählen.',
          'Conocer operaciones válidas no equivale a elegir eficientemente cuál probar.',
        ),
      },
      {
        entityId: 'expert-systems',
        question: text(
          'Who supplies the knowledge, and who maintains it?',
          'Wer liefert das Wissen, und wer pflegt es?',
          '¿Quién aporta el conocimiento y quién lo mantiene?',
        ),
        takeaway: text(
          'Handwritten rules can be useful, but knowledge acquisition and maintenance are part of the cost.',
          'Manuelle Regeln können nützlich sein; Wissenserhebung und Wartung gehören zu ihren Kosten.',
          'Las reglas manuales pueden ser útiles, pero adquirirlas y mantenerlas tiene un coste.',
        ),
      },
      {
        entityId: 'backpropagation',
        question: text(
          'What changes when parameters are fitted from examples?',
          'Was ändert sich, wenn Parameter aus Beispielen angepasst werden?',
          '¿Qué cambia al ajustar parámetros a partir de ejemplos?',
        ),
        takeaway: text(
          'Learning reduces some manual specification but introduces dependence on data, objectives and generalization.',
          'Lernen reduziert manche manuelle Festlegung, schafft aber Abhängigkeiten von Daten, Zielen und Generalisierung.',
          'Aprender reduce parte de la especificación manual, pero introduce dependencias de datos, objetivos y generalización.',
        ),
      },
      {
        entityId: 'neuroai',
        question: text(
          'What would count as evidence for a useful connection between brains and models?',
          'Was wäre ein Beleg für eine nützliche Verbindung zwischen Gehirnen und Modellen?',
          '¿Qué sería evidencia de una conexión útil entre cerebros y modelos?',
        ),
        takeaway: text(
          'A shared task or mathematical resemblance is a starting point for investigation, not proof of an identical mechanism.',
          'Eine gemeinsame Aufgabe oder mathematische Ähnlichkeit beginnt eine Untersuchung, beweist aber keinen identischen Mechanismus.',
          'Compartir una tarea o una semejanza matemática inicia una investigación, no prueba un mecanismo idéntico.',
        ),
      },
    ],
  },
  {
    id: 'demonstrations-to-deployment',
    title: text(
      'Why demonstrations fail to scale',
      'Warum Demonstrationen nicht skalieren',
      'Por qué las demostraciones no escalan',
    ),
    outcome: text(
      'Separate representational limits, search complexity, maintenance costs and public expectations.',
      'Darstellungsgrenzen, Suchkomplexität, Wartungskosten und öffentliche Erwartungen unterscheiden.',
      'Distinguir límites de representación, complejidad de búsqueda, costes de mantenimiento y expectativas.',
    ),
    stops: [
      {
        entityId: 'perceptron',
        question: text(
          'Is a failed task a training problem or a limitation of the model?',
          'Ist ein Fehlschlag ein Trainingsproblem oder eine Modellgrenze?',
          '¿Un fallo se debe al entrenamiento o a una limitación del modelo?',
        ),
        takeaway: text(
          'More training does not make a linear decision boundary represent every pattern.',
          'Mehr Training lässt eine lineare Entscheidungsgrenze nicht jedes Muster darstellen.',
          'Más entrenamiento no permite a una frontera lineal representar cualquier patrón.',
        ),
      },
      {
        entityId: 'logic-theorist',
        question: text(
          'What happens as the number of possible search paths grows?',
          'Was passiert, wenn die Zahl möglicher Suchpfade wächst?',
          '¿Qué ocurre al crecer el número de caminos de búsqueda?',
        ),
        takeaway: text(
          'A method that succeeds on a small problem may need much better search strategies for a larger one.',
          'Eine Methode für kleine Probleme braucht bei größeren oft wesentlich bessere Suchstrategien.',
          'Un método eficaz en un problema pequeño puede necesitar mejores estrategias para uno grande.',
        ),
      },
      {
        entityId: 'ai-winters',
        question: text(
          'Which events changed confidence, and which technical problems were already present?',
          'Welche Ereignisse veränderten das Vertrauen, und welche technischen Probleme bestanden schon?',
          '¿Qué hechos cambiaron la confianza y qué problemas técnicos ya existían?',
        ),
        takeaway: text(
          'The two winters combine different technical, political and commercial pressures. Their boundaries are disputed.',
          'Die beiden Winter verbinden unterschiedliche technische, politische und kommerzielle Kräfte. Ihre Grenzen sind umstritten.',
          'Los dos inviernos combinan presiones técnicas, políticas y comerciales distintas. Sus límites son debatidos.',
        ),
      },
      {
        entityId: 'imagenet',
        question: text(
          'What does a benchmark measure, and what falls outside it?',
          'Was misst ein Benchmark, und was liegt außerhalb davon?',
          '¿Qué mide un benchmark y qué queda fuera?',
        ),
        takeaway: text(
          'A benchmark makes progress comparable within a task definition; it does not establish general reliability.',
          'Ein Benchmark macht Fortschritt innerhalb einer Aufgabe vergleichbar, belegt aber keine allgemeine Zuverlässigkeit.',
          'Un benchmark permite comparar avances en una tarea definida, no demuestra fiabilidad general.',
        ),
      },
      {
        entityId: 'foundation-models',
        question: text(
          'How would you test whether broad promises survive real deployment?',
          'Wie prüft man, ob breite Versprechen dem realen Einsatz standhalten?',
          '¿Cómo comprobarías si las promesas amplias resisten el uso real?',
        ),
        takeaway: text(
          'Ask about task coverage, failure cases, evaluation data, operating costs and the evidence behind each claim.',
          'Frage nach Aufgabenabdeckung, Fehlerfällen, Evaluationsdaten, Betriebskosten und Belegen für jede Behauptung.',
          'Pregunta por tareas cubiertas, fallos, datos de evaluación, costes operativos y evidencia para cada afirmación.',
        ),
      },
    ],
  },
];
export const learningCopy = {
  title: text('Guided learning journeys', 'Geführte Lernwege', 'Recorridos de aprendizaje'),
  intro: text(
    'Choose a question and follow five discoveries. These are teaching sequences, not claims of direct historical influence.',
    'Wähle eine Frage und erkunde fünf Entdeckungen. Dies sind didaktische Folgen, keine Behauptungen direkter historischer Einflüsse.',
    'Elige una pregunta y recorre cinco descubrimientos. Son secuencias didácticas, no afirmaciones de influencia histórica directa.',
  ),
  start: text('Start journey', 'Lernweg starten', 'Iniciar recorrido'),
  previous: text('Previous stop', 'Vorherige Station', 'Parada anterior'),
  next: text('Next stop', 'Nächste Station', 'Siguiente parada'),
  exit: text('Leave journey', 'Lernweg verlassen', 'Salir del recorrido'),
  question: text('Think about it', 'Zum Nachdenken', 'Para reflexionar'),
  answer: text('Compare your explanation', 'Erklärung vergleichen', 'Compara tu explicación'),
  outcome: text('Learning outcome', 'Lernziel', 'Objetivo de aprendizaje'),
  progress: text('Journey progress', 'Fortschritt im Lernweg', 'Progreso del recorrido'),
  finish: text('Finish and reflect', 'Abschließen und reflektieren', 'Terminar y reflexionar'),
  complete: text(
    'You reached the final stop. Can you explain the learning outcome in your own words?',
    'Du hast die letzte Station erreicht. Kannst du das Lernziel in eigenen Worten erklären?',
    'Has llegado a la última parada. ¿Puedes explicar el objetivo con tus propias palabras?',
  ),
  detour: text(
    'You are exploring beyond this journey.',
    'Du erkundest außerhalb dieses Lernwegs.',
    'Estás explorando fuera de este recorrido.',
  ),
  resume: text('Return to current stop', 'Zur aktuellen Station', 'Volver a la parada actual'),
  winter: text(
    'Explore the winter guide and search demo',
    'Wintererklärung und Suchdemo erkunden',
    'Explorar la guía de los inviernos y la demo de búsqueda',
  ),
};
