import { Alarm } from "./data/alarm";

export type RootStackParamList = {
    Auth: undefined;
    Main: undefined;
    Home: undefined;
    AlarmConfig: {alarm: Alarm};
    Tabs: undefined;
    Login: undefined;
    Register: undefined;
    Setting: undefined;
}