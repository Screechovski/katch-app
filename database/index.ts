import * as SQLite from "expo-sqlite";
import { createApproachModule } from "./modules/approach";
import { createExerciseApproachModule } from "./modules/exerciseApproach";
import { createTrainingExerciseApproachModule } from "./modules/trainingExerciseApproach";
import { createTrainingModule } from "./modules/training";
import { IDB } from "./types";

const dbExecuter = (command: string, params?: (string | number)[]) => {
  const db = SQLite.openDatabase("primary.db");

  return new Promise<Awaited<ReturnType<IDB>>>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        command,
        params,
        (_, result) => {
          resolve({
            id: result.insertId ?? -1,
            rows: result.rows._array,
          });
        },
        (_, error) => {
          reject(error);
          return false;
        },
      );
    });
  });
};

const approachModule = createApproachModule(dbExecuter);
const exerciseApproachModule = createExerciseApproachModule(dbExecuter);
const trainingModule = createTrainingModule(dbExecuter);
const trainingExerciseApproachModule =
  createTrainingExerciseApproachModule(dbExecuter);

export async function init() {
  await approachModule.createTable();
  await exerciseApproachModule.createTable();
  await trainingModule.createTable();
  await trainingExerciseApproachModule.createTable();
}

export async function drop() {
  await approachModule.dropTable();
  await exerciseApproachModule.dropTable();
  await trainingModule.dropTable();
  await trainingExerciseApproachModule.dropTable();
}

export async function reset() {
  await drop();
  await init();
}

