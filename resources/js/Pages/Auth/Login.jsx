import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Code2, Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

// Custom styled components matching the API Builder theme
const InputLabel = ({ htmlFor, value, className = "" }) => (
    <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 mb-2 ${className}`}>
        {value}
    </label>
);

const TextInput = ({ icon: Icon, error, className = "", ...props }) => (
    <div className="relative">
        {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="h-5 w-5 text-gray-400" />
            </div>
        )}
        <input
            {...props}
            className={`
                block w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-3 
                border-2 ${error ? 'border-red-300' : 'border-gray-200'} 
                rounded-lg text-gray-900 placeholder-gray-400
                focus:outline-none focus:ring-0 focus:border-black
                transition-colors duration-200
                ${className}
            `}
        />
    </div>
);

const InputError = ({ message, className = "" }) => (
    message ? (
        <div className={`flex items-center mt-2 text-sm text-red-600 ${className}`}>
            <AlertCircle className="w-4 h-4 mr-1" />
            {message}
        </div>
    ) : null
);

const Checkbox = ({ className = "", ...props }) => (
    <input
        {...props}
        type="checkbox"
        className={`
            h-4 w-4 text-black focus:ring-black border-gray-300 rounded
            transition-colors duration-200
            ${className}
        `}
    />
);

const PrimaryButton = ({ children, disabled, className = "", ...props }) => (
    <button
        {...props}
        disabled={disabled}
        className={`
            bg-black text-white px-6 py-3 rounded-lg font-semibold
            hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2
            transition-all duration-200 transform hover:scale-105
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
            flex items-center justify-center space-x-2
            ${className}
        `}
    >
        {children}
    </button>
);

const GoogleButton = ({ children, className = "", ...props }) => (
    <button
        {...props}
        className={`
            bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold
            hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2
            transition-all duration-200 transform hover:scale-105
            flex items-center justify-center space-x-3 w-full
            ${className}
        `}
    >
        {children}
    </button>
);

// Google SVG Icon component
const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
    </svg>
);

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const handleGoogleLogin = () => {
        window.location.href = route('auth.google');
    };

    return (
        <>
            <Head title="Pieslēgties - API Builder" />
            <div className="min-h-screen bg-white flex">
                {/* Left side - Branding */}
                <div className="hidden lg:flex lg:w-1/2 bg-gray-50 flex-col justify-center px-12">
                    <div className="max-w-md mx-auto">
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                                <Code2 className="w-7 h-7 text-white" />
                            </div>
                            <span className="text-2xl font-bold">API Builder</span>
                        </div>
                        
                        <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                            Izveidojiet savu
                            <span className="block bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
                                API bez koda
                            </span>
                        </h1>
                        
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            Pievienojieties tūkstošiem izstrādātāju, kas izmanto mūsu platformu API izveidei.
                        </p>
                        
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-black rounded-full"></div>
                                <span className="text-gray-600">Nav nepieciešamas programmēšanas zināšanas</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-black rounded-full"></div>
                                <span className="text-gray-600">Automātiska API dokumentācija</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-black rounded-full"></div>
                                <span className="text-gray-600">Pilna drošība un kontrole</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side - Login Form */}
                <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16">
                    <div className="max-w-md mx-auto w-full">
                        {/* Mobile logo */}
                        <div className="lg:hidden flex items-center space-x-3 mb-8 justify-center">
                            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                                <Code2 className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold">API Builder</span>
                        </div>

                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Laipni lūdzam atpakaļ!
                            </h2>
                            <p className="text-gray-600">
                                Pieslēdzieties savam kontam, lai turpinātu
                            </p>
                        </div>

                        {status && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="text-sm font-medium text-green-600">
                                    {status}
                                </div>
                            </div>
                        )}

                        <div className="space-y-6">
                            {/* Google Login Button */}
                            <GoogleButton onClick={handleGoogleLogin}>
                                <GoogleIcon />
                                <span>Turpināt ar Google</span>
                            </GoogleButton>

                            {/* Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-500 font-medium">vai</span>
                                </div>
                            </div>

                            <div>
                                <InputLabel htmlFor="email" value="E-pasta adrese" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    placeholder="janis@example.com"
                                    icon={Mail}
                                    error={errors.email}
                                    autoComplete="username"
                                    autoFocus
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div>
                                <InputLabel htmlFor="password" value="Parole" />
                                <div className="relative">
                                    <TextInput
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        placeholder="••••••••"
                                        icon={Lock}
                                        error={errors.password}
                                        autoComplete="current-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="pr-12"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        )}
                                    </button>
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                    />
                                    <span className="ml-2 text-sm text-gray-600">
                                        Atcerēties mani
                                    </span>
                                </label>


                            </div>

                            <PrimaryButton
                                disabled={processing}
                                className="w-full"
                                onClick={submit}
                            >
                                <span>Pieslēgties</span>
                                <ArrowRight className="w-4 h-4" />
                            </PrimaryButton>
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-gray-600">
                                Nav konta?{' '}
                                <Link 
                                    href={route('register')} 
                                    className="text-black hover:text-gray-600 font-medium transition-colors"
                                >
                                    Reģistrēties tagad
                                </Link>
                            </p>
                        </div>
                        
                        {/* Security notice */}
                        <div className="mt-6 text-center">
                            <p className="text-xs text-gray-400">
                                Pieslēdzoties, jūs piekrītat mūsu{' '}
                                <Link href="#" className="text-gray-500 hover:text-gray-700 underline">
                                    lietošanas noteikumiem
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}