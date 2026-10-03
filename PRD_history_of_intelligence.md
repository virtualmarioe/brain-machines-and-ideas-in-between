# Product Requirements Document  
## An Interactive History of Intelligence: From Neurons to NeuroAI

### 1. Product Vision

Create a highly interactive, visually compelling, scientifically rigorous website that tells the history of the scientific study of **intelligence** and explains how neuroscience, psychology, mathematics, computer science, cybernetics, and artificial intelligence have repeatedly influenced one another.

The website should show that modern AI did not emerge as an isolated branch of computer science. Many of its central ideas have roots in attempts to understand biological intelligence, while developments in computation and artificial intelligence have, in turn, provided new concepts, models, experimental tools, and hypotheses for neuroscience.

The narrative should begin with foundational discoveries about the nervous system in the late nineteenth century and progress through:

- cellular neuroscience;
- the neuron doctrine;
- electrophysiology;
- theories of learning;
- mathematical models of biological neurons;
- cybernetics;
- early computing;
- symbolic artificial intelligence;
- perceptrons;
- connectionism;
- artificial neural networks;
- computational neuroscience;
- computer vision;
- reinforcement learning;
- deep learning;
- self-supervised learning;
- transformers and foundation models;
- modern computational models of biological intelligence;
- and finally **NeuroAI**, where neuroscience and artificial intelligence once again explicitly converge.

The site should not merely provide a chronological list of inventions. Its main purpose is to **visualize the genealogy of ideas**.

Users should be able to see how an observation in biology inspired a mathematical abstraction, how that abstraction became an artificial architecture, and how artificial systems subsequently generated new hypotheses about biological intelligence.

---

# 2. Target Audience

The website must be designed from the beginning for two simultaneous audiences.

### General audience

A scientifically curious visitor with no specialist knowledge should be able to explore the site and understand:

- what happened;
- who was involved;
- why the discovery mattered;
- what came before it;
- and what ideas it subsequently influenced.

Technical terminology must therefore be introduced progressively rather than assumed.

### Expert audience

Researchers in neuroscience, AI, machine learning, cognitive science, psychology, computational neuroscience, philosophy of mind, or computer science should find enough depth to remain intellectually engaged.

Every major historical claim should therefore provide optional access to:

- original scientific papers;
- books;
- historical documents;
- datasets;
- technical explanations;
- mathematical formulations;
- archival material;
- and modern reviews.

The guiding principle should be:

**simple on the surface, deep underneath.**

A visitor should be able to understand a concept in 30 seconds or explore it for 30 minutes.

---

# 3. Core Narrative

The central intellectual question of the website is:

> **How did our attempts to understand biological intelligence lead to artificial intelligence, and how is artificial intelligence now changing the way we understand biological intelligence?**

The entire site should reinforce this bidirectional relationship.

Rather than treating neuroscience history and AI history as two parallel timelines, visualize them as an interconnected network of discoveries.

For example:

**Golgi staining  
→ Ramón y Cajal  
→ neuron doctrine  
→ biological neurons as discrete computational elements  
→ McCulloch & Pitts  
→ artificial computational units  
→ perceptrons  
→ neural networks  
→ deep learning**

Another lineage could show:

**visual cortex physiology  
→ Hubel & Wiesel  
→ receptive fields / hierarchical visual processing  
→ Fukushima's Neocognitron  
→ convolutional architectures  
→ LeNet  
→ ImageNet  
→ AlexNet  
→ modern computer vision**

Another:

**behavioral learning  
→ Thorndike / Pavlov / Skinner  
→ reinforcement theories  
→ Bellman and dynamic programming  
→ temporal-difference learning  
→ Q-learning  
→ deep reinforcement learning  
→ DQN / AlphaGo  
→ modern embodied AI**

And another:

**information theory  
→ Shannon  
→ probabilistic models  
→ representation learning  
→ predictive coding / efficient coding  
→ self-supervised learning  
→ foundation models  
→ modern NeuroAI**

These relationships should become one of the site's defining visual features.

---

# 4. Historical Scope

