# Implementation Prompt
## Build an Interactive Multilingual History of Intelligence, Neuroscience, AI and NeuroAI

You are responsible for designing and implementing a production-ready interactive web application that teaches the history of the scientific study of intelligence, from late nineteenth-century neuroscience to modern NeuroAI.

The project must be conceived from the beginning as a combination of:

- interactive historical storytelling;
- scientific knowledge graph;
- geospatial exploration;
- timeline visualization;
- scholarly reference system;
- educational simulation platform;
- multilingual public-science website.

The final product should be understandable and engaging for a general audience while remaining scientifically rigorous and sufficiently deep to interest researchers in neuroscience, cognitive science, psychology, artificial intelligence, machine learning, computational neuroscience and computer science.

The project must support **English, German and Spanish from the first commit**.

---

# 1. Core Product Objective

Build an interactive website that explains how the scientific study of biological intelligence and the development of artificial intelligence have repeatedly influenced one another.

The central conceptual message is:

> Neuroscience and artificial intelligence do not have independent histories. They are two recurring attempts to understand and construct intelligent systems, and their ideas have repeatedly intersected, diverged and converged again.

The site should show how:

- biological discoveries inspired mathematical abstractions;
- mathematical abstractions became computational architectures;
- computational systems inspired new theories of cognition and neuroscience;
- new datasets, hardware and software enabled previously impractical ideas;
- contemporary NeuroAI reconnects neuroscience and artificial intelligence.

The product must not be built as a simple chronological article or static timeline.

The main product experience must combine:

1. **time**;
2. **geography**;
3. **people**;
4. **ideas**;
5. **scientific influence**;
6. **primary sources**;
7. **interactive demonstrations**.

---

# 2. Main Conceptual Architecture

The website must be organized around three tightly integrated interaction layers.

## Layer A — Historical Timeline

A zoomable timeline from approximately 1870 to the present.

Users should be able to explore history at multiple temporal scales:

- decades;
- years;
- individual events.

The timeline must support filtering by domain:

- neuroscience;
- psychology;
- cognitive science;
- artificial intelligence;
- mathematics;
- computer science;
- cybernetics;
- robotics;
- hardware;
- datasets;
- machine learning;
- NeuroAI.

The timeline is not the primary data model.

It is one visualization of an underlying historical knowledge graph.

---

## Layer B — Interactive Geographic Map

The world map must show where discoveries, institutions, experiments and scientific communities emerged.

The map should not merely place static historical pins.

It must represent the **movement of people and ideas through geography and time**.

Examples:

- Santiago Ramón y Cajal moving through Spanish institutions;
- Alan Turing between Cambridge, Bletchley Park, Princeton and Manchester;
- Norbert Wiener at MIT;
- John von Neumann at Princeton;
- early AI research around Dartmouth, MIT, Carnegie Mellon and Stanford;
- Kunihiko Fukushima in Japan;
- Geoffrey Hinton across the UK, United States and Canada;
- Yann LeCun across France and the United States;
- ImageNet at Stanford;
- DeepMind in London.

Support animated or progressive geographic transitions where appropriate.

When the timeline changes, the map should update.

When the user selects a person, idea, publication or institution, the map should highlight all related locations.

Allow the user to trace:

- where an idea originated;
- where it was developed;
- where collaborators worked;
- how a research tradition moved between laboratories or countries.

---

## Layer C — Historical Knowledge Graph

This is the conceptual core of the application.

Users must be able to explore the history of intelligence not only chronologically, but also by following conceptual relationships.

For example:

Golgi staining  
→ Cajal  
→ neuron doctrine  
→ discrete cellular models of nervous systems  
→ McCulloch & Pitts  
→ artificial units  
→ perceptrons  
→ artificial neural networks  
→ deep learning

Another possible path:

Hubel & Wiesel  
→ receptive fields  
→ hierarchical visual processing  
→ Fukushima  
→ Neocognitron  
→ convolutional architectures  
→ LeNet  
→ ImageNet  
→ AlexNet

