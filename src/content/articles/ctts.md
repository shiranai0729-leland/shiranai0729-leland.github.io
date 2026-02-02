---
title: "Controllable Text-To-Speech with FastSpeech2"
description: "A summary of research on enhancing control over synthesized voice timbre, tone, and emotion while maintaining naturalness."
pubDate: "Jan 31 2026"
tags: ["ai", "nlp", "speech-synthesis"]
---

This is a final conclusion of my B.E graduation work, code is open-source at: https://github.com/aucki6144/ctts

## Introduction

Speech synthesis, the task of converting text into natural-sounding speech, is a central topic in AI, NLP, and speech processing. While recent advancements in deep learning have significantly improved the naturalness and robustness of speech synthesis, there are still challenges in controlling the nuances of synthesized speech, such as tone, pitch, and emotion. This blog post summarizes my research on developing a controllable speech synthesis system, which enhances control over the synthesized voice while maintaining naturalness.

Traditional speech synthesis systems, while capable of producing natural-sounding speech, struggle with fine control over attributes like speaking speed, pitch, and emotion. This limitation becomes evident in applications like voice-over for animation, emotional voice assistants, or speech therapy, where precise control over speech attributes is crucial. The aim of this research is to explore techniques that enable finer control of speech synthesis, creating a system capable of adjusting timbre, tone, and emotion based on user inputs.

## Related Work

Speech synthesis methods have evolved from statistical models to deep learning-based systems:

**Statistical Parametric Synthesis (SPSS):** This method, based on statistical models like HMMs, was a significant improvement over early concatenative methods. However, it still produced mechanical-sounding speech.

**Neural Network-Based Models:** The emergence of models like Tacotron2 and FastSpeech marked a shift towards neural approaches, which enhanced naturalness and efficiency. FastSpeech2, in particular, introduced variance adaptors for better control over pitch, energy, and duration, laying the groundwork for controllable synthesis.

**Controllable Models:** More recent models, such as NaturalSpeech2 and VITS, have aimed at zero-shot synthesis and emotional expressiveness, introducing mechanisms for fine-tuning speech attributes. However, these models often require extensive training and computational resources.

## Methodology

To address the challenges of controllable speech synthesis, my research involved developing two novel models built on top of the FastSpeech2 architecture:

**Multi-Embedding-Based Controllable Model:**

This model introduces speaker and emotion embeddings that are integrated into the hidden sequences of FastSpeech2. By encoding speaker and emotion information as one-hot vectors, it enables precise control over voice timbre and emotion.

The integration is achieved by aligning these embeddings with the hidden outputs of the encoder, allowing fine adjustments to the synthesized voice attributes.

**Conditional Layer Normalization (CLN) and Cross-Attention Model:**

CLN dynamically adjusts normalization parameters based on control embeddings, enhancing the model’s ability to generate voice attributes with greater fidelity.

Cross-attention is introduced to strengthen the impact of control embeddings, further improving the expressiveness of the generated speech.

A post-processing network refines the output to ensure compatibility with the HiFi-GAN vocoder, which synthesizes high-quality, natural-sounding audio.

## Experimental Results

Experiments were conducted on the LJSpeech and Emotion Speech Dataset (ESD):

**LJSpeech:** This dataset was used for pre-training the models. It helped improve the models’ generalization capabilities due to its longer audio samples.

**ESD:** This dataset, containing multiple emotions across five categories, was used for fine-tuning the models to evaluate emotional control.

### Performance Metrics

**Mel Cepstral Distortion (MCD):** Used to measure the difference between the synthesized and original audio at the spectral level, MCD provided an objective evaluation of the quality and naturalness of the generated speech.

**ECAPA-TDNN:** This speaker recognition model was employed to assess how well the synthesized speech matched the intended speaker characteristics, evaluating timbre preservation and identity consistency.

The results indicated that the proposed models achieved improved control over pitch, tone, and emotion while maintaining a natural sound, demonstrating better performance than traditional baseline models.

## Conclusion

This research successfully developed a controllable speech synthesis system that achieves a balance between expressiveness and naturalness. The integration of control embeddings, conditional normalization, and cross-attention mechanisms proved effective in enhancing the model's controllability. Future work will focus on refining these techniques for real-time applications and expanding the range of emotions and speaker characteristics that can be synthesized.