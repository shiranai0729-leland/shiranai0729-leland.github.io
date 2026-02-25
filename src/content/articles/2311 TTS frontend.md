---
title: "Paper Notes: TTS Frontiers"
description: "A comprehensive review of the latest developments in Text-to-Speech (TTS) synthesis, covering Fast TTS, Low-Resource TTS, Robust TTS, Expressive TTS, and Adaptive TTS based on recent research."
pubDate: "Nov 13 2023"
tags: ["TTS", "Speech Synthesis", "Deep Learning", "Paper Notes"]
---

# Paper Notes: TTS Frontiers

Original Paper: [A Survey on Neural Speech Synthesis](https://arxiv.org/abs/2106.15561)

### 1. Background

TTS (Text-to-Speech) is a typical Seq2Seq generation task. Traditional autoregressive generation is relatively slow; thus, accelerating generation speed or reducing model size for fast speech synthesis has gained significant attention. Furthermore, research focuses on enhancing the naturalness and intelligibility of synthesized speech, particularly in building data-efficient TTS models in low-resource environments. Due to inherent robustness issues in TTS models, many studies aim to improve stability and reduce artifacts like word skipping or repetition. To enhance naturalness, researchers work on modeling, controlling, and transferring speech style/prosody to generate more expressive voices. The following figure illustrates the evolution of neural TTS models.

> **What is Autoregression?**
> Autoregression refers to a sequence generation process where each element depends on previously generated ones. In an autoregressive model, each element is predicted through a conditional probability model using the preceding sequence as input. For speech synthesis, this means each frame or phoneme depends on those that came before it. The model predicts the probability distribution for the next element based on context and then samples from it. This sequential nature makes the process relatively slow, especially for long sequences, as each step must wait for the previous one to complete. To address this, researchers explore efficient architectures, parallelization strategies, or non-autoregressive approximations.

![TTS model Evolution](https://s2.loli.net/2023/06/08/jSzWhvE6MogKid9.png)

---

### 2. Fast TTS

TTS systems deployed on cloud servers or embedded devices require high synthesis speeds. However, early neural models relied on autoregressive mel-spectrogram and waveform generation. Given the length of speech sequences (e.g., a 1-second clip at 24kHz sampling rate with a 10ms hop size results in 100 mel-spectrogram frames and 24,000 waveform points), generation was extremely slow. Various techniques have been developed to accelerate inference:
1.  **Non-Autoregressive Generation:** Parallelizing the generation of mel-spectrograms and waveforms.
2.  **Lightweight Architectures:** Designing efficient model structures to reduce computational overhead.
3.  **Domain Knowledge Integration:** Utilizing speech-specific insights to streamline the synthesis process.

---

### 3. Low-Resource TTS

Building high-quality TTS systems typically requires vast amounts of paired text and speech data. However, most of the world's 7,000+ languages lack such datasets, limiting commercial TTS to only a few dozen languages. Research in low-resource TTS is both commercially valuable and socially significant.

**Self-supervised Training**
While paired data is scarce, unpaired speech and text (especially text) are more accessible. Self-supervised pre-training can enhance language understanding or speech generation. For instance, text encoders can be augmented with pre-trained BERT models, while speech decoders can be pre-trained using mel-spectrogram prediction or joint training with voice conversion. Additionally, speech can be quantized into discrete tokens to simulate phoneme sequences, creating pseudo-paired data for pre-training followed by fine-tuning on limited real data.

**Cross-lingual Transfer**
High-resource languages can provide a foundation for low-resource ones, as humans share similar vocal structures and articulation. Pre-training on high-resource data helps map text to speech in low-resource settings. Since phoneme sets vary, researchers use embedding mapping, International Phonetic Alphabet (IPA), or byte representations to handle diverse languages. Language similarity is also a key factor in successful transfer.

**Cross-speaker Transfer**
When data for a specific speaker is limited, models can leverage data from others. This involves using voice conversion to augment training data or employing voice adaptation/cloning to adjust a multi-speaker model to a target voice.

**Speech Chain & Back Transformation**
TTS and Automatic Speech Recognition (ASR) are dual tasks. Techniques like "speech chains" use unpaired data to iteratively improve both models—using TTS to generate training data for ASR and vice-versa.

**Dataset Mining**
Web-crawled data often contains low-quality paired text and speech. Techniques like speech enhancement, noise reduction, and decoupling are used to refine this "in-the-wild" data for training.

---

### 4. Robust TTS

A robust TTS system should generate correct speech even in edge cases. In neural TTS, robustness issues often stem from:
1.  **Alignment Difficulty:** Challenges in mapping characters/phonemes to mel-spectrogram frames.
2.  **Exposure Bias:** Errors in autoregressive generation that propagate through the sequence.

**Improving Alignment**
Research focuses on two areas:
*   **Strengthening Attention:** Making attention mechanisms more stable.
*   **Duration Prediction:** Replacing attention with explicit duration models to bridge the length gap between text and speech.

**Mitigating Exposure Bias**
*   **Refining AR Generation:** Using techniques like "Professor Forcing" or "Teacher-Student Distillation" to reduce training-inference mismatch.
*   **Switching to NAR:** Adopting non-autoregressive generation to avoid sequential dependencies entirely.

> **Exposure Bias Explained**
> This occurs when there is a mismatch between training (where the model sees "ground truth" previous steps) and inference (where it uses its own potentially erroneous previous outputs). These small errors can accumulate, leading to significant degradation in long sequences.

#### 4.1 Enhancing Attention
Incorrect alignment in encoder-decoder attention leads to word skipping, repetition, or "attention collapse." To fix this, researchers enforce specific properties:
1.  **Locality:** Each token aligns with a contiguous set of frames.
2.  **Monotonicity:** Speech should follow the order of the text.
3.  **Completeness:** Every token must be represented in the output.

![enhancingattention.png](https://s2.loli.net/2023/06/08/w9vxKLJgf6oMYqa.png)

#### 4.2 Replacing Attention with Duration Prediction
Some models entirely remove the encoder-decoder attention, opting to explicitly predict the duration of each phoneme. This allows the model to expand the text sequence to match the speech length before generation. This approach marks a "revival" of techniques used in earlier statistical parametric synthesis (SPSS).

![replacingattention.png](https://s2.loli.net/2023/06/08/WcJNE97RHY6QlZf.png)

#### 4.3 Enhancing AR Generation
Techniques to improve sequential generation include:
*   **Professor Forcing:** Matching the hidden state distributions of training and inference.
*   **Knowledge Distillation:** A "student" model learns to mimic a "teacher" model's output distribution, often improving generalization and efficiency.
*   **Bidirectional Generation:** Using both left-to-right and right-to-left passes for regularization.
*   **Data Augmentation:** Adding noise to spectrograms during training to make the model more resilient to its own prediction errors.

#### 4.4 Transitioning to Non-Autoregressive (NAR) Generation
NAR models avoid exposure bias by generating the entire sequence in parallel. These are categorized based on their alignment method (attention-based vs. duration-based). Common examples include FastSpeech and Glow-TTS.

---

### 5. Expressive TTS

Expressiveness is key to natural-sounding speech, encompassing timbre, intonation, emotion, and style. The main challenge is the **one-to-many mapping problem**: the same text can be spoken in many different ways.

Standard loss functions (like L1) often lead to "over-smoothing," where the model predicts an average, robotic voice rather than a specific expressive style. To combat this, models incorporate:
*   **Variation Modeling:** Explicitly inputting pitch, energy, and duration.
*   **Control & Transfer:** Allowing users to adjust style or transfer one speaker's prosody to another.
*   **Decoupling:** Separating content from style or timbre from noise for fine-grained control.

---

### 6. Adaptive TTS

Adaptive TTS (or Voice Cloning) aims to synthesize speech for any user with minimal data. This involves fine-tuning a source model (trained on many speakers) to a target voice using just a few samples. Research focuses on:
1.  **Generalization:** Improving the source model's ability to handle unseen speakers.
2.  **Efficiency:** Minimizing the required adaptation data and the number of parameters that need tuning.
