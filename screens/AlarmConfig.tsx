import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TextInput, Keyboard, TouchableOpacity, Button } from "react-native";
import Slider from "@react-native-community/slider";
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { Pressable } from "react-native";

interface AlarmConfigProps {
  data?: any;
}

type HomeScreenNavigationsProp = StackNavigationProp<RootStackParamList>

const AlarmConfig: React.FC<AlarmConfigProps> = ({ data }) => {

  const navigation = useNavigation<HomeScreenNavigationsProp>();

  const [volume, setVolume] = useState(50);

  const [time, setTime] = useState(['0','0','0','0']);
  const inputs = useRef<(TextInput | null)[]>([]);
  
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  const [questionCount, setQuestionCount] = useState(5);
  
  const [sound, setSound] = useState({
    title: "Réveil classique",
    volume: 50
  });

  const focusNextField = (index: number) => {
    if (index < 3 && inputs.current[index + 1]) {
      inputs.current[index + 1]?.focus();
    } else {
      Keyboard.dismiss();
    }
  };

  const handleTimeChange = (text: string, index: number) => {
    const newTime = [...time];

    if(text === '') {
      newTime[index] = '0';
      setTime(newTime);
      if (index > 0) inputs.current[index - 1]?.focus();
      return;
    }

    if (/^\d+$/.test(text)) {
      const num = parseInt(text, 10);
      
      if (index === 0 && num > 2) return;
      if (index === 1 && parseInt(time[0]) === 2 && num > 3) return;
      if (index === 2 && num > 5) return;

      newTime[index] = text;
      setTime(newTime);
      focusNextField(index);
    }
  };

  const formatTime = () => {
    return `${time[0]}${time[1]}:${time[2]}${time[3]}`;
  };

  const toggleDay = (index: number) => {
    setSelectedDays(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  return (
    <View style={styles.container}>
      {/* Arrow return data */}
      {/* <Pressable 
        onPress ={ () => navigation.navigate('Home') }
      >
        <Ionicons name="arrow-back-circle-outline" size={30} color="white" />
      </Pressable> */}
      {/* Time Picker */}
      <View style={styles.timeContainer}>
        <View style={styles.inputGroup}>
          {[0, 1].map((index) => (
            <TextInput
              key={`hour-${index}`}
              ref={ref => inputs.current[index] = ref}
              style={styles.input}
              value={time[index]}
              onChangeText={(text) => handleTimeChange(text, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
          
          <Text style={styles.separator}>:</Text>
          
          {[2, 3].map((index) => (
            <TextInput
              key={`minute-${index}`}
              ref={ref => inputs.current[index] = ref}
              style={styles.input}
              value={time[index]}
              onChangeText={(text) => handleTimeChange(text, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>
        <Text style={styles.timeDisplay}>{formatTime()}</Text>
      </View>

      {/* Days Selector */}
      <View style={styles.dayContainer}>
        {days.map((day, index) => (
          <TouchableOpacity 
            key={`day-${index}`}
            onPress={() => toggleDay(index)}
            style={[
              styles.dayButton,
              selectedDays.includes(index) && styles.selectedDay
            ]}
          >
            <Text style={[
              styles.dayText,
              selectedDays.includes(index) && styles.selectedDayText
            ]}>
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Question Count Selector */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>How many questions do you want to solve?</Text>
        {[5, 6, 7].map(count => (
          <TouchableOpacity
            key={`count-${count}`}
            style={[
              styles.optionButton,
              questionCount === count && styles.selectedOption
            ]}
            onPress={() => setQuestionCount(count)}
          >
            <Text style={styles.optionText}>
              {count} questions {count === 5 ? '🙎🏽' : count === 6 ? '💁🏼‍♀️' : '🗿'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sound Selector */}
      <View style={styles.sectionContainer}>
            <View style={styles.soundHeader}>
                <Text style={styles.sectionTitle}>Sound 🕺🏼</Text>
                <Text style={styles.soundTitle}>{sound.title}</Text>
            </View>
            <View style={styles.soundSlider}>
                <AntDesign name="sound" size={25} color="white" />
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={100}
                    value={volume}
                    onValueChange={(value) => setVolume(value)}
                    minimumTrackTintColor="#81b0ff"
                    maximumTrackTintColor="#ccc"
                    thumbTintColor="#fff"
                />
            </View>
            {/* Slider  */}
      </View>

      {/* Saving button */}
        <Pressable
            style={styles.saveButton}
        >
            <Text style={styles.saveButtonText} >Save</Text>
        </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1F1B1B",
    flex: 1,
    padding: 20,
    overflow: "scroll",
  },
  timeContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    width: 50,
    height: 70,
    backgroundColor: '#3D3636',
    color: 'white',
    fontSize: 32,
    textAlign: 'center',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  separator: {
    fontSize: 32,
    color: 'white',
    marginHorizontal: 5,
  },
  timeDisplay: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
  },
  dayContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#3D3636",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton:{
    backgroundColor: 'blue',
    width: '40%',
    borderRadius:5,
    height: 40,
    alignSelf: "center",
  },
  saveButtonText:{
    color: "white",
    textAlign:"center",
    fontSize: 16,
    paddingTop: 10,
    zIndex:500,
  },
  selectedDay: {
    backgroundColor: '#FFFFFF',
  },
  dayText: {
    color: 'white',
    fontSize: 16,
  },
  selectedDayText: {
    color: '#1F1B1B',
    fontWeight: 'bold',
  },
  sectionContainer: {
    backgroundColor: "#3D3636",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    flexDirection: "column",
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  slider:{
    width: "80%",
    height:40,
  },
  soundHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  soundSlider:{
    marginVertical: 5,
    //marginRight: 10,
    justifyContent:"space-between",
    flexDirection: "row",
  },
  soundTitle: {
    color: 'white',
    fontSize: 16,
  },
  optionButton: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#555',
  },
  selectedOption: {
    backgroundColor: '#555',
    borderRadius: 5,
  },
  optionText: {
    color: 'white',
    fontSize: 16,
  },
});

export default AlarmConfig; 





// hourPicker: {
//     height: 150, // Hauteur visible
//     justifyContent: "center",
//     paddingTop: ITEM_HEIGHT,
//     paddingBottom: ITEM_HEIGHT,
//   },
//   item: {
//     height: ITEM_HEIGHT,
//     fontSize: 24,
//     color: "grey",
//     textAlign: "center",
//     textAlignVertical:"center",
//   },
//   minutePicker: {
//     height: 150, // Hauteur visible
//     justifyContent: "center",
//     paddingTop: ITEM_HEIGHT,
//     paddingBottom: ITEM_HEIGHT,
//   },
//   pickerWrapper: {
//     height: PICKER_HEIGHT, // Hauteur visible
//     justifyContent: "center",
//     overflow: 'hidden',
//     width: 80,
//   },
//   scrollContent: {
//       paddingTop: ITEM_HEIGHT,
//       paddingBottom: ITEM_HEIGHT,
//   },
//   selectedItem: {
//     color: "white",
//     fontSize: 28,
//     fontWeight: "bold",
//   },
//   separatorBottom: {
//       position: "absolute",
//       backgroundColor: 'rgba(255,255,255,0.5)',
//       bottom: ITEM_HEIGHT,
//       height: 1,
//       left:0,
//       right:0,
//       top: 50, 
//       //width: "100%",
//       zIndex:1,
//   },
//   separatorTop: {
//     position: "absolute",
//     backgroundColor: 'rgba(255,255,255,0.5)',
//     height: 1,
//     left:0,
//     right:0,
//     top: ITEM_HEIGHT, 
//     //width: "100%",
//     zIndex:1,
//   },
//   timePickerContainer: {
//     alignItems: "center",
//     backgroundColor: "#3D3636",
//     flexDirection: "row",
//     justifyContent: "center",
//     marginVertical: 20,
//     paddingVertical:10,
//     //overflow: "hidden",
//   },
//   timeSeparator: {
//       fontSize: 24,
//       color: 'white',
//       marginHorizontal: 5,
//       fontWeight:"bold",
//   },
// const ITEM_HEIGHT = 50;
// const VISIBLE_ITEMS = 3;
// const PICKER_HEIGHT = VISIBLE_ITEMS * ITEM_HEIGHT;

// const AlarmConfig: React.FC<AlarmConfigProps> = ({ data }) => {
//   const [selectedHourIndex, setSelectedHourIndex] = useState(0);
//   const [selectedMinuteIndex, setSelectedMinuteIndex] = useState(0);

//   const hoursScrollRef = useRef<ScrollView>(null);
//   const minutesScrollRef = useRef<ScrollView>(null);

//   const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
//   const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

//   const handleHoursScrollEnd = (event: any) => {
//     const offsetY = event.nativeEvent.contentOffset.y;
//     const index = Math.round(offsetY / ITEM_HEIGHT);
//     setSelectedHourIndex(index);
//     hoursScrollRef.current?.scrollTo(
//         {
//             y: index * ITEM_HEIGHT,
//             animated: true,
//         }
//     );
//   };
//   const handleMinutesScrollEnd = (event: any) => {
//     const offsetY = event.nativeEvent.contentOffset.y;
//     const index = Math.round(offsetY / ITEM_HEIGHT);
//     setSelectedMinuteIndex(index);
//     minutesScrollRef.current?.scrollTo(
//         {
//             y: index * ITEM_HEIGHT,
//             animated: true,
//         }
//     );
//   };

// {/* TIME PICKER */}
// <View style={styles.timePickerContainer}>
// {/* Hours */}
// <View style={styles.pickerWrapper}>
//   <View style={styles.separatorTop} />
//     <ScrollView
//         ref={hoursScrollRef}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//         snapToInterval={ITEM_HEIGHT}
//         decelerationRate="fast"
//         onMomentumScrollEnd={handleHoursScrollEnd}
//     >
//         {hours.map((item, index) => (
//         <Text
//         key={`hour-${index}`}
//         style={[
//           styles.item,
//           selectedHourIndex === index && styles.selectedItem, 
//         ]}
//         >
//             {item}
//         </Text>
//     ))}
//     </ScrollView>
//     <View style={styles.separatorBottom} />
// </View>

// {/* Separator */}
// <Text style={styles.timeSeparator}>:</Text>

// {/* Minutes */}
// <View style={styles.pickerWrapper}>
//   <View style={styles.separatorTop} />
//     <ScrollView
//         ref={minutesScrollRef}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//         snapToInterval={ITEM_HEIGHT}
//         decelerationRate="fast"
//         onMomentumScrollEnd={handleMinutesScrollEnd}
//     >
//         {minutes.map((item, index) => (
//         <Text
//             key={`minute-${index}`}
//             style={[
//             styles.item,
//             selectedMinuteIndex === index && styles.selectedItem, // Appliquer le style conditionnel
//         ]}
//         >
//             {item}
//         </Text>
//         ))}
//     </ScrollView>
//   <View style={styles.separatorBottom} />
// </View>
// </View>
