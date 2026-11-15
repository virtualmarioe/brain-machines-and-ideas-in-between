# Learning experience review

## Baseline and inventory

Reviewed on 15 November 2026. Next.js App Router, React, TypeScript, native SVG, D3 geography, and a typed trilingual content layer support 164 entities, 117 relationships, 87 references, and 72 claims. The existing 33 distinct labs cover cellular structure, logic, feedback, information, optimization, representations, attention, and learning. Historical events remain reading material. Four guided journeys supply reflection questions. Story, Explore, Trace, global text search, graph neighborhoods, geography, and timeline share URL state.

Preserve numerical models, evidence and uncertainty labels, translations, native keyboard controls, progressive reading tabs, lazy-loaded simulations, theme tokens, reduced motion, and shareable entity routes. Imported research is explicitly qualified; it must not acquire stronger verification claims through redesign.

Baseline: content validation, 135 unit tests, TypeScript, and lint pass. Desktop browser inspection shows a long setup sequence before the selected discovery: introduction, complexity cards, collapsed journeys, search, repeated exploration instructions, orientation, and filters. Existing unit/browser coverage is extensive. No representative learner study was available; findings are expert heuristics, not measured learning outcomes.

## Prioritized strategy

| Priority | Finding and audience | Implementation | Benefit / effort / risk |
| --- | --- | --- | --- |
| 1 | Beginners cannot immediately distinguish a guided route from open exploration; labs are buried in individual records. | Three purposeful entry actions and a searchable library of existing experiments. | Broad discovery benefit; medium effort, low scientific risk. |
| 1 | Researchers can receive no results because introductory complexity or dates hide a matching concept. | Offer full-catalog matches without silently overriding current filters. | High navigation benefit; small effort, medium state risk. |
| 1 | Reading competes with two complex visualizations and a sidebar. | Optional focused reading with a clear return to the atlas and direct reading anchor. | Broad cognitive-load benefit; small effort, low risk. |
| 2 | Parameter manipulation is often unguided. | Reusable prediction, feedback, and experiment prompts for five existing labs. | High instructional potential; medium effort, low model risk. |
| 2 | Returning visitors lose track of discoveries when leaving the current URL. | Small local recent-discovery list with clear-history control and defensive storage handling. | Useful continuity; medium effort, privacy remains local. |
| 2 | Numerous large setup blocks compete visually. | Compact shared setup styling and consistent action surfaces using current tokens. | Broad hierarchy benefit; small effort, responsive regression risk. |

A second concept graph, a new visualization framework, and speculative scientific relationships would add complexity without resolving these issues. The current graph already provides focused neighborhoods, historical versus conceptual relationship styles, zoom, direct selection, and textual relationship lists. New learning interactions should reuse the validated models.

## Journey assessment

- Beginner: explicit guided entry, discoverable experiments, intuition-first reading and optional challenges.
- Undergraduate: existing relationship navigation plus focused reading and prompts tying parameter changes to outcomes.
- Graduate: complete experiment directory and existing equation disclosures, numerical values, and model caveats.
- Expert: full-catalog search recovery and direct topic routes, with research-review qualifications preserved.

## Constraints

Complexity controls both catalog membership and initial reading depth. Searching the full catalog must not relabel unreviewed material. Relationships describe documented influences, analogies, and context, not a universal prerequisite curriculum. Browser history is managed inside the shared atlas; new actions must use that same state transition path. Persistence must tolerate malformed or unavailable local storage. Automated accessibility scans cannot establish complete WCAG conformance. Development-server timing is not a production Core Web Vitals measurement.

## Demonstration inventory and instructional assessment

All 33 existing experiments have deterministic controls, visible output, reset behavior, and simplification notes. Numerical and interaction regression tests cover them. Their shared weakness was discovery: visitors had to find the corresponding historical record before learning that an experiment existed. The new library exposes all of them using the existing localized titles and descriptions, without fabricating new curriculum links.