Another:

Hebbian learning  
→ associative learning  
→ Hopfield networks  
→ distributed representations  
→ connectionism  
→ modern neural networks

The graph must allow bidirectional exploration.

Every node should expose:

- What influenced this?
- What did this influence?
- Which people were involved?
- Which institutions were involved?
- Which publications document the idea?
- Which technologies enabled it?
- Which related concepts emerged later?

The graph must explicitly distinguish types of relationships.

Suggested edge types:

- DIRECTLY_INSPIRED
- CONCEPTUALLY_INFLUENCED
- MATHEMATICALLY_FORMALIZED
- EXTENDED
- IMPLEMENTED
- CHALLENGED
- REINTERPRETED
- BIOLOGICALLY_INSPIRED
- ENABLED_BY_HARDWARE
- ENABLED_BY_DATASET
- ENABLED_BY_SOFTWARE
- COLLABORATED_WITH
- STUDIED_UNDER
- WORKED_AT
- PUBLISHED_WITH
- BUILT_ON
- PARALLEL_DEVELOPMENT
- HISTORICALLY_ASSOCIATED

Do not collapse all relationships into generic arrows.

The UI should explain the meaning of every connection.

---

# 3. Primary UX Modes

Implement at least three navigation modes.

## 3.1 Story Mode

A curated narrative for first-time users.

This mode should feel like an interactive scientific documentary.

Provide:

- guided transitions;
- explanatory text;
- animated movement across map, timeline and graph;
- progressively introduced concepts;
- carefully sequenced historical episodes.

Story Mode should prioritize clarity and narrative flow.

---

## 3.2 Explore Mode

Allow users to freely explore the historical knowledge graph.

Users should be able to select:

- Person
- Concept
- Publication
- Experiment
- Dataset
- Institution
- Architecture
- Discovery
- Algorithm
- Technology
- Nobel Prize
- Scientific field

Support free navigation through graph relationships.

This mode should prioritize discovery and expert-level exploration.

---

## 3.3 Compare / Trace Mode

Allow the user to choose a modern concept and trace its historical ancestry.

Examples:

- attention;
- memory;
- convolution;
- reinforcement learning;
- predictive coding;
- artificial neural networks;
- representation;
- self-supervised learning;
- transformers;
- generative models.

The application should generate an interactive historical pathway.

Example:

Convolution  
← CNN  
← Neocognitron  
← hierarchical visual processing  
← Hubel & Wiesel  
← receptive fields

Also allow forward tracing.

Example:

Hebbian learning  
→ associative memory  
→ Hopfield networks  
→ energy-based models  
→ modern representation learning

This feature should become a defining part of the application.

---

# 4. Audience Model

Design the application simultaneously for:

## General users

Use:

- concise explanations;
- animations;
- diagrams;
- interactive demonstrations;
- progressive disclosure;
- intuitive navigation;
- minimal jargon.

## Expert users

Expose deeper layers with:

- technical explanations;
- equations;
- original papers;
- historical controversies;
- scholarly references;
- mathematical details;
- model architectures;
- primary-source excerpts;
- review articles.

Follow the principle:

> Simple on the surface, deep underneath.

Every major concept should support three depth levels:

### Level 1 — Why it matters
50–100 words.

### Level 2 — Understand the idea
300–700 words plus diagrams or simulations.

### Level 3 — Go deeper
Technical material, references and original sources.

---

# 5. Theme System

The UX must support:

- Light theme
- Dark theme
- System theme

System theme should follow the user's operating system preference via `prefers-color-scheme`.

Requirements:

- persist manual user selection;
- fall back to system preference;
- avoid flash of incorrect theme on page load;
- support theme-aware maps;
- support theme-aware diagrams;
- support theme-aware graph nodes and edges;
- maintain accessibility and contrast in all themes;
- use semantic design tokens instead of hard-coded colors.

