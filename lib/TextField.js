'use strict';
import React, {Component, PropTypes} from "react";
import {View, TextInput, StyleSheet, Text} from "react-native";

import Underline from './Underline';
import FloatingLabel from './FloatingLabel';

export default class TextField extends Component {
  constructor(props: Object, context: Object) {
    super(props, context);
    this.state = {
      isFocused: false,
      text: props.value,
      status: null,
    };
  }
  focus() {
    this.refs.input.focus();
  }
  blur() {
    this.refs.input.blur();
  }
  isFocused() {
    return this.state.isFocused;
  }
  componentWillReceiveProps(nextProps: Object){
    if(this.props.text !== nextProps.value){
      nextProps.value.length !== 0 ?
        this.refs.floatingLabel.floatLabel()
        : this.refs.floatingLabel.sinkLabel();
      this.setState({text: nextProps.value});
    }
  }
  render() {
    let {
      label,
      highlightColor,
      duration,
      labelColor,
      successHighlightColor,
      failHightlightColor,
      borderColor,
      textColor,
      textFocusColor,
      textBlurColor,
      onFocus,
      onBlur,
      onChangeText,
      value,
      dense,
      inputStyle,
      wrapperStyle,
      labelStyle,
      textValidate,
      errorColor,
      helperText,
      failHelperText,
      successHelperText,
      helperTextColor,
      isAlwaysShowHelperText,
      helperTextStyle,
      textLimit,
      ...props
    } = this.props;
    switch (this.state.status) {
      case true:
        highlightColor = successHighlightColor;
        helperTextColor = successHighlightColor;
        helperText = successHelperText;
        break;
      case null:
      break;
      default:
        highlightColor = failHightlightColor;
        helperTextColor = failHightlightColor;
        helperText = this.state.status;
        break;
    } 
    return (
      <View style={[dense ? styles.denseWrapper : styles.wrapper, wrapperStyle]} ref="wrapper">
        <TextInput
          style={[dense ? styles.denseTextInput : styles.textInput, {
            color: textColor
          }, (this.state.isFocused && textFocusColor) ? {
            color: textFocusColor
          } : {}, (!this.state.isFocused && textBlurColor) ? {
            color: textBlurColor
          } : {}, inputStyle]}
          onFocus={() => {
            this.setState({isFocused: true});
            this.refs.floatingLabel.floatLabel();
            this.refs.underline.expandLine();
            onFocus && onFocus();
          }}
          onBlur={() => {
            if (this.state.status === null) {
              this.setState({isFocused: false});
              !this.state.text.length && this.refs.floatingLabel.sinkLabel();
              this.refs.underline.shrinkLine();
              onBlur && onBlur();
            }
          }}
          onChangeText={(text) => {
            if (text.length >= textLimit) {
              this.setState({
                text: text.substr(0, textLimit),
              });
              return;
            }
            this.setState({text});
            onChangeText && onChangeText(text);
          }}
          onEndEditing={async () => {
            if (this.state.text) {
              if (textValidate) {
                const status = await textValidate(this.state.text);
                this.setState({
                  status,
                });
              }
            } else {
              this.setState({
                status: null,
              });
            }
          }}
          ref="input"
          value={this.state.text}
          {...props}
        />
        <Underline
          ref="underline"
          highlightColor={highlightColor}
          duration={duration}
          borderColor={borderColor}
        />
        <FloatingLabel
          isFocused={this.state.isFocused}
          ref="floatingLabel"
          focusHandler={this.focus.bind(this)}
          label={label}
          labelColor={labelColor}
          highlightColor={highlightColor}
          duration={duration}
          dense={dense}
          hasValue={(this.state.text.length) ? true : false}
          style={labelStyle}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {(isAlwaysShowHelperText || (this.state.isFocused && helperText && helperText.length > 0)) ?
            <Text style={[dense ? styles.denseHelperText : styles.helperText, helperTextStyle, { color: helperTextColor }]}>{helperText}</Text>
          : null}
          {(isAlwaysShowHelperText && textLimit) ?
            <Text style={[dense ? styles.denseHelperText : styles.helperText, helperTextStyle, { color: helperTextColor }]}>{`${this.state.text.length}/${textLimit}`}</Text>
          : null}
        </View>
      </View>
    );
  }
}

TextField.propTypes = {
  duration: PropTypes.number,
  label: PropTypes.string,
  highlightColor: PropTypes.string,
  labelColor: PropTypes.string,
  borderColor: PropTypes.string,
  textColor: PropTypes.string,
  textFocusColor: PropTypes.string,
  textBlurColor: PropTypes.string,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onChangeText: PropTypes.func,
  value: PropTypes.string,
  dense: PropTypes.bool,
  inputStyle: PropTypes.object,
  wrapperStyle: PropTypes.object,
  helperTextStyle: PropTypes.object,
  labelStyle: PropTypes.object,
  
  textValidate: PropTypes.func,
  isAlwaysShowHelperText: PropTypes.bool,
  helperText: PropTypes.string,
  successHelperText: PropTypes.string,
  successHighlightColor: PropTypes.string,
  failHighlightColor: PropTypes.string,
  failHelperText: PropTypes.object,
  helperTextColor: PropTypes.string,
  textLimit: PropTypes.number,
};

TextField.defaultProps = {
  duration: 200,
  labelColor: '#9E9E9E',
  successHighlightColor: 'green',
  failHightlightColor: 'red',
  borderColor: '#E0E0E0',
  textColor: '#000',
  helperTextColor: 'grey',
  value: '',
  dense: false,
  underlineColorAndroid: 'rgba(0,0,0,0)'
};

const styles = StyleSheet.create({
  wrapper: {
    height: 72,
    paddingTop: 30,
    paddingBottom: 7,
    position: 'relative'
  },
  denseWrapper: {
    height: 60,
    paddingTop: 28,
    paddingBottom: 4,
    position: 'relative'
  },
  textInput: {
    fontSize: 16,
    height: 34,
    lineHeight: 34
  },
  denseTextInput: {
    fontSize: 13,
    height: 27,
    lineHeight: 24,
    paddingBottom: 3
  },
  helperText: {
    marginTop: 7,
    color: 'grey',
    fontSize: 12,
  },
  denseHelperText: {
    marginTop: 3,
    color: 'grey',
    fontSize: 12,
  },
});
