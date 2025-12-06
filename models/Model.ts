export class Model {
    protected getString(p: any) {
        return String(p || '');
    }
    protected getNumber(p: any) {
        return Number(p || -1);
    }
    static toTypedArray<T extends { new (...args: any[]): any }>(
        arr: any,
        Class: T,
    ): InstanceType<T>[] {
        return (Array.isArray(arr) ? arr : []).map((item) => new Class(item));
    }
}
