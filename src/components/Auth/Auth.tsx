import React, { useState } from 'react'
import { SupabaseClient, Provider } from '@supabase/supabase-js'
import {
  Input,
  Checkbox,
  Button,
  Icon,
  Space,
  Typography,
  Divider,
} from './../../index'
import { UserContextProvider, useUser } from './UserContext'
import * as SocialIcons from './Icons'
import './Auth.css'

const VIEWS = {
  SIGN_IN: 'sign_in',
  SIGN_UP: 'sign_up',
  FORGOTTEN_PASSWORD: 'forgotten_password',
  MAGIC_LINK: 'magic_link',
}

interface Props {
  supabaseClient: SupabaseClient
  className?: any
  style?: any
  children?: any
  authView?: any
  socialLayout?: 'horizontal' | 'vertical'
  socialColors?: boolean
  socialButtonSize?: 'tiny' | 'small' | 'medium' | 'large' | 'xlarge'
  providers?: Provider[]
  verticalSocialLayout?: any
  view?: 'sign_in' | 'sign_up' | 'forgotten_password' | 'magic_link'
}

function Auth({
  supabaseClient,
  className,
  style,
  socialLayout = 'vertical',
  socialColors = false,
  socialButtonSize = 'medium',
  providers,
  view = 'sign_in',
}: Props) {
  const [authView, setAuthView] = useState(view)

  const verticalSocialLayout = socialLayout === 'vertical' ? true : false

  let containerClasses = ['sbui-auth']
  if (className) {
    containerClasses.push(className)
  }
  const Container = (props: any) => (
    <div className={containerClasses.join(' ')} style={style}>
      <Space size={8} direction={'vertical'}>
        <SocialAuth
          supabaseClient={supabaseClient}
          verticalSocialLayout={verticalSocialLayout}
          providers={providers}
          socialLayout={socialLayout}
          socialButtonSize={socialButtonSize}
          socialColors={socialColors}
        />
        {props.children}
      </Space>
    </div>
  )

  switch (authView) {
    case VIEWS.SIGN_IN:
    case VIEWS.SIGN_UP:
      return (
        <Container>
          <EmailAuth
            supabaseClient={supabaseClient}
            authView={authView}
            setAuthView={setAuthView}
          />
        </Container>
      )
      break
    case VIEWS.FORGOTTEN_PASSWORD:
      return (
        <Container>
          <ForgottenPassword
            supabaseClient={supabaseClient}
            setAuthView={setAuthView}
          />
        </Container>
      )
      break
    case VIEWS.MAGIC_LINK:
      return (
        <Container>
          <MagicLink
            supabaseClient={supabaseClient}
            setAuthView={setAuthView}
          />
        </Container>
      )
      break
    default:
      break
  }
}

function SocialAuth({
  className,
  style,
  supabaseClient,
  children,
  socialLayout = 'vertical',
  socialColors = false,
  socialButtonSize,
  providers,
  verticalSocialLayout,
  ...props
}: Props) {
  const buttonStyles: any = {
    google: {
      backgroundColor: '#ce4430',
      color: 'white',
    },
    facebook: {
      backgroundColor: '#4267B2',
      color: 'white',
    },
    twitter: {
      backgroundColor: '#1DA1F2',
    },
    gitlab: {
      backgroundColor: '#FC6D27',
    },
    github: {
      backgroundColor: '#333',
      color: 'white',
    },
    bitbucket: {
      backgroundColor: '#205081',
      color: 'white',
    },
  }
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleProviderSignIn = async (provider: Provider) => {
    setLoading(true)
    const { error } = await supabaseClient.auth.signIn({ provider })
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <Space size={8} direction={'vertical'}>
      {providers && providers.length > 0 && (
        <React.Fragment>
          <Space size={4} direction={'vertical'}>
            <Typography.Text type="secondary" className="sbui-auth-label">
              Sign in with
            </Typography.Text>
            <Space size={2} direction={socialLayout}>
              {providers.map((provider) => {
                // @ts-ignore
                const AuthIcon = SocialIcons[provider]
                return (
                  <div
                    key={provider}
                    style={!verticalSocialLayout ? { flexGrow: 1 } : {}}
                  >
                    <Button
                      block
                      type="default"
                      shadow
                      size={socialButtonSize}
                      style={socialColors ? buttonStyles[provider] : {}}
                      icon={<AuthIcon />}
                      loading={loading}
                      onClick={() => handleProviderSignIn(provider)}
                    >
                      {verticalSocialLayout && 'Sign up with ' + provider}
                    </Button>
                  </div>
                )
              })}
            </Space>
          </Space>
          <Divider>or continue with</Divider>
        </React.Fragment>
      )}
    </Space>
  )
}

