// @flow
import React from 'react';
import { Card, Button } from 'material-ui';

type LoginProps = {
  auth: any
}

type LoginState = {
  profile: any
}

export class Login extends React.Component<LoginProps, LoginState> {
  constructor(props: LoginProps, context: any) {
    super(props, context);
    this.state = {
      profile: props.auth.getProfile()
    };
    props.auth.on('profile_updated', (newProfile) => {
      this.setState({ profile: newProfile });
      this.context.router.push('/home');
    });
  }

  render() {
    const { auth } = this.props;
    if (this.state.profile.user_id) {
      // this.context.router.push('/home');
    }
    return (
      <div>
        <h2>Login</h2>
        <Card>
          <Button color="primary" onClick={auth.loginMagiclink.bind(this)}>
            Login with Magiclink
          </Button>
          <Button color="primary" onClick={auth.loginEmailCode.bind(this)}>
            Login with Email Code
          </Button>
          <Button color="primary" onClick={auth.loginSMSCode.bind(this)}>
            Login with SMS Code
          </Button>
        </Card>
      </div>
    );
  }
}

export default Login;
