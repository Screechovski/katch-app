import * as SQLite from "expo-sqlite";
import { IPhysicalExercise } from "./entity/PhysicalExercise";

const db = SQLite.openDatabase("primary.db");

export const initDatabase = () =>
  new Promise<void>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS physical_exercise (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          image TEXT NOT NULL
        );
        INSERT INTO physical_exercise (name, image) VALUES
          ("Шраги со штангой", "1.jpg"),
          ("Шраги со штангой за спиной", "2.jpg"),
          ("Тяга штанги к подбородку", "3.jpg"),
          ("Жим штанги стоя", "4.jpg"),
          ("Жим штанги сидя", "5.jpg"),
          ("Жим гантелей сидя", "6.jpg"),
          ("Жим Арнольда", "7.jpg"),
          ("Разведение гантелей стоя", "8.jpg"),
          ("Подъем гантелей перед собой", "9.jpg"),
          ("Разведение гантелей в наклоне", "10.jpg"),
          ("Обратные разведения рук в тренажере", "11.jpg"),
          ("Подъем гантелей над головой через стороны", "12.jpg"),
          ("Подъем штанги на бицепс стоя", "13.jpg"),
          ("Молоток", "14.jpg"),
          ("Подъем гантелей на бицепс в скамье Скотта", "15.jpg"),
          ("Подъем на бицепс в блочном тренажере стоя", "16.jpg"),
          ("Сгибание рук на бицепс в кроссовере", "17.jpg"),
          ("Концентрированный подъем на бицепс", "18.jpg"),
          ("Подъем штанги на бицепс обратным хватом", "19.jpg"),
          ("Подъем гантелей на бицепс стоя", "20.jpg"),
          ("Подъем гантелей на бицепс сидя", "21.jpg"),
          ("Жим штанги узким хватом лежа", "22.jpg"),
          ("Отжимания от скамьи", "23.jpg"),
          ("Французский жим лежа", "24.jpg"),
          ("Французский жим EZ-штанги сидя", "25.jpg"),
          ("Французский жим в тренажере сидя", "26.jpg"),
          ("Жим книзу в блочном тренажере", "27.jpg"),
          ("Жим книзу одной рукой обратным хватом", "28.jpg"),
          ("Разгибание руки с гантелью из-за головы", "29.jpg"),
          ("Разгибания руки с гантелью в наклоне", "30.jpg"),
          ("Жим штанги лежа", "31.jpg"),
          ("Жим штанги лежа вверх", "32.jpg"),
          ("Жим штанги лежа вниз", "33.jpg"),
          ("Жим гантелей лежа", "34.jpg"),
          ("Жим гантелей лежа вверх", "35.jpg"),
          ("Жим гантелей лежа вниз", "36.jpg"),
          ("Жим от груди в тренажере сидя", "37.jpg"),
          ("Разведение гантелей лежа", "38.jpg"),
          ("Разведение гантелей лежа вверх", "39.jpg"),
          ("Сведения рук в тренажере ", "40.jpg"),
          ("Сведение в кроссовере через верхние блоки", "41.jpg"),
          ("Сведение в кроссовере через нижние блоки", "42.jpg"),
          ("Скручивания", "43.jpg"),
          ("Скручивания на римсокм стуле", "44.jpg"),
          ("Скручивания на скамье с наклоном вниз", "45.jpg"),
          ("Скручивания на коленях в блочном тренажере", "46.jpg"),
          ("Обратные скручивания", "47.jpg"),
          ("Подъем коленей в висе", "48.jpg"),
          ("Подъем ног в висе", "49.jpg"),
          ("Косые скручивания", "50.jpg"),
          ("Подтягивания на перекладине", "51.jpg"),
          ("Тяга штанги в наклоне", "52.jpg"),
          ("Тяга штанги в наклоне обратным хватом", "53.jpg"),
          ("Тяга Т-штанги", "54.jpg"),
          ("Тяга гантели одной рукой в наклоне", "55.jpg"),
          ("Вертикальная тяга широким хватом", "56.jpg"),
          ("Вертикальная тяга обратным хватом", "57.jpg"),
          ("Горизонтальная тяга в блочном тренажере", "58.jpg"),
          ("Пуловер в блочном тренажере стоя", "59.jpg"),
          ("Становая тяга", "60.jpg"),
          ("Наклоны со штангой на плечах", "61.jpg"),
          ("Приседания со штангой", "62.jpg"),
          ("Приседания в тренажере Смита", "63.jpg"),
          ("Приседания со штангой на груди в тренажере Смита", "64.jpg"),
          ("Гак-приседания", "65.jpg"),
          ("Жим ногами", "66.jpg"),
          ("Выпады со штангой", "67.jpg"),
          ("Вышагивания на платформу", "68.jpg"),
          ("Разгибания ног", "69.jpg"),
          ("Рывок штанги на грудь", "70.jpg"),
          ("Становая тяга на прямых ногах", "71.jpg"),
          ("Румынский подъем", "72.jpg"),
          ("Гиперэкстензия для мышц бедра", "73.jpg"),
          ("Сгибание ног лежа", "74.jpg"),
          ("Сгибания ног стоя", "75.jpg"),
          ("Сгибания ног сидя", "76.jpg"),
          ("Подъемы на носки стоя", "77.jpg"),
          ("Подъемы на носки в тренажере для жимов ногами", "78.jpg"),
          ("Подъемы на носки сидя", "79.jpg"),
          ("Подъемы носков", "80.jpg"),
          ("Сгибания рук в запястьях", "81.jpg"),
          ("Отжимания на брусьях", "82.jpg"),
          ("Отжимания от пола", "83.jpg"),
          ("Приседания", "84.jpg"),
          ("Выпады с гантелями", "85.jpg"),
          ("Разведение рук в нижнем кроссовере", "86.jpg"),
          ("Подъем ног в упоре на локтях", "87.jpg"),
          ("Подъем коленей в упоре на локтях", "88.jpg"),
          ("Поочередное сгибание рук с гантелями", "89.jpg"),
          ("Тяга нижнего блока к поясу сидя", "90.jpg"),
          ("Бег", "91.jpg"),
          ("Велотренажер", "92.jpg"),
          ("Пуловер", "93.jpg"),
          ("Шраги с гантелями", "94.jpg"),
          ("Подъем EZ-штанги на бицепс на скамье Скотта", "95.jpg");
        `,
        [],
        () => resolve(),
        (_, error) => {
          reject(new Error("Failed initing db"));
          return false;
        }
      );
    });
  });

export const getPhysicalExercises = () =>
  new Promise<IPhysicalExercise[]>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM physical_exercise",
        [],
        (_, result) => {
          const items: IPhysicalExercise[] = [];

          for (let i = 0; i < result.rows.length; i++) {
            items.push({
              id: result.rows.item(i).id,
              name: result.rows.item(i).name,
              photo: result.rows.item(i).image,
            });
          }
          resolve(items);
        },
        (_, error) => {
          reject(new Error(error.message));
          return false;
        }
      );
    });
  });
