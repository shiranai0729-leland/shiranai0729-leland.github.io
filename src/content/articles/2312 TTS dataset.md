---
title: "A Curated List of Common TTS Datasets"
description: "A comprehensive and frequently updated list of publicly available datasets for Text-to-Speech (TTS) and Speech Synthesis research, categorized by language and modality."
pubDate: "Nov 16 2023"
tags: ["TTS", "Speech Synthesis", "Deep Learning", "Dataset"]
---

## Archived: Common Datasets for TTS

> This post will be updated frequently as more datasets are testified and included.

### Chinese-Mandarin

#### AISHELL-3

**Link:** [https://www.aishelltech.com/aishell_3](https://www.aishelltech.com/aishell_3)

AISHELL-3 is a large-scale, high-fidelity, multi-speaker Mandarin speech corpus suitable for training multi-speaker Text-to-Speech (TTS) systems.

-   **Corpus Size:** Approximately 85 hours, containing 88,035 utterances.
-   **Speakers:** 218 native Chinese Mandarin speakers from various accent regions.
-   **Recording Environment:** Recorded in a quiet room using a high-fidelity microphone (44.1kHz, 16bit).
-   **Annotations:** Includes professional pinyin and prosody annotations. The accuracy of characters and tones is above 98% after rigorous quality inspection.
-   **Metadata:** Speaker attributes such as gender, age group, and native accent are explicitly marked.

***

### English

#### LJ Speech Dataset

**Link:** [https://keithito.com/LJ-Speech-Dataset/](https://keithito.com/LJ-Speech-Dataset/)

A public domain speech dataset consisting of 13,100 short audio clips from a single speaker reading passages from 7 non-fiction books.

-   **Total Length:** Approximately 24 hours.
-   **Clip Length:** Varies from 1 to 10 seconds.
-   **Includes:** Transcription for each clip.

#### LibriTTS

**Link:** [https://research.google/resources/datasets/libri-tts/](https://research.google/resources/datasets/libri-tts/)

A multi-speaker English corpus of approximately 585 hours of read English speech, designed for TTS research. It is derived from the original materials of the LibriSpeech corpus.

-   **Sampling Rate:** 24kHz.
-   **Key Features:**
    1.  Speech is split at sentence breaks.
    2.  Includes both original and normalized texts.
    3.  Allows for the extraction of contextual information (e.g., neighboring sentences).
    4.  Excludes utterances with significant background noise.

***

### Multi-Language

#### Emotional Speech Database (ESD)

**Link:** [https://hltsingapore.github.io/ESD/](https://hltsingapore.github.io/ESD/)

ESD is an Emotional Speech Database designed for voice conversion research.

-   **Content:** 350 parallel utterances per speaker.
-   **Speakers:** 10 native English and 10 native Chinese speakers.
-   **Emotions:** Covers 5 emotion categories: neutral, happy, angry, sad, and surprise.
-   **Total Length:** Over 29 hours of speech data recorded in a controlled acoustic environment.
-   **Suitability:** Ideal for multi-speaker and cross-lingual emotional voice conversion studies.

***

### Multimodality

#### M3ED: Multi-modal Multi-scene Multi-label Emotional Dialogue Database

**Paper:** [https://aclanthology.org/2022.acl-long.391.pdf](https://aclanthology.org/2022.acl-long.391.pdf)
**Download:** [https://github.com/AIM3-RUC/RUCM3ED](https://github.com/AIM3-RUC/RUCM3ED)

Published at ACL 2022, M3ED is a large-scale, multi-modal, multi-scene, and multi-label emotional dialogue dataset for multimodal emotion recognition in conversations.

-   **Size:** Larger than MELD, with 24,449 utterances.
-   **Diversity:** Sourced from 56 different TV series (compared to MELD's single source).
-   **Quality:** Features balanced performance across all three modalities (text, audio, visual).
-   **Annotations:** Includes blended emotion annotations, which are not available in MELD.
-   **Language:** The first multimodal emotion dialogue dataset in Chinese, promoting cross-cultural emotion analysis.
-   **Framework:** The authors also propose a general Multimodal Dialog-aware Interaction framework that achieves state-of-the-art performance.

#### MELD: Multimodal EmotionLines Dataset

**Link:** [https://affective-meld.github.io/](https://affective-meld.github.io/)

MELD is an enhanced version of the EmotionLines dataset, incorporating audio and visual modalities alongside text.

-   **Content:** Over 1,400 dialogues and 13,000 utterances from the *Friends* TV series.
-   **Emotions:** Each utterance is labeled with one of seven emotions: Anger, Disgust, Sadness, Joy, Neutral, Surprise, and Fear.
-   **Sentiment:** Also includes sentiment annotations (positive, negative, and neutral) for each utterance.

#### CMU-MOSEI: Multimodal Opinion Sentiment and Emotion Intensity

**Link:** [http://multicomp.cs.cmu.edu/resources/cmu-mosei-dataset/](http://multicomp.cs.cmu.edu/resources/cmu-mosei-dataset/)

The largest dataset for multimodal sentiment analysis and emotion recognition to date.

-   **Content:** Over 23,500 sentence utterance videos from more than 1,000 online YouTube speakers.
-   **Diversity:** Gender-balanced, with sentences randomly chosen from various topics and monologue videos.
-   **Transcription:** Videos are transcribed and properly punctuated.

#### IEMOCAP: Interactive Emotional Dyadic Motion Capture Database

**Link:** [https://sail.usc.edu/iemocap/index.html](https://sail.usc.edu/iemocap/index.html)

An acted, multimodal, and multi-speaker database containing approximately 12 hours of audiovisual data.

-   **Data Types:** Includes video, speech, facial motion capture, and text transcriptions.
-   **Setting:** Consists of dyadic sessions where actors perform improvisations or scripted scenarios to elicit emotional expressions.
-   **Annotations:** Annotated with both categorical labels (anger, happiness, sadness, neutrality) and dimensional labels (valence, activation, dominance).
-   **Value:** The detailed motion capture, interactive setting, and large size make it a valuable resource for studying multimodal and expressive human communication.

***

### Beyond Databases

For information on preprocessing data using the Montreal Forced Aligner (MFA), please refer to my other post: [MFA: Montreal Forced Aligner](https://aucki6144.github.io/2023/09/10/MFA/)