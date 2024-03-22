import { ApproachModule } from "./modules/approach";
import { ExerciseApproachModule } from "./modules/exerciseApproach";
import { TrainingExerciseApproachModule } from "./modules/trainingExerciseApproach";
import { TrainingModule } from "./modules/training";
import { ITraining } from "../entity/ITraining";
import { DBModule } from "./modules/module";
import { getExerciseById } from "../entity/IExercise";

export class Database extends DBModule {
  static async init() {
    await ApproachModule.createTable();
    await ExerciseApproachModule.createTable();
    await TrainingModule.createTable();
    await TrainingExerciseApproachModule.createTable();
  }

  private static async drop() {
    await ApproachModule.dropTable();
    await ExerciseApproachModule.dropTable();
    await TrainingModule.dropTable();
    await TrainingExerciseApproachModule.dropTable();
  }

  static async reset() {
    await this.drop();
    await this.init();
  }

  static async insertTraining(training: ITraining) {
    const idTraining = await TrainingModule.insert({
      name: training.name,
      date: training.date,
    });

    for (let i = 0; i < training.exercises.length; i++) {
      const exercise = training.exercises[i];
      const approachIds: number[] = [];
      const exerciseApproachModuleIds: number[] = [];

      for (let j = 0; j < exercise.approaches.length; j++) {
        const approach = exercise.approaches[j];

        approachIds.push(await ApproachModule.insert(approach));
      }

      for (let j = 0; j < approachIds.length; j++) {
        const idApproach = approachIds[j];

        exerciseApproachModuleIds.push(
          await ExerciseApproachModule.insert({
            idApproach,
            idExercise: exercise.exercise.id,
          }),
        );
      }

      for (let j = 0; j < exerciseApproachModuleIds.length; j++) {
        const exerciseApproachModuleId = exerciseApproachModuleIds[j];

        await TrainingExerciseApproachModule.insert({
          idExerciseApproach: exerciseApproachModuleId,
          idTraining,
        });
      }
    }
  }

  static async readTrainings() {
    const { rows } = await this.execut<{
      approach: number;
      date: string;
      id: number;
      id_exercise: number;
      id_exercise_approach: number;
      name: string;
      repetitions: number;
      weight: number;
    }>(`
    SELECT
      training.name,
      training.date,
      training.id,
      exercise_approach.id_exercise,
      exercise_approach.id as id_exercise_approach,
      approach.approach,
      approach.repetitions,
      approach.weight
    FROM training_exercise_approach
    JOIN training ON training_exercise_approach.id_training = training.id
    JOIN exercise_approach ON training_exercise_approach.id_exercise_approach = exercise_approach.id
    JOIN approach ON exercise_approach.id_approach = approach.id;
    `);

    const trainings: ITraining[] = [];

    rows.forEach((row) => {
      if (trainings.find((t) => t.id === row.id)) {
        return;
      }

      trainings.push({
        id: row.id,
        name: row.name,
        date: new Date(row.date),
        exercises: [],
      });
    });

    rows.forEach((row) => {
      const train = trainings.find((t) => t.id === row.id);
      const ex = getExerciseById(row.id_exercise);

      if (
        train &&
        ex &&
        !train.exercises.find((_ex) => _ex.exercise.id === ex.id)
      ) {
        train.exercises.push({
          id: train.exercises.length,
          exercise: ex,
          approaches: [],
        });
      }
    });

    rows.forEach((row) => {
      const train = trainings.find((t) => t.id === row.id);

      if (!train) {
        return;
      }

      const ex = train.exercises.find(
        (ex) => ex.exercise.id === row.id_exercise,
      );

      if (!ex) {
        return;
      }

      ex.approaches.push({
        id: row.id_exercise_approach,
        approaches: row.approach,
        repetitions: row.repetitions,
        weight: row.weight,
      });
    });

    return trainings;
  }
}
