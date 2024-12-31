interface Props {
    children: React.ReactNode;
}

const AuthLayout = ({ children }: Props) => {
    return (
        <div className="w-full min-h-screen flex items-center justify-center">{children}</div>
    )
}

export default AuthLayout;