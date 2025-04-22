import { Alarm } from "./data/alarm";

export type RootStackParamList = {
    Home: undefined;
    AlarmConfig: {alarm: Alarm};
    Tabs: undefined;
}