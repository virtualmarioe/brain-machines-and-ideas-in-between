import type { Claim, Reference } from '@/types/history';

// Each review covers only the stated claim, not the whole imported historical narrative.
export interface ResearchReview {
  catalogId: string;
  reference: Reference;
  claim: string;
  locator: string;
  limitation: string;
  reviewedAt: string;
}
const reviewedAt = '2026-10-16';
function review(
  catalogId: string,
  title: string,
  authors: string[],
  year: number,
  url: string,
  claim: string,
  limitation: string,
): ResearchReview {
  return {
    catalogId,
    claim,
    limitation,
    reviewedAt,
    locator: 'Publication record and author abstract',
    reference: {
      id: `review-${catalogId}`,
      type: 'paper',
      title,
      authors,
      year,
      url,
      accessedAt: reviewedAt,
    },
  };
}
export const researchReviews: ResearchReview[] = [
  review(
    'c_vae',
    'Auto-Encoding Variational Bayes',
    ['Diederik P. Kingma', 'Max Welling'],
    2013,
    'https://arxiv.org/abs/1312.6114',
    'Kingma and Welling introduced a reparameterized variational lower-bound estimator and an approximate inference model for continuous latent variables in a preprint submitted in December 2013.',
    'This verifies one formulation, not sole priority for variational autoencoders or the full history of variational inference.',
  ),
  review(
    'c_gan',
    'Generative Adversarial Nets',
    ['Ian Goodfellow and colleagues'],
    2014,
    'https://proceedings.neurips.cc/paper/2014/hash/f033ed80deb0234979a61f95710dbe25-Abstract.html',
    'The 2014 paper trains a generator and discriminator together through a two-player minimax objective.',
    'This supports the stated training framework, not universal convergence or a complete history of adversarial learning.',
  ),
  review(
    'c_neural_attention',
    'Neural Machine Translation by Jointly Learning to Align and Translate',
    ['Dzmitry Bahdanau', 'Kyunghyun Cho', 'Yoshua Bengio'],
    2014,
    'https://arxiv.org/abs/1409.0473',
    'The September 2014 preprint proposes a learned soft alignment mechanism to avoid encoding an entire source sentence in one fixed-length vector.',
    'The preprint date and ICLR 2015 venue are distinct. This is not a claim that all forms of attention began here.',
  ),
  review(
    'c_diffusion_models',
    'Denoising Diffusion Probabilistic Models',
    ['Jonathan Ho', 'Ajay Jain', 'Pieter Abbeel'],
    2020,
    'https://arxiv.org/abs/2006.11239',
    'Ho, Jain and Abbeel reported image synthesis with diffusion probabilistic models and connected their objective to denoising score matching in 2020.',
    'This verifies the 2020 contribution, not the earlier 2015 origin claim or a universal superiority over other generative models.',
  ),
  review(
    'c_rag',
    'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks',
    ['Patrick Lewis and colleagues'],
    2020,
    'https://arxiv.org/abs/2005.11401',
    'The 2020 RAG paper combines a pretrained sequence-to-sequence model with a dense retriever over a Wikipedia index for knowledge-intensive tasks.',
    'This supports a specific architecture and evaluation, not the invention of retrieval or a guarantee of factual answers.',
  ),
  review(
    'c_rlhf',
    'Deep Reinforcement Learning from Human Preferences',
    ['Paul F. Christiano and colleagues'],
    2017,
    'https://proceedings.neurips.cc/paper/7017-deep-reinforcement-learning-from-human-preferences.pdf',
    'The 2017 work learns a reward model from human comparisons of trajectory segments and uses it to train behavior in deep reinforcement learning tasks.',
    'The paper concerns control tasks. Later language-model applications and earlier preference-learning history require separate sources.',
  ),
  review(
    'c_lstm',
    'Long Short-Term Memory',
    ['Sepp Hochreiter', 'Jürgen Schmidhuber'],
    1997,
    'https://doi.org/10.1162/neco.1997.9.8.1735',
    'The 1997 paper presents long short-term memory as a recurrent architecture and learning method addressing decaying error signals over long time lags.',
    'This verifies the journal contribution, not the dossier’s 1995 lower date or every later LSTM variant.',
  ),
  review(
    'c_clip',
    'Learning Transferable Visual Models From Natural Language Supervision',
    ['Alec Radford and colleagues'],
    2021,
    'https://arxiv.org/abs/2103.00020',
    'The 2021 paper learns visual representations from paired images and text and evaluates transfer using natural-language descriptions of classes.',
    'This source supports the 2021 publication; it does not independently establish the dossier’s 2020 lower date.',
  ),
  review(
    'c_in_context_learning',
    'Language Models are Few-Shot Learners',
    ['Tom B. Brown and colleagues'],
    2020,
    'https://arxiv.org/abs/2005.14165',
    'The 2020 GPT-3 study evaluates tasks from text instructions and demonstrations supplied in context without task-specific gradient updates.',
    'The result is a prominent demonstration, not proof that in-context behavior originated in 2020 or works reliably on every task.',
  ),
  review(
    'c_scaling_laws',
    'Scaling Laws for Neural Language Models',
    ['Jared Kaplan and colleagues'],
    2020,
    'https://arxiv.org/abs/2001.08361',
    'The 2020 study reports empirical power-law relationships between language-model cross-entropy loss and model size, data size and training compute within its experimental setting.',
    'Empirical fits over studied regimes are not universal laws or guarantees of future capability.',
  ),
  review(
    'c_chain_of_thought',
    'Chain-of-Thought Prompting Elicits Reasoning in Large Language Models',
    ['Jason Wei and colleagues'],
    2022,
    'https://arxiv.org/abs/2201.11903',
    'The January 2022 preprint reports improved performance on several reasoning tasks when prompts include examples with intermediate reasoning steps.',
    'This verifies the 2022 experiments; the dossier’s 2021 lower date and general claims of reliable reasoning remain unverified.',
  ),
  review(
    'c_latent_diffusion',
    'High-Resolution Image Synthesis with Latent Diffusion Models',
    ['Robin Rombach and colleagues'],
    2021,
    'https://arxiv.org/abs/2112.10752',
    'The December 2021 preprint applies diffusion in the latent space of pretrained autoencoders to reduce computation; the conference publication is CVPR 2022.',
    'This supports the method and two publication dates, not every downstream system built with it.',
  ),
  review(
    'c_react',
    'ReAct: Synergizing Reasoning and Acting in Language Models',
    ['Shunyu Yao and colleagues'],
    2022,
    'https://arxiv.org/abs/2210.03629',
    'The October 2022 preprint interleaves reasoning traces and task-specific actions, including interactions with external information sources and environments.',
    'This supports the evaluated method, not guaranteed reliability or general autonomous agency. The camera-ready version appeared in 2023.',
  ),
  review(
    'c_bert_masked_lm',
    'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
    ['Jacob Devlin', 'Ming-Wei Chang', 'Kenton Lee', 'Kristina Toutanova'],
    2018,
    'https://arxiv.org/abs/1810.04805',
    'The October 2018 BERT preprint presents pretraining of deep bidirectional representations conditioned on left and right context, followed by task-specific fine-tuning.',
    'This identifies BERT’s contribution, not the first use of every component or all forms of masked language modeling.',
  ),
  review(
    'c_residual_connections',
    'Deep Residual Learning for Image Recognition',
    ['Kaiming He', 'Xiangyu Zhang', 'Shaoqing Ren', 'Jian Sun'],
    2015,
    'https://arxiv.org/abs/1512.03385',
    'The December 2015 preprint introduces a residual-learning framework to ease training of substantially deeper image-recognition networks.',
    'This supports the ResNet contribution, not sole priority for skip connections. The conference publication was in 2016.',
  ),
  review(
    'c_seq2seq',
    'Sequence to Sequence Learning with Neural Networks',
    ['Ilya Sutskever', 'Oriol Vinyals', 'Quoc V. Le'],
    2014,
    'https://arxiv.org/abs/1409.3215',
    'The September 2014 paper uses multilayer LSTMs to map an input sequence to a vector and decode a target sequence, with machine translation experiments.',
    'This is one influential sequence-to-sequence formulation, not the complete ancestry of encoder-decoder models.',
  ),
];
export const researchReviewById = new Map(researchReviews.map((item) => [item.catalogId, item]));
export const reviewedReferences = researchReviews.map((item) => item.reference);
export const reviewedClaims: Claim[] = researchReviews.map((item) => ({
  id: `review-claim-${item.catalogId}`,
  entityId: item.catalogId.replace(/^c_/, '').replaceAll('_', '-'),
  claim: { en: item.claim, de: item.claim, es: item.claim },
  references: [item.reference.id],
  status: 'verified',
  editorialNotes: `${item.locator}. Checked ${item.reviewedAt}. ${item.limitation}`,
}));
export const reviewedEdges = [
  {
    source: 'c_bayesian_inference',
    target: 'c_vae',
    reference: 'c_vae',
    claim:
      'The VAE formulation optimizes a variational bound for probabilistic latent-variable inference. This is a mathematical connection, not evidence of direct personal influence from Bayes.',
  },
  {
    source: 'c_game_theory',
    target: 'c_gan',
    reference: 'c_gan',
    claim:
      'The GAN paper explicitly formulates generator-discriminator training as a two-player minimax game. This verifies the mathematical relationship, not a full intellectual lineage.',
  },
  {
    source: 'c_recurrent_neural_networks',
    target: 'c_lstm',
    reference: 'c_lstm',
    claim:
      'The LSTM paper proposes a recurrent architecture addressing long time lags and decaying error signals.',
  },
  {
    source: 'c_diffusion_models',
    target: 'c_latent_diffusion',
    reference: 'c_latent_diffusion',
    claim:
      'Latent diffusion applies diffusion modeling within the representation space of pretrained autoencoders.',
  },
  {
    source: 'c_chain_of_thought',
    target: 'c_react',
    reference: 'c_react',
    claim:
      'ReAct explicitly compares and combines reasoning traces with task-specific actions. The source supports this methodological connection, not an inevitable historical progression.',
  },
];