The historical database should be organized around **people, discoveries, publications, experiments, institutions, technologies, datasets, and ideas**.

The following eras should form the initial backbone.

## Era I — Seeing the Nervous System

Approx. 1870–1910.

Cover the development of methods that made neurons visible and established the cellular organization of the nervous system.

Core topics should include:

- Camillo Golgi and the *reazione nera*;
- Santiago Ramón y Cajal;
- the neuron doctrine;
- neuronal morphology;
- dendrites and axons;
- Golgi versus Cajal's competing interpretations of nervous-system organization;
- Charles Sherrington and the concept of the synapse.

Where licensing permits, show high-resolution historical microscopy and Cajal drawings.

The 1906 Nobel Prize shared by Golgi and Ramón y Cajal should be presented in context.

---

# 5. From Neurons to Computation

Introduce the idea that nervous-system activity could be understood in computational or mathematical terms.

Important milestones should include:

- electrophysiology;
- action potentials;
- Charles Sherrington;
- Edgar Adrian;
- Hodgkin and Huxley;
- Donald Hebb and Hebbian learning;
- Warren McCulloch and Walter Pitts;
- the 1943 mathematical model of neural activity.

Explain clearly the conceptual leap involved in representing a biological neuron using an abstract computational element.

### Terminology requirement

The website must maintain a strict distinction:

- **neuron** = biological cell;
- **unit**, **node**, or **artificial unit** = element of an artificial neural network.

Avoid casually calling artificial units “neurons” unless discussing historical terminology or quoting a source.

---

# 6. Computing, Information and Cybernetics

Explain how several intellectual traditions converged around the question of intelligence.

Include:

- Alan Turing;
- the universal Turing machine;
- Turing's work on machine intelligence;
- John von Neumann;
- stored-program computer architecture;
- Claude Shannon;
- information theory;
- Norbert Wiener;
- cybernetics;
- feedback systems;
- control theory;
- W. Ross Ashby;
- Grey Walter and early autonomous machines where relevant.

Show geographically and intellectually how researchers working on brains, communication, computation, control and mathematics began addressing similar problems.

---

# 7. The Birth of Artificial Intelligence as a Field

Give particular importance to the **1956 Dartmouth Summer Research Project on Artificial Intelligence**.

Cover:

- John McCarthy;
- Marvin Minsky;
- Claude Shannon;
- Nathaniel Rochester;
- Allen Newell;
- Herbert Simon;
- early symbolic AI.

Allow users to inspect the original Dartmouth proposal.

Explain the historical importance of the phrase **artificial intelligence** and the optimism surrounding early research.

---

# 8. Perceptrons and Early Artificial Neural Networks

Include:

- Frank Rosenblatt;
- the perceptron;
- the Mark I Perceptron;
- supervised learning;
- linear classifiers;
- early hardware implementations;
- ADALINE and Widrow–Hoff learning where appropriate.

Create an interactive perceptron demonstration allowing visitors to manipulate inputs and weights and observe the resulting decision boundary.

---

# 9. Symbolic AI and Connectionism

One of the recurring themes of the website should be the historical tension between different conceptions of intelligence.

Present, without oversimplifying, the differences between:

**symbolic approaches**

and

**connectionist approaches**.

Explain how symbolic AI became dominant during parts of the twentieth century and how expert systems later became an important commercial expression of that paradigm.

Include representative systems such as:

- Logic Theorist;
- General Problem Solver;
- SHRDLU;
- MYCIN;
- expert systems.

Avoid presenting AI history as a simple linear progression from “wrong symbolic AI” to “correct neural networks.”

Instead, show how different approaches solved different problems and influenced later hybrid systems.

---

# 10. Perceptrons, Limitations and the AI Winters

Discuss Marvin Minsky and Seymour Papert's *Perceptrons* in its proper historical context.

Explain:

- what limitations the book actually demonstrated;
- which architectures those arguments applied to;
- how the historical claim that this book alone “caused the AI winter” is an oversimplification.

Provide a broader explanation of AI funding cycles, including:

