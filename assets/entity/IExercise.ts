import { ImagePropsBase } from "react-native";

const exercisesData: Record<string, IExercise> = {
  "1": {
    photo: require("../assets/exercise/1.jpg"),
    name: "Шраги со штангой",
    id: 1,
    count: 0,
  },
  "2": {
    photo: require("../assets/exercise/2.jpg"),
    name: "Шраги со штангой за спиной",
    id: 2,
    count: 0,
  },
  "3": {
    photo: require("../assets/exercise/3.jpg"),
    name: "Тяга штанги к подбородку",
    id: 3,
    count: 0,
  },
  "4": {
    photo: require("../assets/exercise/4.jpg"),
    name: "Жим штанги стоя",
    id: 4,
    count: 0,
  },
  "5": {
    photo: require("../assets/exercise/5.jpg"),
    name: "Жим штанги сидя",
    id: 5,
    count: 0,
  },
  "6": {
    photo: require("../assets/exercise/6.jpg"),
    name: "Жим гантелей сидя",
    id: 6,
    count: 0,
  },
  "7": {
    photo: require("../assets/exercise/7.jpg"),
    name: "Жим Арнольда",
    id: 7,
    count: 0,
  },
  "8": {
    photo: require("../assets/exercise/8.jpg"),
    name: "Разведение гантелей стоя",
    id: 8,
    count: 0,
  },
  "9": {
    photo: require("../assets/exercise/9.jpg"),
    name: "Подъем гантелей перед собой",
    id: 9,
    count: 0,
  },
  "10": {
    photo: require("../assets/exercise/10.jpg"),
    name: "Разведение гантелей в наклоне",
    id: 10,
    count: 0,
  },
  "11": {
    photo: require("../assets/exercise/11.jpg"),
    name: "Обратные разведения рук в тренажере",
    id: 11,
    count: 0,
  },
  "12": {
    photo: require("../assets/exercise/12.jpg"),
    name: "Подъем гантелей над головой через стороны",
    id: 12,
    count: 0,
  },
  "13": {
    photo: require("../assets/exercise/13.jpg"),
    name: "Подъем штанги на бицепс стоя",
    id: 13,
    count: 0,
  },
  "14": {
    photo: require("../assets/exercise/14.jpg"),
    name: "Молоток",
    id: 14,
    count: 0,
  },
  "15": {
    photo: require("../assets/exercise/15.jpg"),
    name: "Подъем гантелей на бицепс в скамье Скотта",
    id: 15,
    count: 0,
  },
  "16": {
    photo: require("../assets/exercise/16.jpg"),
    name: "Подъем на бицепс в блочном тренажере стоя",
    id: 16,
    count: 0,
  },
  "17": {
    photo: require("../assets/exercise/17.jpg"),
    name: "Сгибание рук на бицепс в кроссовере",
    id: 17,
    count: 0,
  },
  "18": {
    photo: require("../assets/exercise/18.jpg"),
    name: "Концентрированный подъем на бицепс",
    id: 18,
    count: 0,
  },
  "19": {
    photo: require("../assets/exercise/19.jpg"),
    name: "Подъем штанги на бицепс обратным хватом",
    id: 19,
    count: 0,
  },
  "20": {
    photo: require("../assets/exercise/20.jpg"),
    name: "Подъем гантелей на бицепс стоя",
    id: 20,
    count: 0,
  },
  "21": {
    photo: require("../assets/exercise/21.jpg"),
    name: "Подъем гантелей на бицепс сидя",
    id: 21,
    count: 0,
  },
  "22": {
    photo: require("../assets/exercise/22.jpg"),
    name: "Жим штанги узким хватом лежа",
    id: 22,
    count: 0,
  },
  "23": {
    photo: require("../assets/exercise/23.jpg"),
    name: "Отжимания от скамьи",
    id: 23,
    count: 0,
  },
  "24": {
    photo: require("../assets/exercise/24.jpg"),
    name: "Французский жим лежа",
    id: 24,
    count: 0,
  },
  "25": {
    photo: require("../assets/exercise/25.jpg"),
    name: "Французский жим EZ-штанги сидя",
    id: 25,
    count: 0,
  },
  "26": {
    photo: require("../assets/exercise/26.jpg"),
    name: "Французский жим в тренажере сидя",
    id: 26,
    count: 0,
  },
  "27": {
    photo: require("../assets/exercise/27.jpg"),
    name: "Жим книзу в блочном тренажере",
    id: 27,
    count: 0,
  },
  "28": {
    photo: require("../assets/exercise/28.jpg"),
    name: "Жим книзу одной рукой обратным хватом",
    id: 28,
    count: 0,
  },
  "29": {
    photo: require("../assets/exercise/29.jpg"),
    name: "Разгибание руки с гантелью из-за головы",
    id: 29,
    count: 0,
  },
  "30": {
    photo: require("../assets/exercise/30.jpg"),
    name: "Разгибания руки с гантелью в наклоне",
    id: 30,
    count: 0,
  },
  "31": {
    photo: require("../assets/exercise/31.jpg"),
    name: "Жим штанги лежа",
    id: 31,
    count: 0,
  },
  "32": {
    photo: require("../assets/exercise/32.jpg"),
    name: "Жим штанги лежа вверх",
    id: 32,
    count: 0,
  },
  "33": {
    photo: require("../assets/exercise/33.jpg"),
    name: "Жим штанги лежа вниз",
    id: 33,
    count: 0,
  },
  "34": {
    photo: require("../assets/exercise/34.jpg"),
    name: "Жим гантелей лежа",
    id: 34,
    count: 0,
  },
  "35": {
    photo: require("../assets/exercise/35.jpg"),
    name: "Жим гантелей лежа вверх",
    id: 35,
    count: 0,
  },
  "36": {
    photo: require("../assets/exercise/36.jpg"),
    name: "Жим гантелей лежа вниз",
    id: 36,
    count: 0,
  },
  "37": {
    photo: require("../assets/exercise/37.jpg"),
    name: "Жим от груди в тренажере сидя",
    id: 37,
    count: 0,
  },
  "38": {
    photo: require("../assets/exercise/38.jpg"),
    name: "Разведение гантелей лежа",
    id: 38,
    count: 0,
  },
  "39": {
    photo: require("../assets/exercise/39.jpg"),
    name: "Разведение гантелей лежа вверх",
    id: 39,
    count: 0,
  },
  "40": {
    photo: require("../assets/exercise/40.jpg"),
    name: "Сведения рук в тренажере ",
    id: 40,
    count: 0,
  },
  "41": {
    photo: require("../assets/exercise/41.jpg"),
    name: "Сведение в кроссовере через верхние блоки",
    id: 41,
    count: 0,
  },
  "42": {
    photo: require("../assets/exercise/42.jpg"),
    name: "Сведение в кроссовере через нижние блоки",
    id: 42,
    count: 0,
  },
  "43": {
    photo: require("../assets/exercise/43.jpg"),
    name: "Скручивания",
    id: 43,
    count: 0,
  },
  "44": {
    photo: require("../assets/exercise/44.jpg"),
    name: "Скручивания на римсокм стуле",
    id: 44,
    count: 0,
  },
  "45": {
    photo: require("../assets/exercise/45.jpg"),
    name: "Скручивания на скамье с наклоном вниз",
    id: 45,
    count: 0,
  },
  "46": {
    photo: require("../assets/exercise/46.jpg"),
    name: "Скручивания на коленях в блочном тренажере",
    id: 46,
    count: 0,
  },
  "47": {
    photo: require("../assets/exercise/47.jpg"),
    name: "Обратные скручивания",
    id: 47,
    count: 0,
  },
  "48": {
    photo: require("../assets/exercise/48.jpg"),
    name: "Подъем коленей в висе",
    id: 48,
    count: 0,
  },
  "49": {
    photo: require("../assets/exercise/49.jpg"),
    name: "Подъем ног в висе",
    id: 49,
    count: 0,
  },
  "50": {
    photo: require("../assets/exercise/50.jpg"),
    name: "Косые скручивания",
    id: 50,
    count: 0,
  },
  "51": {
    photo: require("../assets/exercise/51.jpg"),
    name: "Подтягивания на перекладине",
    id: 51,
    count: 0,
  },
  "52": {
    photo: require("../assets/exercise/52.jpg"),
    name: "Тяга штанги в наклоне",
    id: 52,
    count: 0,
  },
  "53": {
    photo: require("../assets/exercise/53.jpg"),
    name: "Тяга штанги в наклоне обратным хватом",
    id: 53,
    count: 0,
  },
  "54": {
    photo: require("../assets/exercise/54.jpg"),
    name: "Тяга Т-штанги",
    id: 54,
    count: 0,
  },
  "55": {
    photo: require("../assets/exercise/55.jpg"),
    name: "Тяга гантели одной рукой в наклоне",
    id: 55,
    count: 0,
  },
  "56": {
    photo: require("../assets/exercise/56.jpg"),
    name: "Вертикальная тяга широким хватом",
    id: 56,
    count: 0,
  },
  "57": {
    photo: require("../assets/exercise/57.jpg"),
    name: "Вертикальная тяга обратным хватом",
    id: 57,
    count: 0,
  },
  "58": {
    photo: require("../assets/exercise/58.jpg"),
    name: "Горизонтальная тяга в блочном тренажере",
    id: 58,
    count: 0,
  },
  "59": {
    photo: require("../assets/exercise/59.jpg"),
    name: "Пуловер в блочном тренажере стоя",
    id: 59,
    count: 0,
  },
  "60": {
    photo: require("../assets/exercise/60.jpg"),
    name: "Становая тяга",
    id: 60,
    count: 0,
  },
  "61": {
    photo: require("../assets/exercise/61.jpg"),
    name: "Наклоны со штангой на плечах",
    id: 61,
    count: 0,
  },
  "62": {
    photo: require("../assets/exercise/62.jpg"),
    name: "Приседания со штангой",
    id: 62,
    count: 0,
  },
  "63": {
    photo: require("../assets/exercise/63.jpg"),
    name: "Приседания в тренажере Смита",
    id: 63,
    count: 0,
  },
  "64": {
    photo: require("../assets/exercise/64.jpg"),
    name: "Приседания со штангой на груди в тренажере Смита",
    id: 64,
    count: 0,
  },
  "65": {
    photo: require("../assets/exercise/65.jpg"),
    name: "Гак-приседания",
    id: 65,
    count: 0,
  },
  "66": {
    photo: require("../assets/exercise/66.jpg"),
    name: "Жим ногами",
    id: 66,
    count: 0,
  },
  "67": {
    photo: require("../assets/exercise/67.jpg"),
    name: "Выпады со штангой",
    id: 67,
    count: 0,
  },
  "68": {
    photo: require("../assets/exercise/68.jpg"),
    name: "Вышагивания на платформу",
    id: 68,
    count: 0,
  },
  "69": {
    photo: require("../assets/exercise/69.jpg"),
    name: "Разгибания ног",
    id: 69,
    count: 0,
  },
  "70": {
    photo: require("../assets/exercise/70.jpg"),
    name: "Рывок штанги на грудь",
    id: 70,
    count: 0,
  },
  "71": {
    photo: require("../assets/exercise/71.jpg"),
    name: "Становая тяга на прямых ногах",
    id: 71,
    count: 0,
  },
  "72": {
    photo: require("../assets/exercise/72.jpg"),
    name: "Румынский подъем",
    id: 72,
    count: 0,
  },
  "73": {
    photo: require("../assets/exercise/73.jpg"),
    name: "Гиперэкстензия для мышц бедра",
    id: 73,
    count: 0,
  },
  "74": {
    photo: require("../assets/exercise/74.jpg"),
    name: "Сгибание ног лежа",
    id: 74,
    count: 0,
  },
  "75": {
    photo: require("../assets/exercise/75.jpg"),
    name: "Сгибания ног стоя",
    id: 75,
    count: 0,
  },
  "76": {
    photo: require("../assets/exercise/76.jpg"),
    name: "Сгибания ног сидя",
    id: 76,
    count: 0,
  },
  "77": {
    photo: require("../assets/exercise/77.jpg"),
    name: "Подъемы на носки стоя",
    id: 77,
    count: 0,
  },
  "78": {
    photo: require("../assets/exercise/78.jpg"),
    name: "Подъемы на носки в тренажере для жимов ногами",
    id: 78,
    count: 0,
  },
  "79": {
    photo: require("../assets/exercise/79.jpg"),
    name: "Подъемы на носки сидя",
    id: 79,
    count: 0,
  },
  "80": {
    photo: require("../assets/exercise/80.jpg"),
    name: "Подъемы носков",
    id: 80,
    count: 0,
  },
  "81": {
    photo: require("../assets/exercise/81.jpg"),
    name: "Сгибания рук в запястьях",
    id: 81,
    count: 0,
  },
  "82": {
    photo: require("../assets/exercise/82.jpg"),
    name: "Отжимания на брусьях",
    id: 82,
    count: 0,
  },
  "83": {
    photo: require("../assets/exercise/83.jpg"),
    name: "Отжимания от пола",
    id: 83,
    count: 0,
  },
  "84": {
    photo: require("../assets/exercise/84.jpg"),
    name: "Приседания",
    id: 84,
    count: 0,
  },
  "85": {
    photo: require("../assets/exercise/85.jpg"),
    name: "Выпады с гантелями",
    id: 85,
    count: 0,
  },
  "86": {
    photo: require("../assets/exercise/86.jpg"),
    name: "Разведение рук в нижнем кроссовере",
    id: 86,
    count: 0,
  },
  "87": {
    photo: require("../assets/exercise/87.jpg"),
    name: "Подъем ног в упоре на локтях",
    id: 87,
    count: 0,
  },
  "88": {
    photo: require("../assets/exercise/88.jpg"),
    name: "Подъем коленей в упоре на локтях",
    id: 88,
    count: 0,
  },
  "89": {
    photo: require("../assets/exercise/89.jpg"),
    name: "Поочередное сгибание рук с гантелями",
    id: 89,
    count: 0,
  },
  "90": {
    photo: require("../assets/exercise/90.jpg"),
    name: "Тяга нижнего блока к поясу сидя",
    id: 90,
    count: 0,
  },
  "91": {
    photo: require("../assets/exercise/91.jpg"),
    name: "Бег",
    id: 91,
    count: 0,
  },
  "92": {
    photo: require("../assets/exercise/92.jpg"),
    name: "Велотренажер",
    id: 92,
    count: 0,
  },
  "93": {
    photo: require("../assets/exercise/93.jpg"),
    name: "Пуловер",
    id: 93,
    count: 0,
  },
  "94": {
    photo: require("../assets/exercise/94.jpg"),
    name: "Шраги с гантелями",
    id: 94,
    count: 0,
  },
  "95": {
    photo: require("../assets/exercise/95.jpg"),
    name: "Подъем EZ-штанги на бицепс на скамье Скотта",
    id: 95,
    count: 0,
  },
} as const;

export function getExercises() {
  return Object.values(exercisesData);
}

export function getSortedExercises() {
  return getExercises().sort((a, b) => b.count - a.count);
}

export function getExerciseById(id: number) {
  return getExercises().find((ex) => ex.id === id);
}

export function removeDublicatest(
  items: {
    id: number;
    id_exercise: number;
  }[],
): number[] {
  const tmp: string[] = [];
  const res: number[] = [];

  items.forEach((item) => {
    const key = `${item.id}|${item.id_exercise}`;

    if (!tmp.includes(key)) {
      tmp.push(key);
      res.push(item.id_exercise);
    }
  });

  return res;
}

export function updateCounts(counts: number[]) {
  counts.forEach((id) => {
    if (exercisesData[id]) {
      exercisesData[id].count += 1;
    }
  });
}

export type IExercise = {
  id: number;
  name: string;
  photo: ImagePropsBase;
  count: number;
};