Theme options should be globally accessible from the navigation.

Recommended architecture:

- CSS custom properties;
- design tokens;
- semantic color system;
- a theme provider;
- server-safe initialization;
- local storage persistence.

Do not maintain separate CSS files for light and dark mode.

Use token-based theming.

---

# 6. Multilingual Architecture

The project must be designed from the first commit for:

- English
- German
- Spanish

English should act as the canonical source language.

Do not hard-code translatable text inside React components.

All UI and content must use structured localization.

Example entity:

```ts
{
  title: {
    en: "Neuron doctrine",
    de: "Neuronenlehre",
    es: "Doctrina neuronal"
  }
}
```

Maintain current navigation state when changing language.

Do not reset:

- map position;
- selected historical node;
- timeline position;
- active filters;
- graph state.

Translate:

- navigation;
- tooltips;
- descriptions;
- explanatory text;
- alt text;
- captions;
- interaction labels;
- empty states;
- error messages.

Preserve publication titles in their original language where historically appropriate.

---

# 7. Historical Content Scope

The initial historical structure should contain the following major eras.

## Era 1 — Seeing the Nervous System

Topics:

- Camillo Golgi;
- Golgi staining;
- Santiago Ramón y Cajal;
- neuron doctrine;
- neuronal morphology;
- dendrites;
- axons;
- Charles Sherrington;
- synapse.

Include:

- original drawings;
- historical microscopy where licensing allows;
- 1906 Nobel Prize context.

---

## Era 2 — Nervous Systems Become Quantifiable

Include:

- electrophysiology;
- Edgar Adrian;
- Hodgkin and Huxley;
- action potentials;
- Donald Hebb;
- Hebbian learning.

---

## Era 3 — From Biological Neurons to Mathematical Units

Include:

- Warren McCulloch;
- Walter Pitts;
- 1943 computational model;
- logical units;
- threshold systems;
- mathematical abstraction of biological neural computation.

Terminology requirement:

Use:

- neuron for biological cells;
- unit, node or artificial unit for artificial systems.

Avoid casually calling artificial units neurons.

---

## Era 4 — Computation, Information and Cybernetics

Include:

- Alan Turing;
- universal computation;
- machine intelligence;
- John von Neumann;
- stored-program architecture;
- Claude Shannon;
- information theory;
- Norbert Wiener;
- cybernetics;
- feedback systems;
- W. Ross Ashby;
- early autonomous machines.

---

## Era 5 — Artificial Intelligence Becomes a Field

Highlight the 1956 Dartmouth Summer Research Project on Artificial Intelligence.

Include:

- John McCarthy;
- Marvin Minsky;
- Claude Shannon;
- Nathaniel Rochester;
- Allen Newell;
- Herbert Simon.

Link to the original Dartmouth proposal.

---

## Era 6 — Perceptrons

Include:

- Frank Rosenblatt;
- Mark I Perceptron;
- supervised learning;
- linear separability;
- hardware implementations;
- ADALINE;
- Widrow–Hoff learning.

Interactive demo required.

---

## Era 7 — Symbolic AI and Connectionism

Explain:

- symbolic AI;
- connectionist AI;
- expert systems;
- Logic Theorist;
- General Problem Solver;
- SHRDLU;
- MYCIN.

Do not frame one paradigm as obviously superior in hindsight.

---

## Era 8 — Limits, Funding Cycles and AI Winters

Discuss:

- Minsky and Papert;
- Perceptrons;
- computational limitations;
- funding decisions;
- expert-system limitations;
- hardware bottlenecks;
- Lisp-machine collapse;
- first AI winter;
- second AI winter.

Avoid simplistic causal narratives.

---

## Era 9 — Visual Neuroscience Meets Computer Vision

Include:

- receptive fields;
- Hubel and Wiesel;
- simple cells;
- complex cells;
- orientation selectivity;
- hierarchical visual processing;
- Nobel Prize 1981;
- Fukushima;
- Neocognitron;
- convolution;
- hierarchical feature extraction.

