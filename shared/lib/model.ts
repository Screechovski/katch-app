export class Model {
    protected getString(p: any) {
        return String(p || '');
    }
    protected getNumber(p: any) {
        return Number(p || -1);
    }
}