- inflated expectations;
- computational limitations;
- data limitations;
- DARPA and government funding decisions;
- expert-system commercialization;
- collapse of the Lisp-machine market;
- first and second AI winters.

Whenever historians disagree about causal interpretations, explicitly indicate the disagreement rather than presenting one interpretation as fact.

---

# 11. Neuroscience Inspires Computer Vision

This should become one of the site's flagship interactive stories.

Begin with visual neuroscience.

Cover:

- retinal organization where necessary;
- receptive fields;
- Hubel and Wiesel;
- recordings from visual cortex;
- orientation selectivity;
- simple cells;
- complex cells;
- hierarchical representations.

Then visualize the conceptual progression toward artificial vision:

**receptive fields  
→ hierarchical feature detectors  
→ Neocognitron  
→ convolutional neural networks**

Include Kunihiko Fukushima's **Neocognitron** and clearly distinguish biological inspiration from engineering implementation.

An interactive visualization should allow the visitor to move between:

1. a visual stimulus;
2. an idealized visual cortical receptive field;
3. a convolutional filter;
4. activation maps in an artificial network.

The objective is not to imply that CNNs literally reproduce the visual cortex, but to explain the historical and conceptual relationship.

---

# 12. The Connectionist Revival

Cover developments that contributed to the resurgence of artificial neural networks, including:

- John Hopfield;
- Hopfield networks;
- Geoffrey Hinton;
- David Rumelhart;
- Ronald Williams;
- backpropagation;
- distributed representations;
- Boltzmann machines.

Explain backpropagation interactively.

A visitor should be able to modify:

- input;
- target;
- weights;
- learning rate;

and observe qualitatively how error propagates through a small network.

Also acknowledge the longer history of reverse-mode differentiation and related optimization ideas rather than implying that backpropagation appeared suddenly in the 1980s.

---

# 13. Convolutional Networks and Handwriting Recognition

Include Yann LeCun's work on convolutional networks and handwritten digit recognition.

Use MNIST as an accessible demonstration.

Allow users to draw a digit directly in the browser and see:

- the model's classification;
- class probabilities;
- intermediate features where feasible.

Explain why convolution, weight sharing and hierarchical feature extraction were important.

---

# 14. Data Becomes a Scientific Infrastructure

Give considerable attention to the often-underappreciated role of datasets.

Explain that advances in AI have depended not only on algorithms but also on:

- data;
- annotation;
- compute;
- software;
- hardware;
- benchmarks.

Use **ImageNet** as a major case study.

Discuss:

- Fei-Fei Li and collaborators;
- large-scale visual categorization;
- WordNet;
- Amazon Mechanical Turk;
- crowdsourced annotation;
- the ImageNet Large Scale Visual Recognition Challenge.

Visualize how the dataset grew and why its scale changed computer vision research.

---

# 15. AlexNet and the Deep Learning Breakthrough

Present the 2012 ImageNet result involving:

- Alex Krizhevsky;
- Ilya Sutskever;
- Geoffrey Hinton.

Explain the combination of:

- convolutional neural networks;
- GPUs;
- large datasets;
- nonlinear activation functions;
- regularization;
- sufficient computational scale.

This section should emphasize a recurring theme of the website:

> Scientific breakthroughs often occur when an old idea meets the technological conditions that finally make it work at scale.

---

# 16. Reinforcement Learning

Build a separate intellectual lineage for learning through interaction.

Include relevant historical developments such as:

- behavioral theories of learning;
- reward and prediction;
- dynamic programming;
- Richard Bellman;
- temporal-difference learning;
- Sutton and Barto;
- Q-learning;
- reward prediction error.

Where relevant, connect computational reinforcement learning with dopamine research and neuroscience.

Continue into:

- Deep Q-Networks;
- Atari;
- DeepMind;
- AlphaGo;
- AlphaZero.

Create a simple interactive reinforcement-learning environment in which visitors can see an agent learn through reward.

---

# 17. Representation Learning and Self-Supervised Learning

Explain the transition from manually engineered features and heavily labeled supervised datasets toward systems that learn useful representations from the statistical structure of data itself.

