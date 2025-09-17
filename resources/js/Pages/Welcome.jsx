import { Head } from "@inertiajs/react";
import { useState, useEffect } from "react";
import {
    Code2,
    Database,
    Lock,
    Unlock,
    Zap,
    Globe,
    ArrowRight,
    Check,
    Star,
    Users,
    Shield,
    Rocket,
    X,
    Activity,
    Layers,
    Terminal,
    GitBranch,
    Cpu,
    Cloud,
    Settings,
    Monitor,
    Smartphone,
    Wifi,
    Download,
    Upload,
    BarChart3,
    TrendingUp,
    MousePointer2,
    Sparkles,
    Heart,
    Zap as Lightning,
    Atom,
    CircleDot as Orbit,
    Gauge,
    Radar,
    Radio,
    Signal,
    Waves,
    Brackets
} from "lucide-react";
import { usePage } from "@inertiajs/react";

export default function Welcome({ auth }) {
    const [hoveredFeature, setHoveredFeature] = useState(null);
    const [activeTab, setActiveTab] = useState("json");
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [scrollY, setScrollY] = useState(0);
    const [isVisible, setIsVisible] = useState({});

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    setIsVisible(prev => ({
                        ...prev,
                        [entry.target.id]: entry.isIntersecting
                    }));
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll('[data-animate]').forEach((el) => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const handleClick = () => {
        if (auth.user) {
            window.location.href = "/Create";
        } else {
            window.location.href = "/login";
        }
    };

    const features = [
        {
            icon: <Code2 className="w-8 h-8" />,
            title: "Bez programmēšanas",
            description: "Izveidojiet API ar vienkāršām formām. Nav nepieciešamas programmēšanas zināšanas.",
            color: "from-blue-400 to-blue-600",
            delay: "0ms"
        },
        {
            icon: <Lightning className="w-8 h-8" />,
            title: "Automātiska ģenerācija",
            description: "Routes un endpoints tiek ģenerēti automātiski pēc jūsu specifikācijas.",
            color: "from-purple-400 to-purple-600",
            delay: "100ms"
        },
        {
            icon: <Database className="w-8 h-8" />,
            title: "Fleksīga datu struktūra",
            description: "Atbalsts JSON un citiem datu formātiem. Pilnībā pielāgojams.",
            color: "from-green-400 to-green-600",
            delay: "200ms"
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: "Privātums un drošība",
            description: "Izvēlieties starp publiskām un privātām API. Pilna kontrole pār piekļuvi.",
            color: "from-red-400 to-red-600",
            delay: "300ms"
        },
    ];

    const floatingIcons = [
        { icon: <Cpu className="w-6 h-6" />, x: 10, y: 20, speed: 0.5 },
        { icon: <Cloud className="w-8 h-8" />, x: 80, y: 30, speed: 0.3 },
        { icon: <Atom className="w-5 h-5" />, x: 20, y: 70, speed: 0.7 },
        { icon: <Orbit className="w-7 h-7" />, x: 90, y: 60, speed: 0.4 },
        { icon: <Radio className="w-6 h-6" />, x: 60, y: 10, speed: 0.6 },
        { icon: <Signal className="w-5 h-5" />, x: 40, y: 80, speed: 0.5 },
        { icon: <Waves className="w-8 h-8" />, x: 70, y: 40, speed: 0.3 },
        { icon: <Radar className="w-6 h-6" />, x: 30, y: 50, speed: 0.8 }
    ];

    const apiExamples = {
        json: `{
  "users": [
    {
      "id": 1,
      "name": "Jānis Bērziņš",
      "email": "janis@example.com",
      "role": "admin"
    },
    {
      "id": 2,
      "name": "Anna Kalniņa", 
      "email": "anna@example.com",
      "role": "user"
    }
  ]
}`,
    };

    return (
        <>
            <Head title="API Builder" />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-black overflow-hidden">
                <nav className="border-b border-gray-200/50 bg-white/80 backdrop-blur-md fixed w-full z-50 transition-all duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center space-x-2 group">
                                <div className="w-8 h-8 bg-gradient-to-br from-black to-gray-700 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                                    <Code2 className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
                                    API Builder
                                </span>
                            </div>
                            <div className="flex items-center">
                                {auth?.user ? (
                                    <div className="text-black font-medium flex items-center space-x-2 animate-fade-in">
                                        <span>Sveiks, {auth.user.name}!</span>
                                    </div>
                                ) : (
                                    <button 
                                        className="text-gray-700 hover:text-black font-medium transition-all duration-300 hover:scale-105 flex items-center space-x-2 group"
                                        onClick={handleClick}
                                    >   
                                        <MousePointer2 className="w-4 h-4 group-hover:text-blue-500 transition-colors" />
                                        <span>Piereģistrēties</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                <section className="pt-32 pb-20 px-4 relative">
                    <div className="max-w-7xl mx-auto text-center relative z-20">
                        <div className="mb-8">

                            
                            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight animate-fade-in-up">
                                Izveidojiet savu
                                <span className="block bg-gradient-to-r from-black via-gray-600 to-gray-400 bg-clip-text text-transparent ">
                                    API bez koda
                                </span>
                            </h1>
                            
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
                                Unikāla platforma, kas ļauj jums izveidot
                                personalizētu API, izmantojot vienkāršas formas.
                                Bez programmēšanas zināšanām. Bez sarežģījumiem.
                                Tikai rezultāts.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
                                <button
                                    onClick={handleClick}
                                    className="group bg-gradient-to-r from-gray-600 to-gray-600 text-white px-10 py-5 rounded-2xl text-lg font-bold hover:from-gray-700 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <Zap className="mr-3 w-6 h-6 group-hover:animate-pulse" />
                                    Sākt tagad
                                    <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>

                        {/* Animated Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto" data-animate id="stats">
                            {[
                                { icon: <TrendingUp className="w-8 h-8" />, title: "Ātrs", subtitle: "API izveides laiks", color: "text-green-500" },
                                { icon: <Gauge className="w-8 h-8" />, title: "0%", subtitle: "Programmēšanas zināšanas", color: "text-blue-500" },
                                { icon: <Sparkles className="w-8 h-8" />, title: "∞", subtitle: "Iespējas", color: "text-purple-500" }
                            ].map((stat, index) => (
                                <div 
                                    key={index}
                                    className={`text-center group transition-all duration-500 ${isVisible.stats ? 'animate-bounce-in' : 'opacity-0'}`}
                                    style={{ animationDelay: `${index * 0.2}s` }}
                                >
                                    <div className={`${stat.color} mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300`}>
                                        {stat.icon}
                                    </div>
                                    <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                        {stat.title}
                                    </div>
                                    <div className="text-gray-600 group-hover:text-gray-800 transition-colors">
                                        {stat.subtitle}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 relative" data-animate>
                    <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                    <div className="max-w-7xl mx-auto px-4 relative z-10">
                        <div className={`text-center mb-20 transition-all duration-700 ${isVisible.features ? 'animate-fade-in-up' : 'opacity-0 translate-y-10'}`}>
                            <div className="flex justify-center mb-6">
                                <div className="relative">
                                    <div className="absolute -inset-2">
                                        <div className="w-16 h-16 border-2 border-yellow-200 rounded-full animate-ping opacity-20"></div>
                                    </div>
                                </div>
                            </div>
                            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                Kāpēc izvēlēties API Builder?
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Mēs padarām API izveidi tik vienkāršu, ka to var izdarīt ikviens
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className={`group bg-white/80 backdrop-blur-sm p-8 rounded-3xl border-2 transition-all duration-500 cursor-pointer hover:shadow-2xl relative overflow-hidden ${
                                        hoveredFeature === index
                                            ? "border-transparent shadow-2xl transform -translate-y-4 scale-105"
                                            : "border-gray-200/50 hover:border-gray-300"
                                    } ${isVisible.features ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`}
                                    style={{ 
                                        animationDelay: feature.delay,
                                        animationFillMode: 'forwards'
                                    }}
                                    onMouseEnter={() => setHoveredFeature(index)}
                                    onMouseLeave={() => setHoveredFeature(null)}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                                    
                                    <div className="relative z-10">
                                        <div className={`mb-6 p-3 bg-gradient-to-br ${feature.color} rounded-2xl w-fit group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                                            <div className="text-white">
                                                {feature.icon}
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold mb-4 group-hover:text-gray-800 transition-colors">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-600 group-hover:text-gray-700 transition-colors leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                    
                                    {hoveredFeature === index && (
                                        <div className="absolute bottom-4 right-4">
                                            <ArrowRight className="w-5 h-5 text-gray-400 animate-bounce-x" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How it works */}
                <section id="how-it-works" className="py-24 relative" data-animate>
                    <div className="max-w-7xl mx-auto px-4">
                        <div className={`text-center mb-20 transition-all duration-700 ${isVisible['how-it-works'] ? 'animate-fade-in-up' : 'opacity-0 translate-y-10'}`}>

                            <h2 className="text-5xl font-bold mb-6 bg-black bg-clip-text text-transparent">
                                Kā tas darbojas?
                            </h2>
                            <p className="text-xl text-gray-700">
                                Trīs vienkārši soļi līdz jūsu API
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            <div className="space-y-10">
                                {[
                                    {
                                        icon: <Terminal className="w-8 h-8" />,
                                        title: "Definējiet datu struktūru",
                                        description: "Ievadiet savus datus JSON formātā vai izvēlieties citu piemērotu struktūru. Mūsu intuitīvais redaktors palīdzēs jums.",
                                        color: "from-black to-gray-500"
                                    },
                                    {
                                        icon: <Layers className="w-8 h-8" />,
                                        title: "Konfigurējiet API",
                                        description: "Norādiet, vai jūsu API būs publisks vai privāts. Sistēma automātiski ģenerēs visus nepieciešamos endpoints.",
                                        color: "from-black to-gray-500"
                                    },
                                    {
                                        icon: <Wifi className="w-8 h-8" />,
                                        title: "Izmantojiet un testējiet",
                                        description: "Jūsu API ir gatavs lietošanai! Saņemiet unikālu URL un sāciet integrēt savās aplikācijās.",
                                        color: "from-black to-gray-500"
                                    }
                                ].map((step, index) => (
                                    <div 
                                        key={index}
                                        className={`flex items-start space-x-6 group transition-all duration-500 ${isVisible['how-it-works'] ? 'animate-slide-right' : 'opacity-0 translate-x-10'}`}
                                        style={{ animationDelay: `${index * 0.2}s`, animationFillMode: 'forwards' }}
                                    >
                                        <div className="relative">
                                            <div className={`w-14 h-14 bg-gradient-to-br ${step.color} text-white rounded-2xl flex items-center justify-center font-bold text-xl flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                                                {index + 1}
                                            </div>
                                            <div className={`absolute -inset-1 bg-gradient-to-br ${step.color} rounded-2xl opacity-0 group-hover:opacity-10 blur transition-opacity duration-300`}></div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center mb-3">

                                                <h3 className="text-xl font-bold group-hover:text-gray-800 transition-colors">
                                                    {step.title}
                                                </h3>
                                            </div>
                                            <p className="text-gray-800 group-hover:text-gray-700 transition-colors leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={`relative transition-all duration-700 ${isVisible['how-it-works'] ? 'animate-slide-left' : 'opacity-0 translate-x-10'}`} style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                                <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="flex space-x-2">
                                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                                        </div>
                                        <span className="text-gray-400 text-sm">API-Builder.json</span>
                                    </div>
                                    <div className="flex space-x-2 mb-6">
                                        <button
                                            onClick={() => setActiveTab("json")}
                                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                                                activeTab === "json"
                                                    ? "bg-gray-800 text-white shadow-lg"
                                                    : "text-gray-400 hover:text-white hover:bg-gray-700"
                                            }`}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <Code2 className="w-4 h-4" />
                                                <span>JSON</span>
                                            </div>
                                        </button>
                                    </div>
                                    <pre className="text-gray-300 text-sm overflow-x-auto leading-relaxed">
                                        <code>{apiExamples[activeTab]}</code>
                                    </pre>
                                    <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* API Functionality */}
                <section className="py-24 bg-gradient-to-br from-slate-50 to-indigo-50 relative" data-animate id="functionality">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className={`text-center mb-20 transition-all duration-700 ${isVisible.functionality ? 'animate-fade-in-up' : 'opacity-0 translate-y-10'}`}>
                            <h2 className="text-5xl font-bold mb-6 bg-black bg-clip-text text-transparent">
                                API funkcionalitāte
                            </h2>
                            <p className="text-xl text-gray-600">
                                Pilnvērtīgs API ar visām nepieciešamajām funkcijām
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: <Globe className="w-10 h-10" />,
                                    title: "RESTful endpoints",
                                    items: [
                                        { method: "GET", path: "/your-resource", color: "bg-green-100 text-green-800" },
                                        { method: "POST", path: "/your-resource", color: "bg-blue-100 text-blue-800" },
                                        { method: "PUT", path: "/your-resource", color: "bg-yellow-100 text-yellow-800" },
                                        { method: "DELETE", path: "/your-resource", color: "bg-red-100 text-red-800" }
                                    ],
                                    color: "from-blue-500 to-cyan-500"
                                },
                                {
                                    icon: <Shield className="w-10 h-10" />,
                                    title: "Drošība",
                                    items: [
                                        { text: "API atslēgas", icon: <Check className="w-4 h-4 text-green-500" /> },
                                        { text: "Rate limiting", icon: <Check className="w-4 h-4 text-green-500" /> },
                                        { text: "CORS atbalsts", icon: <Check className="w-4 h-4 text-green-500" /> },
                                        { text: "HTTPS šifrēšana", icon: <X className="w-4 h-4 text-red-500" /> }
                                    ],
                                    color: "from-red-500 to-pink-500"
                                },
                                {
                                    icon: <Rocket className="w-10 h-10" />,
                                    title: "Papildu funkcijas",
                                    items: [
                                        { text: "Datu validācija", icon: <Check className="w-4 h-4 text-green-500" /> },
                                        { text: "Automātiska dokumentācija", icon: <Check className="w-4 h-4 text-green-500" /> },
                                        { text: "Real-time monitorings", icon: <Check className="w-4 h-4 text-green-500" /> },
                                        { text: "Webhook atbalsts", icon: <Check className="w-4 h-4 text-green-500" /> }
                                    ],
                                    color: "from-purple-500 to-indigo-500"
                                }
                            ].map((feature, index) => (
                                <div
                                    key={index}
                                    className={`group bg-white/80 backdrop-blur-sm p-8 rounded-3xl border-2 border-gray-200/50 hover:border-transparent transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden ${isVisible.functionality ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`}
                                    style={{ animationDelay: `${index * 0.15}s`, animationFillMode: 'forwards' }}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                                    
                                    <div className="relative z-10">
                                        <div className={`p-4 bg-gradient-to-br ${feature.color} rounded-2xl w-fit mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                                            <div className="text-white">
                                                {feature.icon}
                                            </div>
                                        </div>
                                        
                                        <h3 className="text-xl font-bold mb-6 group-hover:text-gray-800 transition-colors">
                                            {feature.title}
                                        </h3>
                                        
                                        <div className="space-y-3">
                                            {feature.items.map((item, itemIndex) => (
                                                <div 
                                                    key={itemIndex} 
                                                    className="flex items-center justify-between text-sm transition-all duration-300 hover:translate-x-1"
                                                    style={{ animationDelay: `${itemIndex * 0.1}s` }}
                                                >
                                                    {item.method ? (
                                                        <>
                                                            <span className={`${item.color} px-3 py-1 rounded-lg font-medium`}>
                                                                {item.method}
                                                            </span>
                                                            <span className="text-gray-600 font-mono text-xs">{item.path}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="flex items-center">
                                                                {item.icon}
                                                                <span className="ml-2 text-gray-700">{item.text}</span>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-gray-200/50 py-16 bg-gradient-to-br from-gray-50 to-slate-100 relative overflow-hidden">
                    
                    
                    <div className="max-w-7xl mx-auto px-4 relative z-10">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="flex items-center space-x-3 mb-6 md:mb-0 group">
                                <div className="w-10 h-10 bg-gradient-to-br from-black to-gray-700 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                                    <Code2 className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-2xl font-bold bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
                                    API Builder
                                </span>
                            </div>
                            
                            <div className="text-center md:text-right">
                                <div className="flex items-center justify-center md:justify-end mb-2">
                                    <p className="text-gray-600">
                                        &copy; 2025 API Builder
                                    </p>
                                </div>
                                <div className="flex items-center justify-center md:justify-end space-x-2">
                                    <Users className="w-4 h-4 text-blue-500" />
                                    <p className="text-sm text-gray-500">
                                        Izveidoja Ričards Eihentāls
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

            <style jsx>{`
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes slide-right {
                    from {
                        opacity: 0;
                        transform: translateX(-50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes slide-left {
                    from {
                        opacity: 0;
                        transform: translateX(50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes bounce-in {
                    0% {
                        opacity: 0;
                        transform: scale(0.3);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.05);
                    }
                    70% { transform: scale(0.9); }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                @keyframes bounce-x {
                    0%, 100% { transform: translateX(0); }
                    50% { transform: translateX(5px); }
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    33% { transform: translateY(-10px) rotate(120deg); }
                    66% { transform: translateY(5px) rotate(240deg); }
                }
                
                .animate-gradient {
                    background-size: 400% 400%;
                    animation: gradient 4s ease infinite;
                }
                
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease forwards;
                }
                
                .animate-slide-up {
                    animation: slide-up 0.6s ease forwards;
                }
                
                .animate-slide-right {
                    animation: slide-right 0.6s ease forwards;
                }
                
                .animate-slide-left {
                    animation: slide-left 0.6s ease forwards;
                }
                
                .animate-bounce-in {
                    animation: bounce-in 0.6s ease forwards;
                }
                
                .animate-bounce-x {
                    animation: bounce-x 1s ease-in-out infinite;
                }
                
                .animate-float {
                    animation: float linear infinite;
                }
                
                .bg-grid-pattern {
                    background-image: 
                        linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px);
                    background-size: 50px 50px;
                }
            `}</style>
        </>
    );
}