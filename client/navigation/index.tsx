import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import Login from '../app/login/Login';
import { COLORS } from '../constants';

const Stack = createNativeStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.background,
  },
};

function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName='Login'
      screenOptions={{
        headerShown: false,
      }}

    >
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer theme={theme}>
      <RootNavigator />
    </NavigationContainer>
  );
}