Required interactive comparison:

biological receptive field  
↔ computational convolution filter

Explicitly explain that similarity does not imply biological equivalence.

---

## Era 10 — Connectionist Revival

Include:

- John Hopfield;
- Hopfield networks;
- Rumelhart;
- Hinton;
- Williams;
- backpropagation;
- distributed representations;
- Boltzmann machines.

Interactive backpropagation demo required.

---

## Era 11 — CNNs and Handwriting

Include:

- Yann LeCun;
- handwritten digit recognition;
- MNIST;
- LeNet;
- convolution;
- weight sharing.

Interactive digit classifier recommended.

---

## Era 12 — Data as Infrastructure

Include:

- large-scale datasets;
- WordNet;
- Fei-Fei Li;
- ImageNet;
- Amazon Mechanical Turk;
- ImageNet Large Scale Visual Recognition Challenge.

Explain the role of:

- data;
- annotation;
- compute;
- software;
- benchmarks.

---

## Era 13 — AlexNet

Include:

- Alex Krizhevsky;
- Ilya Sutskever;
- Geoffrey Hinton;
- ImageNet 2012;
- GPUs;
- ReLU;
- dropout;
- convolutional networks.

Frame AlexNet as a convergence of:

old ideas + large datasets + hardware + implementation.

---

## Era 14 — Reinforcement Learning

Include:

- Thorndike where relevant;
- behavioral learning;
- reward;
- Richard Bellman;
- dynamic programming;
- temporal-difference learning;
- Sutton;
- Barto;
- Q-learning;
- reward prediction error;
- dopamine research;
- DQN;
- Atari;
- AlphaGo;
- AlphaZero.

Interactive RL environment recommended.

---

## Era 15 — Representation Learning

Include:

- autoencoders;
- generative models;
- contrastive learning;
- predictive learning;
- self-supervised learning;
- masked prediction.

Connect carefully to:

- efficient coding;
- predictive coding;
- sensory prediction.

Clearly label historical influence versus conceptual similarity.

---

## Era 16 — Attention and Transformers

Include:

- early attention mechanisms;
- Attention Is All You Need;
- transformers;
- multimodal systems;
- foundation models.

Explicitly distinguish:

machine-learning attention  
versus  
psychological/neuroscientific attention.

---

## Era 17 — NeuroAI

Frame NeuroAI as the renewed convergence between neuroscience and artificial intelligence.

Cover:

### Neuroscience → AI
- recurrence;
- predictive computation;
- sparse computation;
- continual learning;
- memory;
- embodiment;
- neuromorphic computing;
- energy efficiency.

### AI → Neuroscience
- encoding models;
- representational similarity analysis;
- visual models;
- language models;
- neural predictivity;
- computational models of navigation.

### Shared principles
- representation;
- prediction;
- memory;
- learning;
- attention;
- embodiment;
- planning.

End with open scientific questions rather than a definitive conclusion.

---

# 8. Nobel Prize Layer

Implement an optional map/timeline overlay for Nobel Prizes relevant to the history.

Examples:

- Golgi and Ramón y Cajal — 1906;
- Hubel and Wiesel — 1981;
- Hopfield and Hinton — Physics 2024;
- David Baker, Demis Hassabis and John Jumper — Chemistry 2024.

Nobel awards are historical landmarks, not proxies for scientific importance.

The layer should be toggleable.

---

# 9. Data Model

Define a strongly typed core schema.

Suggested entity model:

```ts
type EntityType =
  | "person"
  | "concept"
  | "publication"
  | "experiment"
  | "institution"
  | "location"
  | "dataset"
  | "algorithm"
  | "architecture"
  | "technology"
  | "event"
  | "field"
  | "award";
```

Suggested base structure:

