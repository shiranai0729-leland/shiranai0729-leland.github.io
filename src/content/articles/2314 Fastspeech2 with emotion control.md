---
title: "Fine-grained Emotional Control of Text-To-Speech: Learning To Rank Inter- And Intra-Class Emotion Intensities"
description: "A summary of the paper proposing a TTS model with fine-grained emotional control using a Rank model to capture inter- and intra-class emotion intensities."
pubDate: "Nov 21 2023"
tags: ["TTS", "Emotion Control", "FastSpeech2", "Rank Model"]
---

## TTS Emotional Control: Fine-Grained Emotional Control of Text-To-Speech: Learning To Rank Inter- And Intra-Class Emotion Intensities

Original Link: [arXiv: Fine-grained Emotional Control of Text-To-Speech: Learning To Rank Inter- And Intra-Class Emotion Intensities](https://arxiv.org/abs/2303.01508)

### Overview

In recent years, end-to-end TTS models have been able to synthesize high-quality speech with neutral emotions. However, these models have limitations in expressing emotional information. A straightforward strategy for emotional control is to condition on global emotion labels or use a single token or vector set to represent emotional information. These models often struggle to capture the subtle nuances in reference speech due to mismatches between the reference content or speaker and the synthesized speech, leading to poor control over the synthesized output.

A better approach for controllable TTS is to manually assign intensity labels at the word or phoneme level. In some works using intensity labels to control speech emotion, the underlying assumptions are: 1) speech samples from the same emotion category have similar rankings; 2) neutral emotion has the weakest intensity, while all other emotions rank higher than neutral. Although these methods can generate recognizable speech samples with different emotional intensity levels, they overlook intra-class distances, simply treating samples of the same category as identical even if they have different emotional intensities.

This paper ("Fine-Grained Emotional Control of Text-To-Speech") proposes a TTS model based on a Rank model that extracts emotional information by simultaneously considering inter-class and intra-class distances. It uses two samples augmented by Mixup, each being a mixture of the same non-neutral and neutral speech. By applying different weights to the non-neutral and neutral speech, one mixture contains more non-neutral components than the other. By training the model to rank these two mixtures, it not only determines the emotion category (inter-class distance) but also captures the amount of non-neutral emotion in the mixture (intra-class distance).

> Mixup: Beyond Empirical Risk Minimization
>
> Original Link: [arXiv](https://arxiv.org/abs/1710.09412)

### Rank Model

![Rank Model Structure](https://s2.loli.net/2023/09/17/g2A5QaBwcOMsD4j.png)

As shown in the figure above, the Rank Model maps speech into intensity representations and then outputs ranking scores based on emotional intensity. The input $X$ is a concatenation of the Mel-spectrogram, pitch contour, and energy. $X_{neu}$ is the input for neutral speech, and $X_{emo}$ is the input for non-neutral speech. After this, the pair $(X_{neu}, X_{emo})$ is processed using Mixup:
$$
X_{mix}^i = \lambda_i X_{emo} + (1 - \lambda_i) X_{neu} \\
X_{mix}^j = \lambda_j X_{emo} + (1 - \lambda_j) X_{neu} \\
\text{Where } \lambda_i \text{ and } \lambda_j \text{ are drawn from a Beta distribution } \text{Beta}(1, 1).
$$
The Intensity Extractor is then used to extract intensity representations. It first processes the input through a Feed-Forward Transformer (FFT) similar to FastSpeech2. Emotional information is then embedded into the FFT output to produce intensity representations $I_{mix}^i$ and $I_{mix}^j$. These embeddings come from a lookup table and depend on the emotion category of $X_{emo}$. From the intensity representations $I_{mix}^i$ and $I_{mix}^j$, these two sequences are averaged into two vectors $h_{mix}^i$ and $h_{mix}^j$, and the original Mixup loss is applied:
$$
L_{mixup} = L_i + L_j \quad \text{where} \\
L_i = \lambda_i \text{CE}(h_{mix}^i, y_{emo}) + (1 - \lambda_i) \text{CE}(h_{mix}^i, y_{neu}), \\
L_j = \lambda_j \text{CE}(h_{mix}^j, y_{emo}) + (1 - \lambda_j) \text{CE}(h_{mix}^j, y_{neu}),
$$
where CE denotes Cross Entropy loss, $y_{emo}$ is the label for non-neutral emotion, and $y_{neu}$ is the label for neutral emotion.

Mixup does not necessarily characterize intra-class distance well. Therefore, another loss is introduced to represent this relationship. First, a linear projection maps the pair $(h_{mix}^i, h_{mix}^j)$ to a pair of scalars $(r_{mix}^i, r_{mix}^j)$, where $r_{mix} \in \mathcal{R}^1$. $r_{mix}$ is a score indicating the degree of non-neutral emotion present in the prompt speech, i.e., intensity. To enable the model to predict the score correctly, the score difference is passed through a Sigmoid function:
$$
P^{ij} = \frac{1}{1 + e^{-(r_{mix}^i - r_{mix}^j)}}
$$
Then, Rank Loss is applied:
$$
L_{rank} = -\lambda_{diff} \log(P^{ij}) - (1 - \lambda_{diff}) \log(1 - P^{ij})
$$
where $\lambda_{diff}$ is the normalized result of $\lambda_i - \lambda_j$. That is: if $\lambda_i > \lambda_j$, then $\lambda_{diff} \in (0.5, 1)$; if $\lambda_i < \lambda_j$, then $\lambda_{diff} \in (0, 0.5)$; if $\lambda_i = \lambda_j$, then $\lambda_{diff} = 0.5$.

Finally, the model is trained using the total loss:
$$
L_{total} = \alpha L_{mixup} + \beta L_{rank}
$$
where $\alpha$ and $\beta$ are loss weights.

### TTS Model

Retaining the basic structure of FastSpeech2, the output of the Intensity Extractor is combined with the Encoder's output and fed into the Variance Adaptor.

> FastSpeech2: Fast And High-Quality End-To-End Text To Speech
>
> Original Link: [arXiv](https://arxiv.org/abs/2006.04558)
>
> Original Blog Post: [FastSpeech2 Note](https://aucki6144.github.io/2023/09/16/FastSpeech2%E7%AC%94%E8%AE%B0/)

![TTS Model Structure](https://s2.loli.net/2023/09/17/9QNB3cSsOtjWux8.png)