// type IExecuter<T extends IExecuterT> = (
//   command: string,
//   params?: (string | number | null)[],
// ) => Promise<T>;
/*
export function createDatabase(dbExecuter: IExecuter<IExecuterT>) {
  function executerWrapper<T extends IExecuterT = unknown>(
    command: string,
    error: string,
    params: (string | number | null)[] = [],
  ) {
    return async () => {
      try {
        const res = await dbExecuter<T>(command, params);

        return res;
      } catch (err) {
        throw new Error(`${error}: ${err}`);
      }
    };
  }

  async function exec(command: string, error: string) {
    await executerWrapper(command, error);
  }

  async function read(command: string, error: string) {
    return await executerWrapper<>(command, error);
  }

  async function insert(
    command: string,
    error: string,
    params?: (string | number | null)[],
  ) {}

  return {
    dropApproachTable: executerWrapper(
      "DROP TABLE IF EXISTS approach;",
      "DROP approach",
    ),
    createApproachTable: executerWrapper(
      "CREATE TABLE IF NOT EXISTS approach (id integer primary key AUTOINCREMENT,approach integer NOT NULL,repetitions integer NOT NULL,weight integer NOT NULL);",
      "CREATE approach",
    ),
    dropExerciseApproachTable: executerWrapper(
      "DROP TABLE IF EXISTS exercise_approach;",
      "DROP exercise_approach",
    ),
    createExerciseApproachTable: executerWrapper(
      "CREATE TABLE IF NOT EXISTS exercise_approach (id integer primary key AUTOINCREMENT,id_approach integer NOT NULL,id_exercise integer NOT NULL,FOREIGN KEY(id) REFERENCES approach(id));",
      "CREATE exercise_approach",
    ),
    dropTrainingTable: executerWrapper(
      "DROP TABLE IF EXISTS training;",
      "DROP training",
    ),
    createTrainingTable: executerWrapper(
      "CREATE TABLE IF NOT EXISTS training (id integer primary key AUTOINCREMENT,date text NOT NULL,name text NOT NULL);",
      "CREATE training",
    ),
    dropTrainingExerciseApproachTable: executerWrapper(
      "DROP TABLE IF EXISTS training_exercise_approach;",
      "DROP training_exercise_approach",
    ),
    createTrainingExerciseApproachTable: executerWrapper(
      "CREATE TABLE IF NOT EXISTS training_exercise_approach (id integer primary key AUTOINCREMENT,id_training integer NOT NULL,id_exercise_approach integer NOT NULL,FOREIGN KEY(id_training) REFERENCES training(id),FOREIGN KEY(id_exercise_approach) REFERENCES exercise_approach(id));",
      "CREATE training_exercise_approach",
    ),
  };
}

export async function resetDatabase() {
  await dropDatabase();
  await initDatabase();
}

export async function dropDatabase() {
  try {
    await dropTrainingExerciseApproachTable();
    await dropTrainingTable();
    await dropExerciseApproachTable();
    await dropApproachTable();
  } catch (error) {
    throw new Error("DBError: " + error);
  }
}

export async function initDatabase() {
  try {
    await createApproachTable();
    await createExerciseApproachTable();
    await createTrainingTable();
    await createTrainingExerciseApproachTable();
  } catch (error) {
    throw new Error("DBError: " + error);
  }
}

type Approach = {
  id: number;
  weight: number;
  repetitions: number;
  approaches: number;
};

async function saveApproach(ap: Omit<Approach, "id">) {
  const executerRes = await dbExecuter(
    "INSERT INTO approach (approach,repetitions,weight) VALUES (?, ?, ?)",
    [ap.approaches, ap.repetitions, ap.weight],
  );

  return executerRes.insertId!; // FIXME number | undefined
}

type ExerciseApproach = {
  id: number;
  id_approach: number;
  id_exercise: number;
};

async function saveExerciseApproach(
  exericeApproach: Omit<ExerciseApproach, "id">,
) {
  const executerRes = await dbExecuter(
    "INSERT INTO exercise_approach (id_approach,id_exercise) VALUES (?, ?)",
    [exericeApproach.id_approach, exericeApproach.id_exercise],
  );

  return executerRes.insertId!; // FIXME number | undefined
}

type Training = {
  id: number;
  date: string;
  name: string;
};

async function saveTrainingOnly(train: Omit<Training, "id">) {
  const executerRes = await dbExecuter(
    "INSERT INTO training (date,name ) VALUES (?, ?)",
    [train.date, train.name],
  );

  return executerRes.insertId!; // FIXME number | undefined
}

type TrainingFinish = {
  id: number;
  id_training: number;
  id_exercise_approach: number;
};

async function saveTrainingEnd(train: Omit<TrainingFinish, "id">) {
  await dbExecuter(
    "INSERT INTO training_exercise_approach (id_training,id_exercise_approach) VALUES (?, ?)",
    [train.id_training, train.id_exercise_approach],
  );
}

export async function saveTraining(train: ITraining) {
  try {
    const trainOnlyId = await saveTrainingOnly({
      name: train.name,
      date: train.date.toISOString(),
    });

    for (const ex of train.exercises) {
      for (const ap of ex.approuch) {
        const approachId = await saveApproach(ap);

        const exerciseApproachId = await saveExerciseApproach({
          id_approach: approachId,
          id_exercise: ex.id,
        });

        await saveTrainingEnd({
          id_exercise_approach: exerciseApproachId,
          id_training: trainOnlyId,
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getTraining() {
  return await dbExecuter(`SELECT
training.name,
training.date,
training.id,
exercise_approach.id_exercise,
approach.approach,
approach.repetitions,
approach.weight
FROM training_exercise_approach
JOIN training ON training_exercise_approach.id_training = training.id
JOIN exercise_approach ON training_exercise_approach.id_exercise_approach = exercise_approach.id
JOIN approach ON exercise_approach.id_approach = approach.id;`);
}

export async function getTraining1() {
  try {
    return await dbExecuter("SELECT * FROM training;");
  } catch (error) {
    throw new Error("DBError: " + error);
  }
}

export async function getTrainingExerciseApproach() {
  try {
    return await dbExecuter("SELECT * FROM training_exercise_approach;");
  } catch (error) {
    throw new Error("DBError: " + error);
  }
}

export async function getExerciseApproaches() {
  try {
    return await dbExecuter("SELECT * FROM exercise_approach;");
  } catch (error) {
    throw new Error("DBError: " + error);
  }
}

export async function getApproaches() {
  try {
    return await dbExecuter("SELECT * FROM approach;");
  } catch (error) {
    throw new Error("DBError: " + error);
  }
}
*/
