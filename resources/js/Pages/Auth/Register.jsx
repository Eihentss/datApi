import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Code2, Eye, EyeOff, Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';

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

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (!acceptTerms) {
            return;
        }
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Reģistrēties - API Builder" />
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
                            Sāciet savu
                            <span className="block bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
                                API ceļojumu
                            </span>
                        </h1>
                        
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            Pievienojieties tūkstošiem izstrādātāju, kas jau izmanto mūsu platformu.
                        </p>
                        
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-black rounded-full"></div>
                                <span className="text-gray-600">Bezmaksas</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-black rounded-full"></div>
                                <span className="text-gray-600">Nav nepieciešama kredītkarte</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-black rounded-full"></div>
                                <span className="text-gray-600">Pilna funkcionalitāte</span>
                            </div>
                        </div>
                        

                    </div>
                </div>

                {/* Right side - Register Form */}
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
                                Izveidojiet kontu
                            </h2>
                            <p className="text-gray-600">
                                Sāciet veidot savu API bez koda jau šodien
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="name" value="Pilns vārds" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    placeholder="Jānis Bērziņš"
                                    icon={User}
                                    error={errors.name}
                                    autoComplete="name"
                                    autoFocus
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} />
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
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
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
                                        placeholder="Vismaz 8 rakstzīmes"
                                        icon={Lock}
                                        error={errors.password}
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="pr-12"
                                        required
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

                            <div>
                                <InputLabel htmlFor="password_confirmation" value="Apstiprināt paroli" />
                                <div className="relative">
                                    <TextInput
                                        id="password_confirmation"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        placeholder="Atkārtojiet paroli"
                                        icon={Lock}
                                        error={errors.password_confirmation}
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="pr-12"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        )}
                                    </button>
                                </div>
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <div className="flex items-start space-x-3">
                                <Checkbox
                                    id="terms"
                                    checked={acceptTerms}
                                    onChange={(e) => setAcceptTerms(e.target.checked)}
                                    className="mt-1"
                                />
                                <label htmlFor="terms" className="text-sm text-gray-600 leading-5">
                                    Es piekrītu{' '}
                                    <Link 
                                        href="#" 
                                        className="text-black hover:text-gray-600 font-medium transition-colors"
                                    >
                                        lietošanas noteikumiem
                                    </Link>
                                    {' '}un{' '}
                                    <Link 
                                        href="#" 
                                        className="text-black hover:text-gray-600 font-medium transition-colors"
                                    >
                                        privātuma politikai
                                    </Link>
                                </label>
                            </div>

                            <PrimaryButton
                                disabled={processing || !acceptTerms}
                                className="w-full"
                                type="submit"
                            >
                                <span>Izveidot kontu</span>
                                <ArrowRight className="w-4 h-4" />
                            </PrimaryButton>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-gray-600">
                                Jau ir konts?{' '}
                                <Link 
                                    href={route('login')} 
                                    className="text-black hover:text-gray-600 font-medium transition-colors"
                                >
                                    Pieslēgties šeit
                                </Link>
                            </p>
                        </div>

                        {/* Trust indicators */}
                        
                    </div>
                </div>
            </div>
        </>
    );
}