Include:

- autoencoders;
- generative models;
- contrastive learning;
- predictive learning;
- self-supervised learning;
- masked prediction.

Whenever possible, connect these ideas with neuroscience concepts such as:

- predictive coding;
- efficient coding;
- sensory prediction;
- representation learning.

Carefully distinguish genuine historical influence from later conceptual similarity.

Do not imply biological equivalence without evidence.

---

# 18. Attention, Transformers and Foundation Models

Cover the development of:

- attention mechanisms;
- *Attention Is All You Need*;
- transformers;
- large language models;
- multimodal models;
- foundation models.

Explain how artificial attention differs from psychological and neuroscientific concepts of attention despite the shared terminology.

This distinction should become an example of a broader rule:

> Similar vocabulary across neuroscience and AI does not automatically imply mechanistic equivalence.

---

# 19. NeuroAI: The Loop Closes

The final major section should introduce **NeuroAI** as a contemporary effort to reconnect neuroscience and artificial intelligence.

The site should explain at least three directions.

### Neuroscience → AI

How principles discovered in biological systems may inspire more capable or efficient artificial intelligence.

Examples might include:

- sparse computation;
- recurrent processing;
- predictive processing;
- continual learning;
- memory systems;
- active perception;
- embodiment;
- neuromorphic computing.

### AI → Neuroscience

How artificial networks can serve as computational models of biological systems.

Examples:

- encoding models;
- representational similarity analysis;
- neural predictivity;
- models of visual cortex;
- language models as models of language processing;
- network models of navigation and memory.

### Joint study of intelligence

Frame NeuroAI as an attempt to identify computational principles that may apply across biological and artificial intelligent systems.

The website should end not with a definitive answer to “What is intelligence?” but with an interactive collection of open questions.

Examples:

- Is embodiment necessary for general intelligence?
- Is prediction a fundamental principle of intelligence?
- How important is recurrence?
- Why are biological systems dramatically more energy efficient?
- How can artificial systems learn continuously without catastrophic forgetting?
- Are current foundation models useful models of biological cognition?
- Which similarities between brains and artificial networks are causal, and which are superficial?
- Can understanding biological intelligence lead to fundamentally different AI architectures?

---

# 20. Nobel Prize Layer

Create a dedicated visual layer showing relevant Nobel Prizes along the timeline.

Important examples include:

- Golgi and Ramón y Cajal — 1906;
- Hubel and Wiesel — 1981;
- relevant prizes concerning neuronal signaling and information processing;
- John Hopfield and Geoffrey Hinton — Physics 2024;
- Demis Hassabis and John Jumper — Chemistry 2024, together with David Baker's contribution to the same prize.

Nobel Prizes should not be used as a simplistic proxy for scientific importance.

Instead, they should function as historical landmarks that users may toggle on or off.

---

# 21. Core Interaction: Time × Geography × Ideas

The main interface should integrate three dimensions simultaneously.

## A. Interactive timeline

Users can move continuously through time from approximately 1870 to the present.

Zoom levels should support:

- decades;
- years;
- individual discoveries.

## B. Interactive world map

Historical events should appear geographically.

The map should show locations such as:

- Madrid;
- Pavia;
- Cambridge;
- London;
- Princeton;
- Dartmouth;
- Montreal;
- Toronto;
- Stanford;
- MIT;
- Bell Labs;
- Carnegie Mellon;
- Kyoto;
- Tokyo;
- Paris;
- California;
- and other historically relevant locations.

Users should be able to see scientific ideas moving geographically as researchers migrate between institutions.

## C. Network of ideas

A third layer should represent conceptual influence.

Clicking a discovery should reveal:

**What influenced this?**

and

**What did this influence?**

Connections should be classified rather than shown as generic arrows.

Potential relationship types:

- biological discovery;
- direct inspiration;
- mathematical formalization;
- technological enabler;
- conceptual analogy;
- dataset dependency;
- computational implementation;
- later reinterpretation.

---

# 22. Story Mode and Exploration Mode

Provide two major navigation paradigms.

### Story Mode