function EmailAuth({
  authView,
  setAuthView,
  supabaseClient,
}: {
  authView: any
  setAuthView: any
  supabaseClient: SupabaseClient
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    switch (authView) {
      case 'sign_in':
        const { error: signInError } = await supabaseClient.auth.signIn({
          email,
          password,
        })
        if (signInError) setError(signInError.message)
        break
      case 'sign_up':
        const { error: signUpError } = await supabaseClient.auth.signUp({
          email,
          password,
        })
        if (signUpError) setError(signUpError.message)
        break
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Space size={6} direction={'vertical'}>
        <Space size={3} direction={'vertical'}>
          <Input
            label="Email address"
            autoComplete="email"
            icon={<Icon size={21} stroke={'#666666'} type="Mail" />}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            icon={<Icon size={21} stroke={'#666666'} type="Key" />}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />
        </Space>
        <Space direction="vertical" size={6}>
          <Space style={{ justifyContent: 'space-between' }}>
            <Checkbox
              label="Remember me"
              name="remember_me"
              id="remember_me"
              onChange={(value: React.ChangeEvent<HTMLInputElement>) =>
                setRememberMe(value.target.checked)
              }
            />
            {authView === VIEWS.SIGN_IN && (
              <Typography.Link
                onClick={() => setAuthView(VIEWS.FORGOTTEN_PASSWORD)}
              >
                Forgot your password?
              </Typography.Link>
            )}
          </Space>
          <Button
            htmlType="submit"
            type="primary"
            block
            size="large"
            icon={<Icon size={21} type="Lock" />}
            loading={loading}
          >
            {authView === VIEWS.SIGN_IN ? 'Sign in' : 'Sign up'}
          </Button>
        </Space>
        <Space direction="vertical" style={{ textAlign: 'center' }}>
          {authView === VIEWS.SIGN_IN && (
            <Typography.Link onClick={() => setAuthView(VIEWS.MAGIC_LINK)}>
              Sign in with magic link
            </Typography.Link>
          )}
          {authView === VIEWS.SIGN_IN ? (
            <Typography.Link onClick={() => setAuthView(VIEWS.SIGN_UP)}>
              Don't have an account? Sign up
            </Typography.Link>
          ) : (
            <Typography.Link onClick={() => setAuthView(VIEWS.SIGN_IN)}>
              Do you have an account? Sign in.
            </Typography.Link>
          )}
          {error && <Typography.Text type="danger">{error}</Typography.Text>}
        </Space>
      </Space>
    </form>
  )
}

function MagicLink({
  setAuthView,
  supabaseClient,
}: {
  setAuthView: any
  supabaseClient: SupabaseClient
}) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleMagicLinkSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    const { error } = await supabaseClient.auth.signIn({ email })
    if (error) setError(error.message)
    else setMessage('Check your email for the magic link.')
    setLoading(false)
  }

  return (
    <form onSubmit={handleMagicLinkSignIn}>
      <Space size={4} direction={'vertical'}>
        <Space size={3} direction={'vertical'}>
          <Input
            label="Email address"
            placeholder="Your email address"
            icon={<Icon size={21} stroke={'#666666'} type="Mail" />}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
          <Button
            block
            size="large"
            htmlType="submit"
            icon={<Icon size={21} type="Inbox" />}
            loading={loading}
          >
            Send magic link
          </Button>
        </Space>
        <Typography.Link onClick={() => setAuthView(VIEWS.SIGN_IN)}>
          Sign in with password.
        </Typography.Link>
        {message && <Typography.Text>{message}</Typography.Text>}
        {error && <Typography.Text type="danger">{error}</Typography.Text>}
      </Space>
    </form>
  )
}

function ForgottenPassword({
  setAuthView,
  supabaseClient,
}: {
  setAuthView: any
  supabaseClient: SupabaseClient
}) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    const { error } = await supabaseClient.auth.api.resetPasswordForEmail(email)
    if (error) setError(error.message)
    else setMessage('Check your email for the password reset link.')
    setLoading(false)
  }

  return (
    <form onSubmit={handlePasswordReset}>
      <Space size={4} direction={'vertical'}>
        <Space size={3} direction={'vertical'}>
          <Input
            label="Email address"
            placeholder="Your email address"
            icon={<Icon size={21} stroke={'#666666'} type="Mail" />}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
          <Button
            block
            size="large"
            htmlType="submit"
            icon={<Icon size={21} type="Inbox" />}
            loading={loading}
          >
            Send reset password instructions
          </Button>
        </Space>
        <Typography.Link onClick={() => setAuthView(VIEWS.SIGN_IN)}>
          Go back to sign in
        </Typography.Link>
        {message && <Typography.Text>{message}</Typography.Text>}
        {error && <Typography.Text type="danger">{error}</Typography.Text>}
      </Space>
    </form>
  )
}

function UpdatePassword({
  supabaseClient,
}: {
  supabaseClient: SupabaseClient
}) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    const { error } = await supabaseClient.auth.update({ password })
    if (error) setError(error.message)
    else setMessage('Your password has been updated.')
    setLoading(false)
  }

  return (
    <form onSubmit={handlePasswordReset}>
      <Space size={4} direction={'vertical'}>
        <Space size={3} direction={'vertical'}>
          <Input
            label="New password"
            placeholder="Enter your new password"
            type="password"
            icon={<Icon size={21} stroke={'#666666'} type="Key" />}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />
          <Button
            block
            size="large"
            htmlType="submit"
            icon={<Icon size={21} type="Key" />}
            loading={loading}
          >
            Update password
          </Button>
        </Space>
        {message && <Typography.Text>{message}</Typography.Text>}
        {error && <Typography.Text type="danger">{error}</Typography.Text>}
      </Space>
    </form>
  )
}

Auth.ForgottenPassword = ForgottenPassword
Auth.UpdatePassword = UpdatePassword
Auth.MagicLink = MagicLink
Auth.UserContextProvider = UserContextProvider
Auth.useUser = useUser

export default Auth