```ts
interface HistoricalEntity {
  id: string;
  slug: string;
  type: EntityType;

  title: LocalizedText;
  shortDescription: LocalizedText;
  longDescription?: LocalizedText;

  startDate?: string;
  endDate?: string;

  locations?: LocationReference[];

  people?: string[];
  institutions?: string[];

  references: Reference[];

  media?: MediaAsset[];

  tags: string[];

  status:
    | "verified"
    | "needs-review"
    | "historically-disputed";

  createdAt: string;
  updatedAt: string;
}
```

Relationships:

```ts
interface HistoricalRelationship {
  id: string;

  source: string;
  target: string;

  type: RelationshipType;

  description: LocalizedText;

  evidence: Reference[];

  confidence:
    | "high"
    | "medium"
    | "low";

  disputed?: boolean;
}
```

---

# 10. Reference Model

Every significant historical claim should be traceable.

Reference priority:

1. original scientific publication;
2. original historical document;
3. Nobel documentation;
4. institutional archive;
5. peer-reviewed review;
6. authoritative scholarly history;
7. reputable scientific organization.

Suggested schema:

```ts
interface Reference {
  id: string;
  type:
    | "paper"
    | "book"
    | "archive"
    | "website"
    | "nobel"
    | "review";

  title: string;
  authors?: string[];
  year?: number;
  doi?: string;
  url?: string;
  publisher?: string;

  notes?: string;
}
```

---

# 11. Content Verification Model

Every claim must be explicitly traceable to evidence.

Add editorial fields:

```ts
interface Claim {
  id: string;
  entityId: string;

  claim: LocalizedText;

  references: string[];

  status:
    | "verified"
    | "needs-review"
    | "disputed";

  editorialNotes?: string;
}
```

Do not allow unsourced factual claims to silently enter production content.

---

# 12. Frontend Architecture

Recommended baseline:

- Next.js;
- TypeScript;
- React;
- App Router;
- React Server Components where appropriate;
- client components only for interactions requiring browser state;
- strict TypeScript mode.

Use modern stable releases.

Avoid unnecessary complexity.

---

# 13. Suggested Libraries

Evaluate rather than blindly install.

Potential choices:

### Data visualization
- D3;
- VisX;
- Cytoscape.js;
- Sigma.js.

### Map
Prefer:
- MapLibre GL

Mapbox is acceptable if external API dependencies and cost are justified.

### Animation
- Framer Motion.

### State
Prefer lightweight state management.

Candidates:
- Zustand;
- React context where sufficient.

### UI
Build reusable components.

Tailwind CSS is acceptable.

Prefer semantic design tokens.

---

# 14. Knowledge Graph Visualization

Implement an interactive graph viewer.

Required capabilities:

- pan;
- zoom;
- drag;
- node selection;
- edge highlighting;
- semantic edge types;
- filtering;
- neighbor expansion;
- focus mode;
- search.

When selecting a node:

Highlight:

- direct predecessors;
- direct successors;
- collaborators;
- related institutions;
- related publications.

Allow users to choose:

- one-hop;
- two-hop;
- complete historical path.

Avoid rendering the entire graph simultaneously if it harms usability.

Use progressive graph expansion.

---

# 15. Timeline Implementation

Implement synchronized timeline navigation.

Required:

- zoom;
- pan;
- decade labels;
- year-level zoom;
- dynamic clustering;
- domain filters;
- event density management.

Timeline selection must synchronize:

- map;
- graph;
- content panel.

---

# 16. Map Synchronization

The map must react to historical context.

Example:

When selecting 1956:

- center on Dartmouth;
- show relevant institutions;
- show related researchers;
- visually connect prior locations such as MIT or Princeton where relevant.

When selecting Geoffrey Hinton:

show a temporal path through relevant institutions and locations.

Map animations must be optional and respect reduced-motion preferences.

---

# 17. Global Search

Implement full-text search.

Search across:

- people;
- concepts;
- publications;
- institutions;
- datasets;
- technologies.

Example query:

"convolution"

