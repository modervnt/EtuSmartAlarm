export interface Alarm {
    id: number;
    time: string;
    isActive: boolean;
    testSubject: string;
    workingDay : number[];
} 


export const initialAlarm: Alarm[] = [];