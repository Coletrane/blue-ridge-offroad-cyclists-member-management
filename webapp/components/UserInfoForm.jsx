import React from "react"
import TextField from "@material-ui/core/TextField"
import NativeSelect from "@material-ui/core/NativeSelect"
import InputAdornment from "@material-ui/core/InputAdornment"

import styled from "styled-components"
import PropTypes from "prop-types"

import usStates from "../util/state-codes.json"
import { userInfoFormSubmit } from "../util/event-types"

import isEmail from "validator/lib/isEmail"
import isPostalCode from "validator/lib/isPostalCode"
import isMobilePhone from "validator/lib/isMobilePhone"

class UserInfoForm extends React.Component {
  static propTypes = {
    onValidate: PropTypes.func,
    email: PropTypes.string,
    name: PropTypes.string,
    phone: PropTypes.number,
    address: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    zipCode: PropTypes.string,
    registering: PropTypes.bool,
    forgotPassword: PropTypes.bool
  }

  constructor(props) {
    super(props)
    this.state = {
      email: this.props.email,
      emailValid: false,
      password: "",
      passwordValid: false,
      phone: this.props.phone,
      phoneValid: false,
      name: this.props.name,
      nameValid: false,
      address: this.props.address,
      addressValid: false,
      city: this.props.city,
      cityValid: false,
      state: usStates.find(state => state.abbreviation === "VA"),
      zipCode: this.props.zipCode,
      zipCodeValid: false,
      formSubmitted: false,
    }
    this.validateInput = this.validateInput.bind(this)
  }

  componentDidMount() {
    if (process.browser) {
      document.addEventListener(userInfoFormSubmit, this.validateInput)
    }
  }

  componentWillUnmount() {
    if (process.browser) {
      document.removeEventListener(userInfoFormSubmit, this.validateInput)
    }
  }

  validateInput = () => {
    const specialCharacters = /[ !@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/
    const newState = {
      emailValid: isEmail(this.state.email || " "),
      passwordValid:
        this.state.password.length >= 8 &&
        specialCharacters.test(this.state.password),
      phoneValid: isMobilePhone(this.state.phone || " ", "en-US"),
      nameValid: this.state.name.split(" ").length > 1,
      addressValid: this.state.address,
      cityValid: this.state.city,
      zipCodeValid: isPostalCode(this.state.zipCode || " ", "US")
    }

    newState.formSubmitted = true

    this.setState(newState, this.props.onValidate({
      ...newState,
      ...this.state
    }))
  }

  handleBasicInput = event => {
    this.setState({
      [event.target.id]: event.target.value
    })
  }

  handlePhoneInput = event => {
    this.setState({
      phone: `+1${event.target.value}`
    })
  }

  componentDidUpdate() {
    if (
      this.props.email !== this.state.email &&
      this.props.name !== this.state.name
    ) {
      this.setState({
        email: this.props.email,
        name: this.props.name
      })
    }
  }

  render() {
    return (
      <UserInfoFormWrapper fullWidth={this.props.forgotPassword}>
        <TextField
          autoFocus
          margin="dense"
          id="email"
          label="Email Address"
          type="email"
          fullWidth
          error={this.state.formSubmitted && !this.state.emailValid}
          value={this.state.email}
          onChange={this.handleBasicInput}
        />
        {this.props.registering && (
          <div>
            <TextField
              margin="dense"
              id="phone"
              label="Phone"
              type="text"
              fullWidth
              error={this.state.formSubmitted && !this.state.phoneValid}
              onChange={this.handlePhoneInput}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">+1</InputAdornment>
                )
              }}
            />
            <TextField
              margin="dense"
              id="name"
              label="Name"
              type="text"
              fullWidth
              error={this.state.formSubmitted && !this.state.nameValid}
              value={this.state.name}
              onChange={this.handleBasicInput}
            />
            <TextField
              margin="dense"
              id="address"
              label="Address"
              type="text"
              fullWidth
              error={this.state.formSubmitted && !this.state.addressValid}
              value={this.state.address}
              onChange={this.handleBasicInput}
            />
            <TextField
              margin="dense"
              id="city"
              label="City"
              type="text"
              error={this.state.formSubmitted && !this.state.cityValid}
              value={this.state.city}
              onChange={this.handleBasicInput}
            />
            <StateSelect>
              <NativeSelect
                margin="dense"
                value={this.state.state.name}
                id="state"
                label="State"
                onChange={this.handleBasicInput}
              >
                {usStates.map((state, i) => {
                  return (
                    <option key={i} value={state.name}>
                      {state.name}
                    </option>
                  )
                })}
              </NativeSelect>
            </StateSelect>
            <TextField
              margin="dense"
              id="zipCode"
              label="Zip Code"
              type="text"
              error={this.state.formSubmitted && !this.state.zipCodeValid}
              value={this.state.zipCode}
              onChange={this.handleBasicInput}
            />
          </div>
        )}
        {!this.props.forgotPassword && (
            <TextField
              margin="dense"
              id="password"
              label="Password"
              type="password"
              fullWidth
              error={this.state.formSubmitted && !this.state.passwordValid}
              value={this.state.password}
              onChange={this.handleBasicInput}
            />
          )}
      </UserInfoFormWrapper>
    )
  }
}

const UserInfoFormWrapper = styled.div`
  width: ${props => (props.fullWidth ? "26rem" : "")};
`
const StateSelect = styled.span`
  div {
    width: 8.75rem;
  }
  select {
    padding-bottom: 6px;
  }
`

export default UserInfoForm