Results should include:

- concept;
- related researchers;
- publications;
- historical events;
- derived architectures.

---

# 18. Interactive Demonstrations

Build modular scientific demos.

Minimum MVP:

1. Perceptron demo
2. Receptive field / convolution comparison
3. Backpropagation demo

Recommended additional modules:

- action potential;
- Hebbian learning;
- Hopfield network;
- digit classifier;
- reinforcement learning environment;
- representation-space explorer;
- attention visualization.

Each demo must include:

- explanation;
- controls;
- reset;
- accessibility support;
- mobile fallback.

---

# 19. Media System

Media assets must contain provenance.

```ts
interface MediaAsset {
  id: string;

  type:
    | "image"
    | "video"
    | "audio"
    | "diagram";

  src: string;

  alt: LocalizedText;
  caption: LocalizedText;

  creator?: string;
  year?: number;

  sourceUrl?: string;

  license:
    | "public-domain"
    | "cc0"
    | "cc-by"
    | "cc-by-sa"
    | "fair-use-review"
    | "custom"
    | "unknown";

  attribution?: string;
}
```

Never display media of unknown licensing status by default.

---

# 20. CMS / Editorial Backend

Content must be editable without changing frontend code.

Choose either:

- structured local content for MVP;
- headless CMS;
- database-backed editorial system.

Design the data structures so migration is straightforward.

Editors must be able to:

- add nodes;
- edit descriptions;
- add translations;
- create relationships;
- add references;
- flag disputes;
- add map coordinates;
- attach media.

---

# 21. Suggested Database Architecture

Use PostgreSQL for structured data.

Consider PostgreSQL + graph-compatible relational schema before introducing a dedicated graph database.

Do not add Neo4j unless justified by real query requirements.

Suggested tables:

- entities;
- entity_translations;
- relationships;
- references;
- claims;
- people;
- institutions;
- locations;
- media;
- entity_media;
- entity_references.

Use migrations.

---

# 22. URL Architecture

All major content should have stable deep links.

Examples:

```txt
/en/person/santiago-ramon-y-cajal
/en/concept/neuron-doctrine
/en/event/dartmouth-1956
/en/concept/convolution
/en/trace/convolution
```

German:

```txt
/de/...
```

Spanish:

```txt
/es/...
```

URLs should be shareable and reloadable.

Stateful exploration views should optionally encode:

- selected node;
- timeline range;
- filters.

---

# 23. Responsive Design

Support:

- desktop;
- laptop;
- tablet;
- phone.

On desktop:

map, graph and timeline may coexist.

On mobile:

use progressive disclosure.

Suggested pattern:

- timeline;
- focused content card;
- expandable map;
- expandable graph.

Do not attempt to display a dense desktop graph unchanged on phones.

---

# 24. Accessibility

Target WCAG 2.2 AA.

Required:

- keyboard navigation;
- visible focus states;
- screen-reader labels;
- reduced motion;
- high contrast;
- accessible tooltips;
- semantic HTML;
- aria descriptions where appropriate.

Scientific graphs must have alternative textual descriptions.

---

# 25. Color Management

Implement a disciplined color system.

Do not select colors arbitrarily.

Use perceptually appropriate palettes.

Rules:

- sequential palettes for ordered quantities;
- diverging palettes for meaningful central values;
- categorical palettes for distinct domains;
- circular palettes only for cyclical quantities;
- colorblind-safe defaults;
- do not encode critical meaning using color alone.

The same semantic categories must remain recognizable in both light and dark themes.

---

# 26. Design System

Use design tokens.

Example token categories:

- background;
- surface;
- elevated surface;
- text;
- muted text;
- border;
- accent;
- scientific domain colors;
- success;
- warning;
- disputed claim;
- graph relation types.

Avoid component-specific hard-coded colors.

---

# 27. Interaction Design

Use hover on desktop.

Provide equivalent tap behavior on touch screens.

Examples:

