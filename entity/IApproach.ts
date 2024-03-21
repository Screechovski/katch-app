export class IApproach {
  id: number;
  weight: number;
  repetitions: number;
  approaches: number;

  constructor(
    options: Partial<{
      id: number;
      weight: number;
      repetitions: number;
      approaches: number;
    }>,
  ) {
    this.id = options.id ?? new Date().getTime();
    this.weight = options.weight ?? 40;
    this.repetitions = options.repetitions ?? 8;
    this.approaches = options.approaches ?? 4;
  }
}
