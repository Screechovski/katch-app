export function prettyDate(dateString: string) {
    const date = new Date(dateString);
    const daysOfWeek = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
    const day = String(date.getDate()).padStart(2, '0');
    const monthNames = [
        'янв',
        'фев',
        'мар',
        'апр',
        'май',
        'июн',
        'июл',
        'авг',
        'сен',
        'окт',
        'ноя',
        'дек',
    ];
    const dayOfWeek = daysOfWeek[date.getDay()];
    let resultDate = `${dayOfWeek} ${day} ${monthNames[date.getMonth()]}`;
    if (new Date().getFullYear() !== date.getFullYear()) {
        resultDate += ` ${String(date.getFullYear()).substring(2, 4)}`;
    }
    return resultDate;
}