| Demo identifier | Learning objective / meaningful manipulation | Assessment and action |
| --- | --- | --- |
| staining | Change stain density to see why sparse labeling reveals structure. | Preserve visual comparison; library discovery added. |
| arbor | Change branching to inspect cell morphology. | Preserve; morphology is not a functional model. |
| synapse | Explore contact timing. | Preserve; simplified timing model remains qualified. |
| logic | Manipulate Boolean inputs to a threshold unit. | Preserve direct input/output feedback. |
| perceptron | Move inputs, weights, and bias to change a linear decision. | Add prediction of bias effect and threshold-crossing experiment. |
| orientation | Change stimulus orientation and inspect tuning. | Preserve; model is not a fitted biological experiment. |
| convolution | Compare image patches and shared filter responses. | Add alignment prediction and controlled filter comparison. |
| backpropagation | Train a small network and inspect loss and gradients. | Add zero-input limiting case to distinguish gradient information from learning rate. |
| sharing | Compare shared weights. | Preserve parameter-reuse explanation. |
| sampling | Explore dataset sampling. | Preserve explicit toy-dataset limitations. |
| rectifier | Inspect rectified activations. | Preserve direct nonlinear input/output comparison. |
| hebbian | Change coactivation and connection strength. | Preserve distinction between historical proposal and update rule. |
| tape | Step through a toy tape machine. | Preserve inspectable execution state. |
| stored-program | Explore instructions and data. | Preserve computational abstraction. |
| entropy | Vary binary probability and inspect uncertainty. | Add predict-before-reveal and symmetric-probability comparison. |
| feedback | Change feedback and inspect a trajectory. | Preserve causal parameter/output relation. |
| symbolic | Explore symbolic reasoning. | Preserve difference between rules and learned parameters. |
| xor | Investigate single-boundary limitations. | Preserve important counterexample to linear separability. |
| memory | Perturb patterns and inspect recall dynamics. | Preserve state and energy explanation. |
| digits | Edit digit templates. | Preserve explicit template simplification. |
| planning | Compare discounted future returns. | Preserve numerical mechanism. |
| reward | Manipulate predictions and reward. | Preserve temporal-difference interpretation. |
| q-update | Change action-value update inputs. | Preserve transparent numerical update. |
| surprise | Compare expected and observed rewards. | Preserve model versus biological finding distinction. |
| replay | Explore replay sampling. | Preserve controlled sampling demonstration. |
| tree-search | Inspect prior-guided search. | Preserve limited search example. |
| prediction | Compare predicted and observed sensory input. | Preserve distinction from a complete cortical model. |
| attention | Change scores and temperature to inspect weights and mixture. | Add equal-score prediction and value-versus-weight comparison. |
| masking | Explore withheld-word prediction. | Preserve toy example caveat. |
| geometry | Inspect geometric constraints. | Preserve distinction from production protein prediction. |
| transfer | Explore pretraining and adaptation. | Preserve simplified transfer illustration. |
| representations | Compare response-space geometry. | Preserve numerical and visual alternatives. |
| membrane | Change terms in a simplified membrane balance. | Preserve explicit limits of the model. |

The five new checkpoints are optional disclosures with native radio groups, disabled submission before selection, feedback for both correct and incorrect predictions, and a retry action. They add active reasoning around existing numerical models. They do not claim to reproduce production systems, add graded progress, or establish improved learning outcomes without a learner study.

## Implementation map

- `components/exploration/LearningEntry.tsx`: guided, experimental, and direct-search entry actions; guided entry moves keyboard focus to the opened path selector.
- `components/exploration/ExperimentLibrary.tsx`: localized, searchable access to the complete existing lab catalog, including empty-state recovery.
- `components/exploration/RecentDiscoveries.tsx`: six-record bounded device-local history; five previous records shown; malformed/unavailable storage tolerated; explicit clear action.
- `components/Atlas.tsx`: integrates new discovery paths, full-catalog search recovery, focused reading, and safe advanced trace selection. Map relationship filtering now uses a memoized set of visible IDs instead of repeated scans.
- `lib/exploration.ts`: optional `view=reading` round-trips through existing routes and browser history. Focused reading unmounts graph and map, and restores them when returning to the atlas.
- `components/content/EntityPanel.tsx`: stable reading anchor, retained progressive reading and evidence.
- `components/interactive/PredictionCheckpoint.tsx` and `content/experiment-challenges.ts`: reusable interaction with separately maintained localized instructional content for five labs.
- `app/learning-experience.css`: shared-token entry cards, readable library, compact setup, and focused layout. Existing theme and motion systems remain authoritative.

## Further opportunities, not implemented

1. Observe representatives of all four audiences completing the same learning tasks; measure successful navigation and explanation quality, not just clicks.
2. Extend checkpoints to other labs only after establishing a clear misconception and a useful experiment.
3. Consider separating catalog coverage from reading depth, with explicit migration of existing complexity URLs.
4. Add scholarly review coverage and fuller translations for imported research, retaining current provenance qualifications.
5. Audit with VoiceOver and other assistive technology; automated scans alone are insufficient.
6. Collect production field performance measurements before adding graph virtualization or other architectural complexity.

## Final navigation refinements

Experiment routes now retain `lab=1`, so a shared URL and reload reopen the selected demonstration; Back closes a lab opened from a discovery and Forward restores it. Text-only records ignore the lab parameter. Selecting an advanced trace target raises catalog coverage just enough to include that target, fixing the previous silent fallback to another discovery. The filter summary no longer labels the automatic timeline extent as a user-applied date filter. Empty searches retain an exit from focused reading.
