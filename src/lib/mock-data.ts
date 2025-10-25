import type { Paper, Collection } from '@/lib/types';

export const mockPapers: Paper[] = [
  {
    id: '1',
    title: 'Attention Is All You Need',
    authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit', 'Llion Jones', 'Aidan N. Gomez', 'Łukasz Kaiser', 'Illia Polosukhin'],
    publicationDate: '2017-06-12',
    abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks... We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.',
    citations: 60000,
    url: 'https://arxiv.org/abs/1706.03762',
    tags: ['NLP', 'Transformers', 'Machine Learning'],
  },
  {
    id: '2',
    title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
    authors: ['Jacob Devlin', 'Ming-Wei Chang', 'Kenton Lee', 'Kristina Toutanova'],
    publicationDate: '2018-10-11',
    abstract: 'We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations from unlabeled text...',
    citations: 50000,
    url: 'https://arxiv.org/abs/1810.04805',
    tags: ['NLP', 'BERT', 'Pre-training'],
  },
  {
    id: '3',
    title: 'Deep Residual Learning for Image Recognition',
    authors: ['Kaiming He', 'Xiangyu Zhang', 'Shaoqing Ren', 'Jian Sun'],
    publicationDate: '2015-12-10',
    abstract: 'Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training of networks that are substantially deeper than those used previously. We explicitly reformulate the layers as learning residual functions...',
    citations: 120000,
    url: 'https://arxiv.org/abs/1512.03385',
    tags: ['Computer Vision', 'Deep Learning', 'ResNet'],
  },
  {
    id: '4',
    title: 'Generative Adversarial Nets',
    authors: ['Ian J. Goodfellow', 'Jean Pouget-Abadie', 'Mehdi Mirza', 'Bing Xu', 'David Warde-Farley', 'Sherjil Ozair', 'Aaron Courville', 'Yoshua Bengio'],
    publicationDate: '2014-06-10',
    abstract: 'We propose a new framework for estimating generative models via an adversarial process, in which we simultaneously train two models: a generative model G that captures the data distribution, and a discriminative model D that estimates the probability that a sample came from the training data rather than G.',
    citations: 70000,
    url: 'https://arxiv.org/abs/1406.2661',
    tags: ['GANs', 'Generative Models', 'Unsupervised Learning'],
  },
    {
    id: '5',
    title: 'Mastering the game of Go with deep neural networks and tree search',
    authors: ['David Silver', 'Aja Huang', 'Chris J. Maddison', 'Arthur Guez', 'Laurent Sifre', 'George van den Driessche', 'Julian Schrittwieser', 'Ioannis Antonoglou'],
    publicationDate: '2016-01-28',
    abstract: 'The game of Go has long been viewed as the most challenging of classic games for artificial intelligence. Here we report on a program that can play Go at a professional level, by combining deep neural networks with a novel tree search algorithm.',
    citations: 25000,
    url: 'https://www.nature.com/articles/nature16961',
    tags: ['Reinforcement Learning', 'AI', 'Game Theory'],
  },
];

export const mockCollections: Collection[] = [
    {
        id: 'c1',
        name: 'Transformer Architectures',
        description: 'Papers related to the Transformer model and its variants.',
        paperCount: 2,
        lastUpdated: '2 days ago',
    },
    {
        id: 'c2',
        name: 'Computer Vision Breakthroughs',
        description: 'Foundational papers in modern computer vision.',
        paperCount: 1,
        lastUpdated: '1 week ago',
    },
    {
        id: 'c3',
        name: 'Generative AI Reading List',
        description: 'Key papers in the field of generative models.',
        paperCount: 1,
        lastUpdated: '3 weeks ago',
    }
];
