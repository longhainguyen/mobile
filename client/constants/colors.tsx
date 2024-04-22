const primary = "#3bd08f";
const tintColorLight = primary;
const tintColorDark = primary;

const COLORS = {
    light: {
        text: "#111827",
        background: "#f3f4f6",
        card: "#fff",
        tint: tintColorLight,
        tabIconDefault: "#e5e7eb",
        tabIconSelected: tintColorLight,
        primary ,
      },
      dark: {
        text: "#fff",
        background: "#111827",
        card: "#374151",
        tint: tintColorDark,
        tabIconDefault: "#e5e7eb",
        tabIconSelected: tintColorDark,
        primary,
      },
    primary: '#F1E0E0',

    borderColor: '#EEEEEE',
    green: '#0F9804',
    textGrey: '#919191',
    black: '#1A1B23',
    shadowColor: '#000',

    gray: '#83829A',
    gray2: '#C1C0C8',

    white: '#FFF',
    lightWhite: '#FAFAFC',

    darkText: '#626262',

    redButton: '#EA5B5B',

    background: '#fff',

    black:'#000000'
};

const SIZES = {
    xSmall: 10,
    small: 12,
    medium: 16,
    large: 20,
    xLarge: 24,
    xxLarge: 32,
};

const SHADOWS = {
    small: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 2,
    },
    medium: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5.84,
        elevation: 5,
    },
};

export { COLORS, SIZES, SHADOWS };