A curated narrative for first-time visitors.

It should guide the visitor through the history using animated transitions, approximately like an interactive documentary.

### Explore Mode

Experts and returning users should be able to freely navigate the complete knowledge graph.

Filters should include:

- neuroscience;
- psychology;
- AI;
- computer science;
- mathematics;
- hardware;
- datasets;
- algorithms;
- people;
- institutions;
- Nobel Prizes.

---

# 23. Progressive Depth

Every important historical node should contain three levels.

### Level 1 — Why it matters

Approximately 50–100 words.

Written for a general audience.

### Level 2 — Understand the idea

Approximately 300–700 words plus diagrams or interactive demonstrations.

### Level 3 — Go deeper

For expert users.

Include:

- technical explanation;
- equations where relevant;
- original paper;
- subsequent papers;
- review articles;
- historical commentary;
- primary historical sources;
- related datasets or code.

---

# 24. Multilingual Architecture

The website must be designed **from the first commit** for:

- English;
- German;
- Spanish.

English should function as the canonical content layer, but the architecture must not treat German and Spanish as secondary additions.

Every content object should therefore use structured localization keys.

For example:

`title.en`  
`title.de`  
`title.es`

and similarly for descriptions, captions, explanations, accessibility text and interface labels.

Do not hard-code interface text into frontend components.

Users should be able to switch languages without losing:

- timeline position;
- map position;
- currently selected person;
- currently selected historical event;
- exploration state.

Scientific names, titles of publications and quotations should preserve their original language where appropriate, accompanied by translations.

---

# 25. Scientific Evidence and Source Requirements

Scientific traceability is a core product requirement.

Every historical claim should be linked to a source.

Prefer sources in this order:

1. original scientific publication;
2. original historical document;
3. Nobel Prize documentation;
4. university or institutional archive;
5. authoritative historical scholarship;
6. peer-reviewed review article;
7. reputable scientific organization.

Avoid relying on unsourced blogs or generic secondary summaries.

For every historical object, store:

- claim;
- source;
- DOI where available;
- URL;
- publication year;
- authors;
- source type;
- access date;
- optional quotation;
- licensing status.

Historical controversies should not be flattened into definitive claims.

When historians disagree, explicitly expose the disagreement.

---

# 26. Images and Historical Material

Use authentic visual material wherever possible.

Potential examples include:

- Cajal drawings;
- Golgi-stained tissue;
- early electrophysiological traces;
- photographs of scientists;
- diagrams from original papers;
- early computers;
- perceptron hardware;
- visual cortex stimuli;
- Neocognitron diagrams;
- early CNN architectures;
- ImageNet examples;
- AlexNet diagrams;
- AlphaGo visualizations;
- modern neural recordings.

Each image must include:

- source;
- creator;
- date;
- copyright/licensing information;
- caption;
- alt text.

Do not assume that an image appearing in a scientific publication can legally be reproduced.

When copyright prevents reproduction, create an original explanatory illustration and link to the source material.

---

# 27. Interactive Scientific Demonstrations

Where technically feasible, concepts should be experienced rather than merely described.

Candidate interactive modules include:

- neuron morphology explorer;
- action-potential simulation;
- McCulloch–Pitts unit;
- Hebbian learning demonstration;
- perceptron classifier;
- receptive-field explorer;
- Hubel–Wiesel orientation-selectivity simulation;
- convolution visualizer;
- Neocognitron/CNN comparison;
- backpropagation explorer;
- handwritten-digit classifier;
- ImageNet scale visualization;
- reinforcement-learning environment;
- Hopfield associative-memory demonstration;
- representation-space visualization;
- attention-map demonstration;
- transformer token prediction;
- neural-network versus brain-representation comparison.

Animations should support the scientific explanation rather than exist as decoration.

---

# 28. Hover, Rollover and Expansion Behavior

Use progressive interaction extensively.

Examples:

Hovering over a person may reveal:

- photograph;
- lifespan;
- institution;
- main contribution.

Hovering over a paper may reveal:

- title;
- year;
- authors;
- one-sentence significance.