Person hover:

- photo;
- lifespan;
- primary contribution.

Publication hover:

- title;
- year;
- authors;
- significance.

Graph-edge hover:

- relationship type;
- explanation;
- supporting references.

---

# 28. Historical Disagreements

The application must explicitly support contested historical interpretation.

Examples:

- whether a specific paper "caused" an AI winter;
- priority disputes;
- degree of biological inspiration behind architectures;
- retrospective claims of conceptual influence.

Do not silently choose one interpretation.

Show:

- consensus;
- alternate interpretation;
- evidence.

---

# 29. Historical Context Layer

Provide an optional contextual layer.

Events may include:

- industrialization;
- telegraphy;
- World War II;
- Cold War;
- early digital computers;
- transistor;
- semiconductor industry;
- microprocessors;
- internet;
- GPUs;
- cloud computing.

This layer should explain enabling conditions.

---

# 30. Editorial Tone

Avoid:

- hero worship;
- oversimplified "genius inventor" narratives;
- deterministic technological progress;
- claims that AI systems literally replicate brains;
- claims that modern architectures were inevitable.

Highlight:

- collaborations;
- institutions;
- competing theories;
- datasets;
- hardware;
- historical context;
- overlooked contributors.

---

# 31. Performance Requirements

Target excellent Core Web Vitals.

Implement:

- image optimization;
- lazy loading;
- graph virtualization;
- dynamic import;
- route-level code splitting;
- map layer optimization;
- caching.

Avoid unnecessary heavy JavaScript.

---

# 32. SEO and Structured Metadata

Each person, concept and publication page should have:

- canonical URL;
- Open Graph metadata;
- description;
- JSON-LD where appropriate.

Potential structured schemas:

- Person;
- ScholarlyArticle;
- Organization;
- Dataset.

---

# 33. Testing

Use:

- unit tests;
- integration tests;
- end-to-end tests.

At minimum test:

- localization;
- theme switching;
- graph relationship resolution;
- URL routing;
- search;
- map synchronization;
- timeline synchronization;
- reference integrity.

Use Playwright or equivalent for E2E testing.

---

# 34. Content Integrity Tests

Add automated validation scripts.

Validation examples:

- every entity has a title in all three languages;
- every entity has at least one reference;
- every relationship points to valid entities;
- every image has alt text;
- every historical event has a date or documented date range;
- every location has coordinates;
- no orphan nodes;
- no broken DOI;
- no duplicate identifiers.

---

# 35. Repository Structure

Suggested initial structure:

```txt
/app
  /[locale]
    /page.tsx
    /person/[slug]
    /concept/[slug]
    /event/[slug]
    /trace/[slug]

/components
  /graph
  /timeline
  /map
  /content
  /navigation
  /theme
  /interactive
  /ui

/content
  /entities
  /relationships
  /references
  /translations

/lib
  /graph
  /timeline
  /map
  /search
  /i18n
  /references

/types

/public
  /images
  /diagrams

/tests

/scripts
```

---

# 36. Development Philosophy

Prefer:

- strongly typed structures;
- modular components;
- reusable content;
- explicit domain models;
- progressively enhanced interactions.

Avoid:

- enormous single-page components;
- hard-coded historical data inside JSX;
- duplicate content;
- tight coupling between content and visualization;
- premature microservices;
- unnecessary backend complexity.

---

# 37. MVP Definition

Build a coherent MVP before expanding the historical corpus.

The MVP should contain approximately 30–40 nodes across the complete timeline.

Include at least:

- Golgi;
- Ramón y Cajal;
- neuron doctrine;
- Hebb;
- McCulloch & Pitts;
- Turing;
- von Neumann;
- Shannon;
- Wiener;
- Dartmouth;
- Rosenblatt;
- Hubel & Wiesel;
- Minsky & Papert;
- Fukushima;
- Hopfield;
- backpropagation;
- LeCun;
- MNIST;
- reinforcement learning;
- ImageNet;
- AlexNet;
- Deep Q Networks;
- transformers;
- AlphaFold;
- modern NeuroAI.

