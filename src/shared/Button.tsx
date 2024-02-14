import {
  StyleSheet,
  Text,
  TextProps,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import React from 'react';

export default function Button({
  containerProps,
  childProps,
}: {
  containerProps: TouchableOpacityProps;
  childProps: TextProps;
}) {
  const { style: buttonStyle, ...rest } = containerProps;
  const { style: textStyle, children } = childProps;
  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle]}
      {...rest}
      activeOpacity={0.8}
    >
      <Text style={[styles.buttonText, textStyle]}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    color: '#ddd',
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    width: '100%',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'teal',
    borderRadius: 8,
  },
});