Clicking expands the full historical node.

Hovering over a connection between two discoveries should explain **why those events are connected**.

Whenever a visual element can meaningfully expose additional scientific information through rollover, zoom, expansion, filtering or animation, consider implementing that interaction.

---

# 29. Historical Knowledge Graph

The backend should represent the history as structured data rather than a collection of manually written pages.

Core entity types:

- Person
- Event
- Publication
- Discovery
- Concept
- Experiment
- Institution
- Location
- Dataset
- Algorithm
- Architecture
- Technology
- Nobel Prize
- Scientific field

Relations might include:

- INFLUENCED
- INSPIRED_BY
- DEVELOPED
- DISCOVERED
- WORKED_AT
- STUDIED_UNDER
- COLLABORATED_WITH
- PUBLISHED
- USED_DATASET
- ENABLED_BY
- EXTENDED
- CHALLENGED
- MODELED
- BIOLOGICALLY_INSPIRED_BY

The architecture should make it straightforward to add future discoveries without redesigning the site.

---

# 30. Content Management

Separate historical content completely from visual components.

Content should be stored in structured data or a headless CMS rather than embedded directly into React components.

The CMS should allow editors to:

- add people;
- create events;
- add sources;
- create connections;
- add translations;
- upload licensed images;
- flag uncertain claims;
- identify historical controversies;
- add interactive demonstrations;
- assign geographical coordinates.

---

# 31. Suggested Technical Architecture

Use a modern web stack optimized for interactive scientific storytelling.

A suitable starting point could include:

- Next.js;
- TypeScript;
- React;
- server-side rendering where appropriate;
- D3.js for network/timeline visualization;
- Mapbox GL, MapLibre or equivalent for geographic visualization;
- WebGL / Three.js selectively for advanced visualizations;
- MDX or structured CMS content for long-form explanations;
- PostgreSQL or equivalent structured database;
- graph representation or graph database if justified by the interaction model.

Do not select technologies merely because they are fashionable.

Prioritize:

- maintainability;
- accessibility;
- performance;
- extensibility;
- reproducibility;
- scientific traceability.

---

# 32. Performance

The site may eventually contain hundreds or thousands of interconnected events.

The frontend must therefore support:

- lazy loading;
- progressive image loading;
- code splitting;
- responsive visualization;
- caching;
- reduced-motion modes;
- efficient map rendering;
- efficient graph rendering.

Interactive demonstrations should not make the primary historical experience dependent on powerful hardware.

---

# 33. Accessibility

Accessibility is mandatory.

Implement at least:

- WCAG 2.2 AA targets;
- keyboard navigation;
- screen-reader-compatible descriptions;
- alt text;
- sufficient contrast;
- reduced-motion preference;
- non-color-dependent encoding;
- captions/transcripts for audiovisual material.

Interactive scientific graphics should provide accessible textual equivalents.

---

# 34. Design Language

The visual identity should communicate:

**history + science + exploration + intelligence**

without looking like either:

- a conventional university webpage;
- a generic AI startup;
- or a children's educational website.

Aim for a sophisticated interactive-documentary aesthetic.

Possible visual inspiration:

- scientific atlases;
- museum installations;
- historical archives;
- data visualization;
- cartography;
- neural morphology;
- scientific notebooks.

Historical periods may subtly change visual character while retaining a coherent overall system.

---

# 35. Scientific Visualization Principles

Scientific accuracy must take precedence over visual spectacle.

Do not:

- show biological neurons merely as glowing generic networks;
- imply that artificial networks faithfully reproduce brains;
- equate attention mechanisms with biological attention;
- equate artificial units with biological neurons;
- portray AI history as inevitable linear progress.

Clearly identify diagrams as:

- original historical figures;
- reconstructions;
- conceptual diagrams;
- simulations;
- artistic illustrations.

---

# 36. Editorial Principle: Avoid “Great Man” History

Although scientists are important narrative anchors, the project should not imply that scientific ideas emerge from isolated geniuses.

Show:

- collaborators;
- laboratories;
- students;
- competing research groups;
- technical staff;
- datasets;
- funding institutions;
- hardware;
- historical circumstances.

