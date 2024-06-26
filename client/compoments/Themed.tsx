/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

 import {
    Button as DefaultButton,
    Text as DefaultText,
    TextInput as DefaultTextInput,
    View as DefaultView,
  } from "react-native";
  
  import {COLORS} from "../constants/colors";
  import useColorScheme from "../config/useColorScheme";
  
  export function useThemeColor(
    props: { light?: string; dark?: string },
    colorName: keyof typeof COLORS.light & keyof typeof COLORS.dark
  ) {
    const theme = useColorScheme();
    const colorFromProps = props[theme];
  
    if (colorFromProps) {
      return colorFromProps;
    } else {
      return COLORS[theme][colorName];
    }
  }
  
  type ThemeProps = {
    lightColor?: string;
    darkColor?: string;
  };
  
  export type TextProps = ThemeProps & DefaultText["props"];
  export type ViewProps = ThemeProps & DefaultView["props"];
  export type TextInputProps = ThemeProps & DefaultTextInput["props"];
  export type ButtonProps = ThemeProps & DefaultButton["props"];
  
  export function Text(props: TextProps) {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  
    return <DefaultText style={[{ color }, style]} {...otherProps} />;
  }
  
  export function View(props: ViewProps) {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const backgroundColor = useThemeColor(
      { light: lightColor, dark: darkColor },
      "background"
    );
  
    return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
  }
  
  export function Card(props: ViewProps) {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const backgroundColor = useThemeColor(
      { light: lightColor, dark: darkColor },
      "card"
    );
  
    return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
  }
  
  export function Button(props: DefaultButton["props"]) {
    const color = useThemeColor({}, "primary");
    return <DefaultButton color={color} {...props} />;
  }
  
  export function TextInput(props: DefaultTextInput["props"]) {
    const { style, ...otherProps } = props;
    const color = useThemeColor({}, "text");
    const backgroundColor = useThemeColor({}, "card");
    const placeholderColor = useThemeColor(
      { light: "#6b7280", dark: "#e8e9ea" },
      "text"
    );
    const primary = useThemeColor({}, "primary");
    return (
      <DefaultTextInput
        style={[{ backgroundColor, color, fontSize: 16, padding: 8 }, style]}
        placeholderTextColor={placeholderColor}
        cursorColor={primary}
        selectionColor={primary}
        {...props}
      />
    );
  }