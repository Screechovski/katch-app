-- подход
-- id
-- кол-во подходов
-- кол-во повторений
-- вес

CREATE TABLE IF NOT EXISTS approach (
  id integer primary key AUTOINCREMENT,
  approach integer NOT NULL,
  repetitions integer NOT NULL,
  weight integer NOT NULL
);

-- упражнение_подход
-- id
-- id упражнения
-- id подхода

CREATE TABLE IF NOT EXISTS exercise_approach (
  id integer primary key AUTOINCREMENT,
  id_approach integer NOT NULL,
  id_exercise integer NOT NULL,
  FOREIGN KEY(id) REFERENCES approach(id)
);

-- тренировка
-- id
-- date
-- name

CREATE TABLE IF NOT EXISTS training (
  id integer primary key AUTOINCREMENT,
  date text NOT NULL,
  name text NOT NULL
);

-- тренировка_упражнение_подход
-- id
-- id тренировки
-- id упражнение_подход

CREATE TABLE IF NOT EXISTS training_exercise_approach (
  id integer primary key AUTOINCREMENT,
  id_training integer NOT NULL,
  id_exercise_approach integer NOT NULL,
  FOREIGN KEY(id_training) REFERENCES training(id),
  FOREIGN KEY(id_exercise_approach) REFERENCES exercise_approach(id)
);

INSERT INTO approach (approach,repetitions,weight) VALUES (1, 12, 40);
INSERT INTO approach (approach,repetitions,weight) VALUES (1, 10, 50);
INSERT INTO approach (approach,repetitions,weight) VALUES (1, 8, 60);
INSERT INTO approach (approach,repetitions,weight) VALUES (1, 6, 70);

SELECT * from approach;

INSERT INTO exercise_approach (id_approach,id_exercise) VALUES (1, 12);

SELECT * from exercise_approach;

INSERT INTO training (date,name) VALUES ('2024-03-10T13:31:44.588Z', 'training_2024-03-10T13:31:44.588Z');

SELECT * FROM training;

INSERT INTO training_exercise_approach (id_training,id_exercise_approach) VALUES (1,1);

SELECT * FROM training_exercise_approach;

SELECT
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
JOIN approach ON exercise_approach.id_approach = approach.id;



