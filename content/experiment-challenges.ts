import { text } from './translations/ui';
import type { DemoKind, LocalizedText } from '@/types/history';
export interface ExperimentChallenge {
  question: LocalizedText;
  options: LocalizedText[];
  answer: number;
  explanation: LocalizedText;
  experiment: LocalizedText;
}
export const experimentChallenges: Partial<Record<DemoKind, ExperimentChallenge>> = {
  perceptron: {
    question: text(
      'Keep the inputs and weights fixed. What happens to the weighted sum when you increase the bias?',
      'Eingaben und Gewichte bleiben gleich. Was passiert mit der gewichteten Summe, wenn du den Bias erhöhst?',
      'Mantén fijas las entradas y los pesos. ¿Qué pasa con la suma ponderada al aumentar el sesgo?',
    ),
    options: [
      text('It increases.', 'Sie steigt.', 'Aumenta.'),
      text('It decreases.', 'Sie sinkt.', 'Disminuye.'),
      text('It stays the same.', 'Sie bleibt gleich.', 'No cambia.'),
    ],
    answer: 0,
    explanation: text(
      'The sum is w₁x₁ + w₂x₂ + b. Increasing b increases the sum, but the predicted class changes only if the sum crosses the decision threshold.',
      'Die Summe ist w₁x₁ + w₂x₂ + b. Ein höheres b erhöht die Summe. Die Klasse ändert sich nur beim Überschreiten der Entscheidungsschwelle.',
      'La suma es w₁x₁ + w₂x₂ + b. Aumentar b aumenta la suma, pero la clase solo cambia si se cruza el umbral de decisión.',
    ),
    experiment: text(
      'Reset the lab. Move only the bias from −1 to 1. Watch the sum, the boundary, and the class. Which changes continuously?',
      'Setze das Labor zurück. Ändere nur den Bias von −1 auf 1. Beobachte Summe, Grenze und Klasse. Was ändert sich kontinuierlich?',
      'Reinicia el laboratorio. Cambia solo el sesgo de −1 a 1. Observa la suma, la frontera y la clase. ¿Qué cambia continuamente?',
    ),
  },
  convolution: {
    question: text(
      'A filter responds strongly to a vertical line. Must it respond equally strongly to a horizontal line?',
      'Ein Filter reagiert stark auf eine vertikale Linie. Muss er ebenso stark auf eine horizontale Linie reagieren?',
      'Un filtro responde intensamente a una línea vertical. ¿Debe responder igual a una línea horizontal?',
    ),
    options: [
      text(
        'Yes, all lines are equivalent.',
        'Ja, alle Linien sind gleichwertig.',
        'Sí, todas las líneas son equivalentes.',
      ),
      text(
        'No, the arrangement of weights matters.',
        'Nein, die Anordnung der Gewichte zählt.',
        'No, importa la distribución de los pesos.',
      ),
    ],
    answer: 1,
    explanation: text(
      'The output sums products of image values and filter weights. Changing their alignment changes that sum. A large response is a match to this filter, not recognition of an object.',
      'Die Ausgabe summiert Produkte aus Bildwerten und Filtergewichten. Ihre Ausrichtung beeinflusst die Summe. Eine starke Antwort bedeutet eine Übereinstimmung mit diesem Filter, keine Objekterkennung.',
      'La salida suma productos de valores de imagen y pesos del filtro. Su alineación cambia la suma. Una respuesta alta indica coincidencia con el filtro, no reconocimiento de un objeto.',
    ),
    experiment: text(
      'Keep the image fixed and compare the horizontal and vertical filters. Inspect the numerical output as well as the color.',
      'Lass das Bild unverändert und vergleiche horizontale und vertikale Filter. Prüfe Zahlenwerte und Farben.',
      'Mantén fija la imagen y compara los filtros horizontal y vertical. Examina los valores numéricos además del color.',
    ),
  },
  backpropagation: {
    question: text(
      'If the input x is zero in this bias-free toy network, can changing either weight change its prediction?',
      'Kann bei Eingabe x = 0 in diesem Spielzeugnetz ohne Bias eine Gewichtsänderung die Vorhersage ändern?',
      'Si la entrada x es cero en esta red simplificada sin sesgos, ¿puede cambiar la predicción al cambiar un peso?',
    ),
    options: [
      text(
        'Yes, a larger learning rate always helps.',
        'Ja, eine höhere Lernrate hilft immer.',
        'Sí, una tasa de aprendizaje mayor siempre ayuda.',
      ),
      text(
        'No, its prediction stays zero.',
        'Nein, ihre Vorhersage bleibt null.',
        'No, su predicción sigue siendo cero.',
      ),
    ],
    answer: 1,
    explanation: text(
      'Here h = tanh(w₁x) and ŷ = w₂h. With x = 0, h and ŷ are zero, and both weight gradients vanish. This is a property of this small bias-free model, not all networks.',
      'Hier gilt h = tanh(w₁x) und ŷ = w₂h. Bei x = 0 sind h, ŷ und beide Gewichtsgradienten null. Das gilt für dieses kleine Modell ohne Bias, nicht für alle Netze.',
      'Aquí h = tanh(w₁x) e ŷ = w₂h. Con x = 0, h, ŷ y ambos gradientes son cero. Es una propiedad de este modelo sin sesgos, no de todas las redes.',
    ),
    experiment: text(
      'Reset, set x to zero, and take a training step. Then change x to 1 and try again. Compare the gradients and loss.',
      'Zurücksetzen, x auf null setzen und einen Trainingsschritt ausführen. Dann x auf 1 setzen und wiederholen. Vergleiche Gradienten und Verlust.',
      'Reinicia, pon x en cero y ejecuta un paso de entrenamiento. Después cambia x a 1 y repite. Compara los gradientes y la pérdida.',
    ),
  },
  attention: {
    question: text(
      'If all three attention scores are equal, how is the weight distributed?',
      'Wie verteilt sich das Gewicht, wenn alle drei Aufmerksamkeitswerte gleich sind?',
      'Si las tres puntuaciones de atención son iguales, ¿cómo se distribuye el peso?',
    ),
    options: [
      text(
        'The first item gets all the weight.',
        'Das erste Element erhält alles.',
        'El primer elemento recibe todo el peso.',
      ),
      text(
        'Each item gets one third.',
        'Jedes Element erhält ein Drittel.',
        'Cada elemento recibe un tercio.',
      ),
      text('All weights are zero.', 'Alle Gewichte sind null.', 'Todos los pesos son cero.'),
    ],
    answer: 1,
    explanation: text(
      'Softmax normalizes equal scores into equal positive weights that sum to one. With values 1, 0, and −1, their equally weighted mixture is zero.',
      'Softmax wandelt gleiche Werte in gleiche positive Gewichte mit Summe eins um. Bei Werten 1, 0 und −1 ist die gleich gewichtete Mischung null.',
      'Softmax normaliza puntuaciones iguales en pesos positivos iguales que suman uno. Con valores 1, 0 y −1, la mezcla con pesos iguales es cero.',
    ),
    experiment: text(
      'Set A, B, and C to zero. Then raise only B. Compare its weight with the mixture: B has value zero, so more attention need not mean a larger output.',
      'Setze A, B und C auf null. Erhöhe dann nur B. Vergleiche sein Gewicht mit der Mischung: B hat den Wert null, mehr Aufmerksamkeit bedeutet also nicht unbedingt eine größere Ausgabe.',
      'Pon A, B y C en cero. Luego aumenta solo B. Compara su peso con la mezcla: B tiene valor cero, así que más atención no implica una salida mayor.',
    ),
  },
  entropy: {
    question: text(
      'For a binary outcome, which probability gives the greatest uncertainty?',
      'Welche Wahrscheinlichkeit erzeugt bei einem binären Ergebnis die größte Unsicherheit?',
      'Para un resultado binario, ¿qué probabilidad produce la mayor incertidumbre?',
    ),
    options: [
      text('p = 0', 'p = 0', 'p = 0'),
      text('p = 0.5', 'p = 0,5', 'p = 0,5'),
      text('p = 1', 'p = 1', 'p = 1'),
    ],
    answer: 1,
    explanation: text(
      'Equally likely binary outcomes have entropy of one bit. At either endpoint the outcome is certain and entropy is zero. Entropy describes uncertainty in this distribution, not meaning.',
      'Gleich wahrscheinliche binäre Ergebnisse haben ein Bit Entropie. An den Endpunkten ist das Ergebnis sicher und die Entropie null. Entropie beschreibt hier Unsicherheit, nicht Bedeutung.',
      'Los resultados binarios equiprobables tienen un bit de entropía. En los extremos el resultado es seguro y la entropía es cero. La entropía describe incertidumbre, no significado.',
    ),
    experiment: text(
      'Compare p = 0.1 and p = 0.9, then try p = 0.5. Why do the first two settings have the same entropy?',
      'Vergleiche p = 0,1 und p = 0,9, dann p = 0,5. Warum haben die ersten beiden Einstellungen dieselbe Entropie?',
      'Compara p = 0,1 y p = 0,9, después p = 0,5. ¿Por qué los dos primeros ajustes tienen la misma entropía?',
    ),
  },
};