Where possible, expose overlooked contributors and disputed attribution.

---

# 37. Historical Context Layer

Allow users to optionally activate a broader historical context.

Examples:

- industrialization;
- telegraphy;
- World War II;
- Cold War research funding;
- development of digital computers;
- semiconductor revolution;
- internet;
- GPU development;
- growth of large datasets;
- cloud computing.

This layer should help explain why certain ideas became technically feasible at particular moments.

---

# 38. Recommended Scholarly Starting Points

Use expert historical and conceptual literature as guides, but verify individual claims against primary sources.

Potential starting points include works by:

- Melanie Mitchell;
- Margaret Boden;
- Stuart Russell and Peter Norvig;
- Nils Nilsson;
- Pamela McCorduck;
- Judea Pearl;
- Terrence Sejnowski;
- Michael Arbib;
- Jeff Hawkins where relevant;
- histories of cybernetics and computational neuroscience;
- primary writings by Turing, Wiener, Shannon, McCulloch, Pitts, Hebb, Rosenblatt, Minsky, Papert, Fukushima, Hopfield, Hinton, LeCun and others.

Also incorporate Blaise Agüera y Arcas's work on intelligence where relevant.

Books should guide narrative structure but should not replace primary-source verification.

---

# 39. Research Expansion Requirement

Do not treat the milestones described in this PRD as an exhaustive list.

During development, actively identify historically important missing links.

For every proposed addition:

1. identify the historical event;
2. explain why it matters to the genealogy of intelligence or NeuroAI;
3. identify its relationship with existing nodes;
4. provide a credible source;
5. provide the original paper whenever possible.

Potential missing branches should be surfaced for editorial review rather than automatically incorporated as fact.

---

# 40. Explicit Historical Fact-Checking Requirement

The project must maintain a fact-checking layer.

Before publication, verify:

- names;
- spelling;
- dates;
- institutional affiliations;
- publication dates;
- authorship;
- priority claims;
- Nobel Prize motivations;
- causal historical claims;
- relationships between biological and artificial models.

Particular caution should be applied to popular AI-history narratives that are frequently repeated but historically disputed.

---

# 41. MVP

The first functional release should demonstrate the complete interaction concept rather than attempt to contain the entire history.

The MVP should include approximately 25–40 carefully curated milestones covering:

**Golgi/Cajal  
→ neuron doctrine  
→ Hebb  
→ McCulloch & Pitts  
→ Turing  
→ von Neumann  
→ Shannon/Wiener/cybernetics  
→ Dartmouth  
→ Rosenblatt  
→ Hubel & Wiesel  
→ Minsky & Papert  
→ Fukushima  
→ Hopfield  
→ backpropagation  
→ LeCun  
→ reinforcement learning  
→ ImageNet  
→ AlexNet  
→ deep reinforcement learning  
→ transformers  
→ AlphaFold  
→ foundation models  
→ modern NeuroAI**

The MVP must already contain:

- interactive timeline;
- world map;
- idea connections;
- multilingual architecture;
- source system;
- progressive content depth;
- at least three interactive scientific demonstrations.

---

# 42. Long-Term Product Goal

The final product should become more than a history website.

It should become an **interactive atlas of the science of intelligence**.

A visitor should eventually be able to select any modern concept—for example:

**convolution**,  
**attention**,  
**reinforcement learning**,  
**representation**,  
**prediction**,  
**memory**,  
or **neural networks**

—and trace backwards through its scientific ancestry.

Likewise, selecting a biological discovery should reveal the technological ideas it eventually influenced.

The desired experience is not:

> “Here is a timeline of AI.”

It is:

> **“Explore how humanity has tried to understand intelligence—and discover how ideas have repeatedly travelled between brains and machines.”**

The final experience should make the central message visually unavoidable:

**Neuroscience and artificial intelligence do not have independent histories. They are two recurring attempts to understand and construct intelligent systems, and their histories have repeatedly intersected, diverged, and converged again. NeuroAI is the latest chapter of that much older conversation.**