The MVP must already support:

- map;
- timeline;
- graph;
- deep links;
- English/German/Spanish;
- light/dark/system theme;
- references;
- at least three interactive demos.

---

# 38. First Implementation Milestone

Build the architectural skeleton first.

Deliver:

1. locale routing;
2. theme system;
3. typed entity model;
4. historical sample dataset;
5. graph visualization;
6. map visualization;
7. timeline;
8. synchronization across all three;
9. entity details panel;
10. citation/reference component.

Populate only 8–12 well-verified nodes initially.

Recommended first test lineage:

Golgi  
→ Ramón y Cajal  
→ neuron doctrine  
→ McCulloch & Pitts  
→ Rosenblatt  
→ Hubel & Wiesel  
→ Fukushima  
→ LeCun  
→ AlexNet

The goal is to validate the interaction model before scaling content.

---

# 39. Second Implementation Milestone

Add:

- Story Mode;
- Trace Mode;
- search;
- multilingual content;
- Perceptron demo;
- receptive-field demo;
- backpropagation demo;
- contextual historical layer.

---

# 40. Third Implementation Milestone

Scale the knowledge base.

Add:

- symbolic AI;
- cybernetics;
- reinforcement learning;
- ImageNet;
- deep learning;
- transformers;
- foundation models;
- modern NeuroAI.

Introduce editorial tooling.

---

# 41. Long-Term Vision

The final product should become an interactive atlas of the science of intelligence.

Users should eventually be able to choose concepts such as:

- learning;
- prediction;
- attention;
- memory;
- representation;
- convolution;
- reinforcement;
- recurrence;
- self-supervision;
- embodiment;

and navigate their complete scientific ancestry.

The key interaction should not be:

"Read a history of AI."

It should be:

> "Explore how the scientific understanding of intelligence moved between brains, mathematics, machines, laboratories and continents."

The combination of **knowledge graph + geographical movement + historical timeline** should become the distinctive interaction model of the product.

The interface should make clear that ideas have:

- intellectual histories;
- geographic histories;
- technological dependencies;
- institutional histories.

A user should be able to see all four.

---

# 42. Implementation Workflow

Work iteratively.

Do not attempt to implement the entire historical corpus before validating the architecture.

At each stage:

1. inspect the existing repository;
2. identify the smallest coherent architectural step;
3. implement it;
4. add or update tests;
5. run tests;
6. run type checking;
7. run linting;
8. inspect the resulting UI;
9. fix regressions before continuing.

Do not remove existing working functionality unless required.

Prefer small coherent commits or implementation units.

Before introducing any major dependency, justify why it is necessary.

When ambiguous, prefer the simpler maintainable architecture.

---

# 43. Content Rules

When adding historical content:

- do not invent facts;
- verify dates;
- verify authorship;
- verify institutional affiliation;
- distinguish fact from historical interpretation;
- attach sources;
- flag uncertainty.

When a claim cannot be verified, store it as:

`needs-review`

rather than presenting it as fact.

---

# 44. UX Rules

For every major interaction ask:

- Does this interaction teach something?
- Does it reveal a historical relationship?
- Does it improve orientation?
- Does it preserve accessibility?

Avoid decorative interaction for its own sake.

Animations must reinforce:

- chronology;
- geography;
- causality;
- conceptual inheritance.

---

# 45. Final Quality Criteria

The implementation should feel like a cross between:

- a scientific atlas;
- an interactive museum;
- a historical archive;
- a modern data visualization;
- a high-quality educational documentary.

It should not feel like:

- a generic AI landing page;
- an academic department website;
- a conventional Wikipedia clone;
- a children's science site;
- a static timeline.

The visual design should communicate:

**intelligence, history, science, exploration and discovery.**

Scientific credibility, usability and visual sophistication are equally important.
