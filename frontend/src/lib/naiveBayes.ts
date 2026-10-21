import { ML_TRAINING_DATA, TrainingCase } from '../data/mlTrainingData';
import { MLPrediction } from '../types';

export class NaiveBayesClassifier {
  private wordProb: Record<string, Record<string, number>> = {};
  private classProb: Record<string, number> = {};
  private urgencyMap: Record<string, 'emergency' | 'urgent' | 'routine'> = {};
  private classes: string[] = [];

  constructor() {
    this.train(ML_TRAINING_DATA);
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 2);
  }

  public train(data: TrainingCase[]): void {
    const classCount: Record<string, number> = {};
    const wordCount: Record<string, Record<string, number>> = {};

    data.forEach(({ t, l, u }) => {
      classCount[l] = (classCount[l] || 0) + 1;
      this.urgencyMap[l] = u;
      if (!wordCount[l]) wordCount[l] = {};
      this.tokenize(t).forEach((w) => {
        wordCount[l][w] = (wordCount[l][w] || 0) + 1;
      });
    });

    this.classes = Object.keys(classCount);
    const totalDocs = data.length;
    const vocab = new Set(data.flatMap((d) => this.tokenize(d.t))).size;

    this.classes.forEach((c) => {
      this.classProb[c] = Math.log(classCount[c] / totalDocs);
      const totalWords = Object.values(wordCount[c]).reduce((a, b) => a + b, 0);
      this.wordProb[c] = {};
      Object.keys(wordCount[c]).forEach((w) => {
        this.wordProb[c][w] = Math.log((wordCount[c][w] + 1) / (totalWords + vocab));
      });
      // Unknown word smoothing
      this.wordProb[c].__unknown = Math.log(1 / (totalWords + vocab));
    });
  }

  public predict(text: string): MLPrediction {
    const tokens = this.tokenize(text);
    const scores: Record<string, number> = {};

    this.classes.forEach((c) => {
      let score = this.classProb[c];
      tokens.forEach((w) => {
        score += this.wordProb[c][w] || this.wordProb[c].__unknown;
      });
      scores[c] = score;
    });

    const maxScore = Math.max(...Object.values(scores));
    let sumExp = 0;
    const expScores: Record<string, number> = {};

    Object.keys(scores).forEach((c) => {
      expScores[c] = Math.exp(scores[c] - maxScore);
      sumExp += expScores[c];
    });

    const sorted = Object.entries(expScores).sort((a, b) => b[1] - a[1]);
    const best = sorted[0][0];

    return {
      label: best,
      urgency: this.urgencyMap[best] || 'routine',
      confidence: Math.round((expScores[best] / sumExp) * 100),
      top3: sorted.slice(0, 3).map(([l, expVal]) => ({
        label: l,
        pct: Math.round((expVal / sumExp) * 100)
      }))
    };
  }
}

export const ML = new NaiveBayesClassifier();
