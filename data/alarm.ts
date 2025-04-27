export interface Alarm {
    id: number;
    time: string;
    isActive: boolean;
    testSubject: string;
    workingDay : number[];
    smartWakeUp: boolean;
} 


export const initialAlarm: Alarm[] = [];