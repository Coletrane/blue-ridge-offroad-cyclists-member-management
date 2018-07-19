import Amplify, { Auth } from "aws-amplify"

Amplify.configure({
  Auth: {
    userPoolId: process.env.COGNITO_POOL_ID,
    userPoolWebClientId: process.env.COGNITO_CLIENT_ID,
    region: "us-east-1"
  }
})

export default {
  register: async user => {
    const attributes = {
      name: user.name,
      address: user.address,
      email: user.email
    }
    if (user.phone) {
      attributes["phone_number"] = user.phone
    }

    try {
      await Auth.signUp({
        username: user.email,
        password: user.password,
        attributes: attributes
      })
      return {
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address
      }
    } catch (err) {
      // TODO: sentry or something here
      return null
    }
  },

  forgotPassword: async email => {
    try {
      await Auth.forgotPassword(email)
      return {
        email: email
      }
    } catch (err) {
      return  null
    }
  },

  login: async (email, password) => {
    try {
      await Auth.signIn(email, password)
      const user = await Auth.currentAuthenticatedUser()
      return {
        email: user.attributes.email,
        phone: user.attributes.phone_number,
        name: user.attributes.name,
        address: user.attributes.address,
      }
    } catch (err) {
      return null
    }
  }
}
